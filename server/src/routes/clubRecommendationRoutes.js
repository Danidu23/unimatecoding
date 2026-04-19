const express = require('express');
const router = express.Router();
const Club = require('../models/Club');
const Application = require('../models/Application');
const { protect } = require('../middleware/authMiddleware');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const ChatHistory = require('../models/ChatHistory');

/* Gemini setup */
const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

/*
  GET /api/clubs/recommendations/history
  Get user's chat history
*/
router.get('/history', protect, async (req, res) => {
  try {
    const history = await ChatHistory.findOne({ user: req.user._id });
    res.json(history ? history.messages : []);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

/*
  GET /api/clubs/recommendations/summary
  Get user's chat summary
*/
router.get('/summary', protect, async (req, res) => {
  try {
    const history = await ChatHistory.findOne({ user: req.user._id });
    res.json({ summary: history?.summary || '' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

/*
  DELETE /api/clubs/recommendations/history/clear
  Clear user's chat history
*/
router.delete('/history/clear', protect, async (req, res) => {
  try {
    await ChatHistory.findOneAndDelete({ user: req.user._id });
    res.json({ message: 'Chat history cleared' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

/*
  POST /api/clubs/recommendations
  Questionnaire-based recommendations (tag matching, no AI)
*/
router.post('/', protect, async (req, res) => {
  try {
    const { skills = [], activities = [], commitment = '' } = req.body;

    const userTags = [
      ...skills.map(s => s.toLowerCase().replace(/\s+/g, '_')),
      ...activities.map(a => a.toLowerCase().replace(/\s+/g, '_')),
      commitment.toLowerCase(),
    ].filter(Boolean);

    const clubs = await Club.find();

    const scored = clubs.map(club => {
      const clubTags = club.tags.map(t => t.toLowerCase());
      const matchScore = userTags.reduce((score, tag) => {
        return score + (clubTags.some(ct => ct.includes(tag) || tag.includes(ct)) ? 1 : 0);
      }, 0);
      return { club, matchScore };
    });

    const top3 = scored
      .filter(s => s.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 3)
      .map(s => ({ ...s.club.toObject(), matchScore: s.matchScore }));

    if (top3.length < 3) {
      const existing = new Set(top3.map(c => c._id.toString()));
      const extras = clubs
        .filter(c => !existing.has(c._id.toString()))
        .slice(0, 3 - top3.length)
        .map(c => ({ ...c.toObject(), matchScore: 0 }));
      top3.push(...extras);
    }

    let explanation = '';
    try {
      if (genAI) {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
        const prompt = `You are an expert student advisor at SLIIT.\n\nStudent inputs:\n- Skills: ${skills.join(', ') || 'None'}\n- Interests: ${activities.join(', ') || 'None'}\n- Weekly commitment: ${commitment || 'Not specified'}\n\nTop matched clubs:\n${top3.map((c, i) => `${i + 1}. ${c.name} (${c.category}) - ${c.description}`).join('\n')}\n\nWrite a short, friendly 3-5 sentence explanation of why these clubs fit the student. Mention at least two of the student's inputs. Avoid emojis and keep it under 120 words.`;
        const result = await model.generateContent(prompt);
        explanation = result.response.text().trim();
      }
    } catch (_) {
      explanation = '';
    }

    if (!explanation) {
      const skillPart = skills.length ? skills.join(', ') : 'your goals';
      const actPart = activities.length ? activities.join(', ') : 'your interests';
      explanation = `These clubs align with ${skillPart} and ${actPart}, while matching your ${commitment || 'time availability'}. Each recommendation shares themes found in your selections and offers activities that can help you grow in those areas.`;
    }

    res.json({ recommendations: top3, explanation });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

/*
  Keyword-based fallback when Gemini is unavailable
*/
function keywordFallback(clubs, message) {
  const words = message.toLowerCase().split(/\W+/).filter(w => w.length > 3);

  const scored = clubs.map(club => {
    const clubTags = club.tags.map(t => t.toLowerCase());
    const clubCat = club.category.toLowerCase();
    let score = 0;
    words.forEach(word => {
      if (clubTags.some(t => t.includes(word) || word.includes(t))) score += 2;
      if (clubCat.includes(word) || word.includes(clubCat)) score += 3;
    });
    return { club, score };
  });

  const topMatches = scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(s => ({ ...s.club, matchScore: 85 + Math.floor(Math.random() * 10) }));

  const names = topMatches.slice(0, 2).map(c => c.name).join(' and ');
  const fallbackMsg = topMatches.length > 0
    ? `Based on your interests, I found some great matches for you! Check out ${names} in the recommendations panel. Note: Gemini AI is at its free-tier minute limit right now, so I used smart keyword matching. Try again in a minute for a full AI response!`
    : `I would love to help you explore clubs! Based on your message, try browsing our full clubs list. Note: Gemini AI is briefly at capacity. Please try again in a minute for personalised recommendations!`;

  return { response: fallbackMsg, recommendations: topMatches };
}

/*
  POST /api/clubs/recommendations/chat
  Body: { message: '', history: [] }
  Gemini-powered conversational club advisor with RAG context injection
*/
router.post('/chat', protect, async (req, res) => {
  const { message = '', userContext = {} } = req.body;

  let clubs = [];
  try {
    clubs = await Club.find().lean();
  } catch (dbErr) {
    return res.status(500).json({ message: 'Database error', error: dbErr.message });
  }

  const clubKnowledge = clubs.map((c, i) =>
    `${i + 1}. Name: "${c.name}" | Category: ${c.category} | Tags: ${c.tags.join(', ')} | Members: ${c.memberCount} | About: ${c.about || c.description}`
  ).join('\n');

  let applications = [];
  try {
    applications = await Application.find({ studentId: req.user._id })
      .populate('clubId', 'name category tags')
      .lean();
  } catch (_) {
    applications = [];
  }

  const quiz = userContext?.quiz || null;
  const contextLines = [];
  if (quiz) {
    const skills = Array.isArray(quiz.skills) ? quiz.skills.join(', ') : '';
    const activities = Array.isArray(quiz.activities) ? quiz.activities.join(', ') : '';
    const commitment = quiz.commitment || '';
    contextLines.push(`Quiz profile: Skills: ${skills || 'None'} | Interests: ${activities || 'None'} | Commitment: ${commitment || 'Not specified'}`);
  }
  if (applications.length > 0) {
    const appSummary = applications
      .map(a => `${a.clubId?.name || 'Club'} (${a.status})`)
      .join(', ');
    contextLines.push(`Current applications: ${appSummary}`);
  }

  const systemPrompt = [
    'You are "UniMate Assistant", the expert AI Club and Societies Advisor for SLIIT University UniMate platform.',
    'Help students find the perfect club or society from the list below.',
    '',
    contextLines.length ? '=== STUDENT CONTEXT ===' : '',
    contextLines.length ? contextLines.join('\n') : '',
    contextLines.length ? '=== END CONTEXT ===' : '',
    '',
    '=== AVAILABLE CLUBS ===',
    clubKnowledge,
    '=== END OF CLUB LIST ===',
    '',
    'RULES:',
    '- Only recommend clubs from the list above. Do NOT invent clubs.',
    '- Be warm, encouraging, and conversational like a helpful senior student.',
    '- When recommending clubs, name them clearly.',
    '- At the END of replies recommending clubs, append exactly this on its own line:',
    '  |||RECOMMENDATIONS:["ExactClubName1","ExactClubName2"]|||',
    '  Use exact club names. Max 3. Omit if not recommending.',
    '- Keep answers under 200 words.',
    '- If asked something unrelated to SLIIT clubs, steer back to clubs.',
  ].join('\n');

  let chatHistory = await ChatHistory.findOne({ user: req.user._id });
  if (!chatHistory) chatHistory = new ChatHistory({ user: req.user._id, messages: [] });

  // Build valid history for Gemini from DB
  const validHistory = [];
  // Ensure we only process even pairs for Gemini (user, then bot)
  let userMsgTemp = null;
  for (const msg of chatHistory.messages) {
    if (msg.type === 'user') {
      userMsgTemp = msg;
    } else if (msg.type === 'bot' && userMsgTemp) {
      validHistory.push(
        { role: 'user', parts: [{ text: userMsgTemp.text }] },
        { role: 'model', parts: [{ text: msg.text }] }
      );
      userMsgTemp = null;
    }
  }

  if (!genAI) {
    const fallback = keywordFallback(clubs, message);
    return res.json({ ...fallback, reasons: {}, summary: '' });
  }

  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      systemInstruction: systemPrompt,
    });

    const chat = model.startChat({ history: validHistory });
    const result = await chat.sendMessage(message);
    let rawResponse = result.response.text();

    // Extract hidden recommendations block
    let recommendedClubs = [];
    const recMatch = rawResponse.match(/\|\|\|RECOMMENDATIONS:([\s\S]*?)\|\|\|/);
    if (recMatch) {
      try {
        const names = JSON.parse(recMatch[1].trim());
        recommendedClubs = clubs
          .filter(c => names.some(n =>
            typeof n === 'string' && n.toLowerCase().trim() === c.name.toLowerCase().trim()
          ))
          .map(c => ({ ...c, matchScore: 90 + Math.floor(Math.random() * 9) }));
      } catch (_) { /* ignore */ }
      rawResponse = rawResponse.replace(/\|\|\|RECOMMENDATIONS:[\s\S]*?\|\|\|/, '').trim();
    }

    const cleanResponse = rawResponse.replace(/\*\*(.*?)\*\*/g, '$1');

    const interestWords = new Set(
      [message]
        .concat(Array.isArray(quiz?.skills) ? quiz.skills : [])
        .concat(Array.isArray(quiz?.activities) ? quiz.activities : [])
        .join(' ')
        .toLowerCase()
        .split(/\W+/)
        .filter(w => w.length > 3)
    );

    const recommendationReasons = {};
    recommendedClubs.forEach((club) => {
      const tags = (club.tags || []).map(t => t.toLowerCase());
      const matches = tags.filter(t => interestWords.has(t)).slice(0, 2);
      if (matches.length) {
        recommendationReasons[club._id] = `Matches your interests in ${matches.join(', ')}.`;
      } else {
        recommendationReasons[club._id] = `Great fit for ${club.category} activities and campus engagement.`;
      }
    });

    // Save to DB
    const now = new Date();
    chatHistory.messages.push(
      { id: Date.now(), type: 'user', text: message, time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
      { id: Date.now() + 1, type: 'bot', text: cleanResponse, time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    );
    await chatHistory.save();

    if (genAI && chatHistory.messages.length >= 4) {
      try {
        const summaryModel = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
        const recent = chatHistory.messages.slice(-6).map(m => `${m.type}: ${m.text}`).join('\n');
        const summaryPrompt = `Summarize this chat in 2-3 short sentences. Focus on the student's interests and goals.\n\n${recent}`;
        const summaryRes = await summaryModel.generateContent(summaryPrompt);
        chatHistory.summary = summaryRes.response.text().trim();
        chatHistory.summaryUpdatedAt = new Date();
        await chatHistory.save();
      } catch (_) {
        // keep existing summary
      }
    }

    return res.json({ response: cleanResponse, recommendations: recommendedClubs, reasons: recommendationReasons, summary: chatHistory.summary || '' });

  } catch (err) {
    console.error('Gemini error:', err.message);

    const isRateLimit =
      err.message.includes('429') ||
      err.message.toLowerCase().includes('quota') ||
      err.message.toLowerCase().includes('retry') ||
      err.message.toLowerCase().includes('resource_exhausted');

    if (isRateLimit) {
      const fallback = keywordFallback(clubs, message);
      return res.json(fallback);
    }

    return res.status(500).json({ message: 'AI service error', error: err.message });
  }
});

router.post('/draft', protect, async (req, res) => {
  try {
    const { clubName, role, userName } = req.body;
    if (!clubName || !role) {
      return res.status(400).json({ message: 'Club name and role are required' });
    }
    if (!genAI) {
      const fallbackName = userName || 'a student';
      const fallbackDraft = `I am excited to apply for the ${role} role in ${clubName}. As ${fallbackName}, I want to contribute my time, enthusiasm, and skills to support the club's activities and grow through meaningful teamwork. I believe this opportunity will help me develop further while making a positive contribution to the club.`;
      return res.json({ draft: fallbackDraft });
    }

    let historyText = '';
    try {
      const chatHistory = await ChatHistory.findOne({ user: req.user._id });
      const recentUserMsgs = (chatHistory?.messages || [])
        .filter(m => m.type === 'user')
        .slice(-4)
        .map(m => m.text.trim())
        .filter(Boolean);
      if (recentUserMsgs.length) {
        historyText = `\nRecent chat context from the student:\n- ${recentUserMsgs.join('\n- ')}`;
      }
    } catch (_) {
      historyText = '';
    }

    const systemPrompt = `You are a helpful assistant for a university student named ${userName || "a student"}. 
The student is applying to join the "${clubName}" club at SLIIT for the role of "${role}". 
Write a short, engaging, 50-80 word explanation of why they want to join and what they can contribute. 
Write it in the first person ("I"). Keep it professional but enthusiastic. Do not include signature blocks or subject lines.${historyText}`;

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent(systemPrompt);
    const text = result.response.text();

    res.json({ draft: text.trim() });
  } catch (error) {
    console.error('Draft error:', error);
    res.status(500).json({ message: 'Failed to generate draft' });
  }
});

module.exports = router;
