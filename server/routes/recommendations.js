const express = require('express');
const router = express.Router();
const Club = require('../models/Club');
const { protect } = require('../middleware/auth');

// POST /api/recommendations
// Body: { skills: [], activities: [], commitment: '' }
router.post('/', protect, async (req, res) => {
  try {
    const { skills = [], activities = [], commitment = '' } = req.body;

    // Build a list of user tags from questionnaire answers
    const userTags = [
      ...skills.map(s => s.toLowerCase().replace(/\s+/g, '_')),
      ...activities.map(a => a.toLowerCase().replace(/\s+/g, '_')),
      commitment.toLowerCase(),
    ].filter(Boolean);

    const clubs = await Club.find();

    // Score each club by counting overlapping tags
    const scored = clubs.map(club => {
      const clubTags = club.tags.map(t => t.toLowerCase());
      const matchScore = userTags.reduce((score, tag) => {
        return score + (clubTags.some(ct => ct.includes(tag) || tag.includes(ct)) ? 1 : 0);
      }, 0);
      return { club, matchScore };
    });

    // Sort by score descending, return top 3
    const top3 = scored
      .filter(s => s.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 3)
      .map(s => ({ ...s.club.toObject(), matchScore: s.matchScore }));

    // If fewer than 3 matches, fill with random clubs
    if (top3.length < 3) {
      const existing = new Set(top3.map(c => c._id.toString()));
      const extras = clubs
        .filter(c => !existing.has(c._id.toString()))
        .slice(0, 3 - top3.length)
        .map(c => ({ ...c.toObject(), matchScore: 0 }));
      top3.push(...extras);
    }

    res.json({ recommendations: top3 });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/recommendations/chat
// Body: { message: '' }
router.post('/chat', protect, async (req, res) => {
  try {
    const { message = '' } = req.body;
    const clubs = await Club.find();

    // Natural language keyword extraction (simple)
    const words = message.toLowerCase().split(/\W+/).filter(w => w.length > 3);
    
    // Map of keywords to club categories or tags
    const commonKeywords = {
      'coding': ['Technological', 'programming', 'code', 'software'],
      'leadership': ['Leadership', 'management', 'team'],
      'business': ['Business', 'entrepreneurship', 'innovation'],
      'art': ['Arts', 'creative', 'design'],
      'sport': ['Sports', 'fitness', 'teamwork'],
      'media': ['Media', 'journalism', 'news'],
      'science': ['Science', 'research', 'lab'],
    };

    // Calculate match scores for all clubs based on message words
    const scored = clubs.map(club => {
      const clubTags = club.tags.map(t => t.toLowerCase());
      const clubCategory = club.category.toLowerCase();
      
      let matchScore = 0;
      words.forEach(word => {
        // Direct tag match
        if (clubTags.some(t => t.includes(word))) matchScore += 2;
        // Category match
        if (clubCategory.includes(word)) matchScore += 3;
        
        // Indirect keyword mapping
        Object.entries(commonKeywords).forEach(([key, values]) => {
          if (word.includes(key) || key.includes(word)) {
            if (values.some(v => v.toLowerCase().includes(clubCategory) || clubTags.some(t => t.includes(v.toLowerCase())))) {
              matchScore += 1;
            }
          }
        });
      });
      return { club, matchScore };
    });

    const topMatches = scored
      .filter(s => s.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 3)
      .map(s => {
        const percent = Math.min(98, 75 + s.matchScore * 5); // Simulating realistic match percentages
        return { ...s.club.toObject(), matchScore: percent };
      });

    // Narrative response generation
    let aiResponse = "";
    if (topMatches.length > 0) {
      const names = topMatches.slice(0, 2).map(m => m.name).join(' and ');
      aiResponse = `Based on your interest in ${words.slice(0, 3).join(', ')}, you may enjoy these clubs. The ${names} are specifically focused on areas related to your query and offer great opportunities.`;
    } else {
      aiResponse = "That sounds interesting! While I couldn't find a direct match, you might want to explore our diverse range of clubs in the 'Discover' section. Can you tell me more about what you're looking for?";
      // Return 2 random clubs as recommendations if no match
      topMatches.push(...clubs.slice(0, 2).map(c => ({ ...c.toObject(), matchScore: 85 })));
    }

    res.json({ 
      response: aiResponse,
      recommendations: topMatches
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
