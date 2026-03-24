import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Send, Bot, User, ArrowLeft, Sparkles, ChevronRight, 
  MessageSquare, History, Search, Info
} from "lucide-react";
import { recommendationsAPI, getSession } from "../api/clubsApi";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
  *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
  body{font-family:'Inter',sans-serif;background:#050A18;color:#fff;overflow-x:hidden;}
  
  .chat-layout{display:flex;height:100vh;background:#050A18;}
  .chat-main{flex:1;display:flex;flex-direction:column;position:relative;background:radial-gradient(circle at top right, rgba(255,215,0,0.03), transparent 40%);}
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
  .header-btn:hover{background:rgba(255,215,0,0.1);color:#FFD700;transform:translateY(-1px);}

  .chat-messages{flex:1;padding:40px 32px;overflow-y:auto;display:flex;flex-direction:column;gap:32px;}
  .message-row{display:flex;gap:16px;max-width:80%;align-items:flex-end;}
  .message-row.user{align-self:flex-end;flex-direction:row-reverse;max-width:75%;}
  
  .avatar-box{
    width:38px;height:38px;border-radius:12px;display:flex;align-items:center;justify-content:center;
    flex-shrink:0;transition:all 0.3s;
  }
  .avatar-box.bot{background:linear-gradient(135deg, #FFD700, #b8860b);box-shadow:0 4px 15px rgba(255,215,0,0.25);}
  .avatar-box.user{background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.1);}
  
  .bubble{
    padding:16px 20px;border-radius:20px;font-size:14.5px;line-height:1.7;position:relative;
    box-shadow:0 10px 25px rgba(0,0,0,0.15);
  }
  .message-row.bot .bubble{
    background:#0E1528;border:1px solid rgba(255,255,255,0.06);color:rgba(255,255,255,0.9);
    border-bottom-left-radius:4px;
  }
  .message-row.user .bubble{
    background:linear-gradient(135deg, #FFD700, #d4af37);color:#050A18;
    border-bottom-right-radius:4px;font-weight:600;
  }

  .input-area{
    padding:24px 32px 40px;background:linear-gradient(to top, #050A18 70%, transparent);
    position:relative;z-index:20;
  }
  .input-wrapper{
    max-width:850px;margin:0 auto;
  }
  .suggestion-row{display:flex;gap:10px;margin-bottom:16px;justify-content:center;flex-wrap:wrap;}
  .s-chip{
    background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);
    padding:8px 16px;border-radius:100px;font-size:12px;font-weight:600;
    color:rgba(255,255,255,0.6);transition:all 0.2s;cursor:pointer;outline:none;
  }
  .s-chip:hover{background:rgba(255,215,0,0.1);border-color:rgba(255,215,0,0.3);color:#FFD700;}

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
  }
  .send-btn-gold:hover{transform:scale(1.05) rotate(5deg);background:#ffe629;}
  .send-btn-gold:disabled{opacity:0.3;cursor:not-allowed;transform:none;}

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
  }
  .club-rec-card:hover .rec-action-btn{background:#FFD700;color:#050A18;}

  @keyframes wave { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
  .dot-wave{width:6px;height:6px;background:#FFD700;border-radius:50%;animation:wave 1s infinite;}

  @keyframes slideIn{from{opacity:0;transform:translateX(-20px)}to{opacity:1;transform:translateX(0)}}
  .animate-slide{animation:slideIn 0.4s ease-out both;}
`;

const SUGGESTIONS = [
  "Recommend a club for me",
  "How do I join a society?",
  "What are the most active clubs?",
  "Technical vs Leadership clubs"
];

export default function ClubChatbotPage() {
  const navigate = useNavigate();
  const session = getSession();
  
  const [messages, setMessages] = useState([
    { id: 1, type: "bot", text: "Hello! I am your AI Club Advisor. I can help you find the perfect community at SLIIT. What are you passionate about?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!session) navigate("/clubs/auth");
    scrollToBottom();
  }, [messages]);

  const handleSend = async (msgText) => {
    const textToSend = typeof msgText === 'string' ? msgText : input;
    if (!textToSend.trim() || loading) return;

    const userMsg = { id: Date.now(), type: "user", text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await recommendationsAPI.getChat(textToSend);
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        type: "bot", 
        text: res.data.response 
      }]);
      setRecommendations(res.data.recommendations);
    } catch (err) {
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        type: "bot", 
        text: "I'm having a bit of trouble connecting right now. Can we try again in a moment?" 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="chat-layout">
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
                  <h1 style={{ fontSize: "15px", fontWeight: 900, color: "#fff" }}>UniMate Assistant</h1>
                  <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <div style={{ width: "6px", height: "6px", background: "#22c55e", borderRadius: "50%" }} />
                    <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)", fontWeight: 700, textTransform: "uppercase" }}>Online</span>
                  </div>
                </div>
              </div>
            </div>
            <button className="header-btn" style={{ background: "rgba(255,215,0,0.1)", color: "#FFD700" }} onClick={() => navigate("/clubs/advisor")}>
              <Sparkles size={14} /> Full Quiz
            </button>
          </header>

          <div className="chat-messages">
            {messages.map((msg, i) => (
              <div key={msg.id} className={`message-row ${msg.type} animate-message`}>
                <div className={`avatar-box ${msg.type}`}>
                  {msg.type === "bot" ? <Bot size={20} color="#050A18" /> : <User size={20} color="#fff" />}
                </div>
                <div className="bubble">{msg.text}</div>
              </div>
            ))}
            {loading && (
              <div className="message-row bot animate-message">
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
                  <button key={s} className="s-chip" onClick={() => handleSend(s)} disabled={loading}>{s}</button>
                ))}
              </div>
              <form className="input-box" onSubmit={(e) => { e.preventDefault(); handleSend(); }}>
                <input 
                  placeholder="Ask anything about student life or clubs..." 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={loading}
                />
                <button className="send-btn-gold" type="submit" disabled={!input.trim() || loading}>
                  <Send size={20} />
                </button>
              </form>
            </div>
          </div>
        </div>

        <aside className="chat-sidebar">
          <div>
            <h2 className="sidebar-section-title">Top Matches</h2>
            <p className="sidebar-desc">Hand-picked by our AI based on your profile and recent chat.</p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {recommendations.length > 0 ? (
              recommendations.map((club, i) => (
                <div key={club._id} className="club-rec-card animate-slide" style={{ animationDelay: `${i * 0.1}s` }} onClick={() => navigate("/clubs")}>
                  <div className="match-indicator">
                    <Sparkles size={10} strokeWidth={3} /> {club.matchScore}% Match
                  </div>
                  <h3 className="rec-club-name">{club.name}</h3>
                  <p className="rec-club-info">{club.description.substring(0, 75)}...</p>
                  <button className="rec-action-btn">
                    Details <ChevronRight size={14} />
                  </button>
                </div>
              ))
            ) : (
              <div style={{ textAlign: "center", padding: "60px 20px", background: "rgba(255,255,255,0.02)", borderRadius: "24px", border: "1px dashed rgba(255,255,255,0.1)" }}>
                <Bot size={32} color="rgba(255,255,255,0.1)" style={{ marginBottom: "16px" }} />
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.3)", lineHeight: 1.6 }}>
                  Start chatting or tell me your interests to see recommendations here.
                </p>
              </div>
            )}
          </div>

          <div style={{ marginTop: "auto", padding: "20px", background: "rgba(255,215,0,0.04)", borderRadius: "18px", border: "1px solid rgba(255,215,0,0.1)" }}>
            <div style={{ display: "flex", gap: "12px" }}>
              <div style={{ background: "rgba(255,215,0,0.1)", width: "32px", height: "32px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Info size={16} color="#FFD700" />
              </div>
              <div>
                <h4 style={{ fontSize: "13px", fontWeight: 800, color: "#FFD700", marginBottom: "4px" }}>AI Intelligence</h4>
                <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>
                  Our advisor uses advanced NLP to match your skills with appropriate leadership roles.
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
