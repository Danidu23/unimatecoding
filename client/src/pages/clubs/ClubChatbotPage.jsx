import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Send, Bot, User, ArrowLeft, Sparkles, ChevronRight,
  Info, Zap, Mic, Volume2
} from "lucide-react";
import { recommendationsAPI, getSession } from "../../api/clubsApi";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
  *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
  body{font-family:'Inter',sans-serif;background:#050A18;color:#fff;overflow-x:hidden;}

  .chat-layout{display:flex;height:100vh;background:#050A18;}
  .chat-main{flex:1;display:flex;flex-direction:column;position:relative;background:radial-gradient(circle at top right, rgba(245,166,35,0.03), transparent 40%);}
  .chat-sidebar{
    width:340px;background:rgba(14,21,40,0.5);backdrop-filter:blur(20px);
    border-left:1px solid rgba(255,255,255,0.06);padding:28px;overflow-y:auto;
    display:flex;flex-direction:column;gap:24px;
  }

  .chat-header{
    padding:16px 32px;background:rgba(5,10,24,0.8);backdrop-filter:blur(20px);
    border-bottom:1px solid rgba(255,255,255,0.06);display:flex;align-items:center;justify-content:space-between;
    position:sticky;top:0;z-index:50;
  }
  .header-btn{
    display:flex;align-items:center;gap:8px;color:rgba(255,255,255,0.6);
    font-size:13px;font-weight:600;padding:8px 14px;border-radius:10px;
    background:rgba(255,255,255,0.05);transition:all 0.25s;
    border:none;cursor:pointer;outline:none;
  }
  .header-btn:hover{background:rgba(245,166,35,0.1);color:#F5A623;transform:translateY(-1px);}

  .chat-messages{flex:1;padding:40px 32px;overflow-y:auto;display:flex;flex-direction:column;gap:24px;}
  .message-row{display:flex;gap:16px;max-width:80%;align-items:flex-end;}
  .message-row.user{align-self:flex-end;flex-direction:row-reverse;max-width:75%;}

  .avatar-box{
    width:38px;height:38px;border-radius:12px;display:flex;align-items:center;justify-content:center;
    flex-shrink:0;transition:all 0.3s;
  }
  .avatar-box.bot{background:linear-gradient(135deg, #F5A623, #c68642);box-shadow:0 4px 15px rgba(245,166,35,0.25);}
  .avatar-box.user{background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.1);}

  .bubble{
    padding:16px 20px;border-radius:20px;font-size:14.5px;line-height:1.8;position:relative;
    box-shadow:0 10px 25px rgba(0,0,0,0.15);word-break:break-word;
  }
  .message-row.bot .bubble{
    background:#0E1528;border:1px solid rgba(255,255,255,0.06);color:rgba(255,255,255,0.9);
    border-bottom-left-radius:4px;
  }
  .message-row.user .bubble{
    background:linear-gradient(135deg, #F5A623, #c68642);color:#050A18;
    border-bottom-right-radius:4px;font-weight:600;
  }
  .bubble strong{color:#F5A623;font-weight:800;}

  .message-time{font-size:10px;color:rgba(255,255,255,0.2);margin-top:6px;padding:0 4px;}

  .input-area{
    padding:24px 32px 40px;background:linear-gradient(to top, #050A18 70%, transparent);
    position:relative;z-index:20;
  }
  .input-wrapper{max-width:850px;margin:0 auto;}
  .suggestion-row{display:flex;gap:10px;margin-bottom:16px;justify-content:center;flex-wrap:wrap;}
  .s-chip{
    background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);
    padding:8px 16px;border-radius:100px;font-size:12px;font-weight:600;
    color:rgba(255,255,255,0.6);transition:all 0.2s;cursor:pointer;outline:none;
  }
  .s-chip:hover{background:rgba(245,166,35,0.1);border-color:rgba(245,166,35,0.3);color:#F5A623;}
  .s-chip:disabled{opacity:0.4;cursor:not-allowed;}

  .input-box{
    position:relative;background:rgba(14,21,40,0.6);backdrop-filter:blur(20px);
    border:1px solid rgba(255,255,255,0.1);border-radius:20px;padding:8px;
    display:flex;align-items:center;transition:all 0.3s;
    box-shadow:0 15px 40px rgba(0,0,0,0.2);
  }
  .input-box:focus-within{border-color:rgba(255,215,0,0.5);background:rgba(14,21,40,0.8);}
  .input-box input{
    flex:1;background:none;border:none;outline:none;color:#fff;padding:12px 18px;
    font-size:15px;font-family:inherit;
  }
  .send-btn-gold{
    width:46px;height:46px;border-radius:14px;background:#FFD700;color:#050A18;
    display:flex;align-items:center;justify-content:center;transition:all 0.2s;
    box-shadow:0 4px 15px rgba(255,215,0,0.3);border:none;cursor:pointer;outline:none;
    flex-shrink:0;
  }
  .send-btn-gold:hover{transform:scale(1.05) rotate(5deg);background:#ffe629;}
  .send-btn-gold:disabled{opacity:0.3;cursor:not-allowed;transform:none;}
  
  .mic-btn{
    width:46px;height:46px;border-radius:14px;background:rgba(255,255,255,0.06);color:#fff;
    display:flex;align-items:center;justify-content:center;transition:all 0.2s;
    border:1px solid rgba(255,255,255,0.1);cursor:pointer;outline:none;flex-shrink:0;
  }
  .mic-btn:hover{background:rgba(255,255,255,0.1);border-color:rgba(255,215,0,0.4);color:#FFD700;}
  .mic-btn.recording{
    background:rgba(239,68,68,0.2);border-color:#ef4444;color:#ef4444;
    animation:pulse-record 1.5s infinite;
  }
  
  @keyframes pulse-record {
    0% { box-shadow: 0 0 0 0 rgba(239,68,68,0.4); transform: scale(1); }
    50% { box-shadow: 0 0 0 10px rgba(239,68,68,0); transform: scale(1.05); }
    100% { box-shadow: 0 0 0 0 rgba(239,68,68,0); transform: scale(1); }
  }

  .sidebar-section-title{font-size:18px;font-weight:900;color:#fff;margin-bottom:6px;letter-spacing:-0.5px;}
  .sidebar-desc{font-size:13px;color:rgba(255,255,255,0.4);margin-bottom:20px;}

  .club-rec-card{
    background:rgba(255,255,255,0.03);border:1.5px solid rgba(255,255,255,0.06);
    border-radius:20px;padding:20px;transition:all 0.3s;position:relative;cursor:pointer;
  }
  .club-rec-card:hover{
    background:rgba(255,215,0,0.02);border-color:rgba(255,215,0,0.25);
    transform:translateY(-3px);box-shadow:0 10px 30px rgba(0,0,0,0.2);
  }
  .match-indicator{
    display:inline-flex;align-items:center;gap:4px;padding:4px 10px;
    background:rgba(34,197,94,0.1);border-radius:100px;color:#22c55e;
    font-size:11px;font-weight:800;margin-bottom:12px;
  }
  .rec-club-name{font-size:16px;font-weight:800;color:#fff;margin-bottom:8px;}
  .rec-club-info{font-size:13px;color:rgba(255,255,255,0.5);line-height:1.6;margin-bottom:16px;}
  .rec-action-btn{
    width:100%;padding:10px;border-radius:10px;background:rgba(255,255,255,0.06);
    color:#fff;font-size:12px;font-weight:700;transition:all 0.2s;
    display:flex;align-items:center;justify-content:center;gap:6px;border:none;outline:none;
    cursor:pointer;
  }
  .club-rec-card:hover .rec-action-btn{background:#FFD700;color:#050A18;}

  @keyframes wave { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
  .dot-wave{width:6px;height:6px;background:#FFD700;border-radius:50%;animation:wave 1s infinite;}

  @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
  @keyframes slideIn{from{opacity:0;transform:translateX(-20px)}to{opacity:1;transform:translateX(0)}}
  .animate-slide{animation:slideIn 0.4s ease-out both;}
  .animate-msg{animation:fadeUp 0.35s ease-out both;}

  .gemini-badge{
    display:inline-flex;align-items:center;gap:5px;
    background:linear-gradient(135deg, rgba(255,215,0,0.15), rgba(255,165,0,0.1));
    border:1px solid rgba(255,215,0,0.3);border-radius:100px;
    padding:3px 10px;font-size:10px;font-weight:800;color:#FFD700;letter-spacing:0.5px;
  }

  .clear-btn{
    background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);
    border-radius:8px;padding:5px 12px;color:rgba(255,255,255,0.4);
    font-size:11px;font-weight:600;cursor:pointer;transition:all 0.2s;
  }
  .clear-btn:hover{color:#f87171;border-color:rgba(248,113,113,0.3);background:rgba(248,113,113,0.06);}

  .summary-card{
    background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);
    border-radius:18px;padding:16px;font-size:12px;color:rgba(255,255,255,0.6);line-height:1.6;
  }
  .summary-title{font-size:12px;font-weight:800;color:#fff;margin-bottom:6px;}
  .recommend-reason{font-size:11px;color:rgba(255,255,255,0.5);line-height:1.6;margin-top:8px;}

  @media(max-width:900px){
    .chat-sidebar{display:none;}
  }
`;

const SUGGESTIONS = [
  "Find me a tech club 💻",
  "What leadership clubs are there?",
  "I love sports and fitness 🏃",
  "How do I apply to join?",
];

/* Renders text with **bold** markdown as real HTML <strong> */
function FormattedText({ text }) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return (
    <span>
      {parts.map((part, i) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={i}>{part.slice(2, -2)}</strong>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
}

const INITIAL_MSG = {
  id: 1,
  type: "bot",
  text: "Hello! I'm UniMate Assistant — powered by **Gemini AI** 🤖✨\n\nI know every club and society at SLIIT and I'm here to help you find the perfect fit. Tell me your interests, skills, or just ask anything about student life!",
  time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
};

export default function ClubChatbotPage() {
  const navigate = useNavigate();
  const session = getSession();

  const [messages, setMessages] = useState([INITIAL_MSG]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [recommendationReasons, setRecommendationReasons] = useState({});
  const [summary, setSummary] = useState("");
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!session) {
      navigate("/login");
      return;
    }
    loadHistory();
  }, [session, navigate]);

  const loadHistory = async () => {
    try {
      const res = await recommendationsAPI.getHistory();
      if (Array.isArray(res.data) && res.data.length > 0) {
        setMessages([INITIAL_MSG, ...res.data]);
      }
    } catch (_) {
      setMessages([INITIAL_MSG]);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  /* Build history for Gemini — exclude the initial greeting */
  const buildHistory = () =>
    messages
      .slice(1)
      .map(m => ({ type: m.type, text: m.text }));

  const speak = (text) => {
    if (!voiceEnabled || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "en-US";
    window.speechSynthesis.speak(utter);
  };

  const streamBotMessage = (text) => {
    const id = Date.now() + 1;
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setMessages(prev => [...prev, { id, type: "bot", text: "", time: now, streaming: true }]);
    setIsStreaming(true);
    let i = 0;
    const step = 3;
    const interval = setInterval(() => {
      i += step;
      setMessages(prev => prev.map(m => m.id === id ? { ...m, text: text.slice(0, i) } : m));
      if (i >= text.length) {
        clearInterval(interval);
        setMessages(prev => prev.map(m => m.id === id ? { ...m, streaming: false, text } : m));
        setIsStreaming(false);
        speak(text);
      }
    }, 15);
  };

  const handleSend = async (msgText) => {
    const textToSend = typeof msgText === "string" ? msgText : input;
    if (!textToSend.trim() || loading) return;

    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userMsg = { id: Date.now(), type: "user", text: textToSend, time: now };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const history = buildHistory();
      const quiz = JSON.parse(localStorage.getItem("clubsQuiz") || "null");
      const res = await recommendationsAPI.getChat(textToSend, { history, quiz });
      setLoading(false);
      streamBotMessage(res.data?.response || "I found some suggestions, but I could not format the response properly.");
      if (res.data?.recommendations?.length > 0) {
        setRecommendations(res.data.recommendations);
        setRecommendationReasons(res.data.reasons || {});
      } else {
        setRecommendations([]);
        setRecommendationReasons({});
      }
      setSummary(res.data?.summary || "");
    } catch (err) {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        type: "bot",
        text: "I'm having a bit of trouble connecting right now. Please try again in a moment.",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = async () => {
    try {
      await recommendationsAPI.clearHistory();
    } catch (_) {
      // ignore, still clear local view
    }
    setMessages([INITIAL_MSG]);
    setRecommendations([]);
    setRecommendationReasons({});
    setSummary("");
  };

  const handleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support Voice Input.");
      return;
    }
    
    if (isRecording) return;
    
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    
    recognition.onstart = () => setIsRecording(true);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(prev => prev + (prev ? " " : "") + transcript);
    };
    recognition.onerror = () => setIsRecording(false);
    recognition.onend = () => setIsRecording(false);
    
    recognition.start();
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="chat-layout">
        {/* ── Main chat panel ── */}
        <div className="chat-main">
          <header className="chat-header">
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <button className="header-btn" onClick={() => navigate("/clubs")}>
                <ArrowLeft size={16} /> Back
              </button>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div className="avatar-box bot" style={{ width: "32px", height: "32px" }}>
                  <Bot size={18} color="#050A18" />
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ fontSize: "15px", fontWeight: 900, color: "#fff", letterSpacing: "0px", margin: 0 }}>
                      UniMate Assistant
                    </div>
                    <span className="gemini-badge"><Zap size={9} strokeWidth={3} /> Gemini AI</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <div style={{ width: "6px", height: "6px", background: "#22c55e", borderRadius: "50%" }} />
                    <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)", fontWeight: 700, textTransform: "uppercase" }}>
                      Online
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button className="clear-btn" onClick={handleClear}>Clear Chat</button>
              <button className="header-btn" onClick={() => setVoiceEnabled(v => !v)}>
                <Volume2 size={14} /> {voiceEnabled ? "Voice On" : "Voice Off"}
              </button>
              <button className="header-btn" style={{ background: "rgba(255,215,0,0.1)", color: "#FFD700" }} onClick={() => navigate("/clubs/advisor")}>
                <Sparkles size={14} /> Full Quiz
              </button>
            </div>
          </header>

          <div className="chat-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`message-row ${msg.type} animate-msg`}>
                <div className={`avatar-box ${msg.type}`}>
                  {msg.type === "bot" ? <Bot size={20} color="#050A18" /> : <User size={20} color="#fff" />}
                </div>
                <div>
                  <div className="bubble">
                    {msg.text.split("\n").map((line, i) => (
                      <span key={i}>
                        <FormattedText text={line} />
                        {i < msg.text.split("\n").length - 1 && <br />}
                      </span>
                    ))}
                  </div>
                  {msg.time && (
                    <div className="message-time">{msg.time}</div>
                  )}
                </div>
              </div>
            ))}

            {(loading || isStreaming) && (
              <div className="message-row bot animate-msg">
                <div className="avatar-box bot">
                  <Bot size={20} color="#050A18" />
                </div>
                <div className="bubble" style={{ display: "flex", gap: "5px", padding: "16px 24px", background: "#0E1528" }}>
                  <div className="dot-wave" />
                  <div className="dot-wave" style={{ animationDelay: "0.2s" }} />
                  <div className="dot-wave" style={{ animationDelay: "0.4s" }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="input-area">
            <div className="input-wrapper">
              <div className="suggestion-row">
                {SUGGESTIONS.map(s => (
                  <button key={s} className="s-chip" onClick={() => handleSend(s)} disabled={loading}>
                    {s}
                  </button>
                ))}
              </div>
              <form className="input-box" onSubmit={(e) => { e.preventDefault(); handleSend(); }}>
                <input
                  id="chat-input"
                  placeholder="Ask me anything about clubs at SLIIT..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={loading}
                  autoComplete="off"
                />
                <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                  <button 
                    className={`mic-btn ${isRecording ? "recording" : ""}`} 
                    type="button" 
                    onClick={handleVoiceInput}
                    title="Speak to Assistant"
                  >
                    <Mic size={20} />
                  </button>
                  <button className="send-btn-gold" type="submit" disabled={!input.trim() || loading}>
                    <Send size={20} />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* ── Sidebar ── */}
        <aside className="chat-sidebar">
          <div>
            <h2 className="sidebar-section-title">AI Recommendations</h2>
            <p className="sidebar-desc">Clubs suggested by Gemini based on your conversation.</p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {recommendations.length > 0 ? (
              recommendations.map((club, i) => (
                <div
                  key={club._id}
                  className="club-rec-card animate-slide"
                  style={{ animationDelay: `${i * 0.1}s` }}
                  onClick={() => navigate("/clubs", { state: { openClubId: club._id } })}
                >
                  <div className="match-indicator">
                    <Sparkles size={10} strokeWidth={3} /> {club.matchScore}% Match
                  </div>
                  <h3 className="rec-club-name">{club.name}</h3>
                  <p className="rec-club-info">
                    {club.description ? `${club.description.substring(0, 75)}...` : "No description available."}
                  </p>
                  {recommendationReasons[club._id] && (
                    <div className="recommend-reason">{recommendationReasons[club._id]}</div>
                  )}
                  <button className="rec-action-btn">
                    View Details <ChevronRight size={14} />
                  </button>
                </div>
              ))
            ) : (
              <div style={{ textAlign: "center", padding: "60px 20px", background: "rgba(255,255,255,0.02)", borderRadius: "24px", border: "1px dashed rgba(255,255,255,0.1)" }}>
                <Bot size={32} color="rgba(255,255,255,0.1)" style={{ marginBottom: "16px" }} />
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.3)", lineHeight: 1.6 }}>
                  Ask about your interests and I'll recommend clubs here!
                </p>
              </div>
            )}
          </div>

          {summary && (
            <div className="summary-card">
              <div className="summary-title">Conversation Summary</div>
              {summary}
            </div>
          )}

          {/* Gemini info badge */}
          <div style={{ marginTop: "auto", padding: "20px", background: "rgba(255,215,0,0.04)", borderRadius: "18px", border: "1px solid rgba(255,215,0,0.1)" }}>
            <div style={{ display: "flex", gap: "12px" }}>
              <div style={{ background: "rgba(255,215,0,0.1)", width: "32px", height: "32px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Info size={16} color="#FFD700" />
              </div>
              <div>
                <h4 style={{ fontSize: "13px", fontWeight: 800, color: "#FFD700", marginBottom: "4px" }}>
                  Powered by Google Gemini
                </h4>
                <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>
                  This advisor is trained on all SLIIT club data and uses Google's Gemini AI for intelligent, contextual recommendations.
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
