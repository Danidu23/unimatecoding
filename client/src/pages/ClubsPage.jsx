import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search, Filter, LogOut, Bot, ClipboardList, Star, MessageSquare,
  Users, BookOpen, Zap, Palette, Trophy, Globe2, Briefcase, Tv2, ChevronRight, X
} from "lucide-react";
import { clubsAPI, applicationsAPI, getSession, clearSession } from "../api/clubsApi";
import ClubDetailsModal from "./ClubDetailsModal";

const CATEGORIES = ["All", "Technology", "Leadership", "Academic", "Community", "Media", "Arts", "Sports", "Wellness"];

const CAT_ICONS = {
  Technology: <Zap size={14}/>, Leadership: <Star size={14}/>, Academic: <BookOpen size={14}/>,
  Community: <Users size={14}/>, Media: <Tv2 size={14}/>, Arts: <Palette size={14}/>,
  Sports: <Trophy size={14}/>, Wellness: <Star size={14}/>, All: <Filter size={14}/>
};

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
  *, *::before, *::after{margin:0;padding:0;box-sizing:border-box;}
  html,body,#root{width:100%;min-height:100vh;}
  body{font-family:'Inter',system-ui,sans-serif;background:#0A0A0A;color:#fff;}
  button{font-family:inherit;cursor:pointer;border:none;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes popIn{from{transform:scale(.7);opacity:0}to{transform:scale(1);opacity:1}}

  .cd-nav{
    position:sticky;top:0;z-index:100;
    background:rgba(10,10,10,.95);backdrop-filter:blur(16px);
    border-bottom:1px solid rgba(255,215,0,.12);
    display:flex;align-items:center;justify-content:space-between;
    padding:0 clamp(16px,4vw,48px);height:64px;
  }
  .cd-badge{
    display:inline-flex;align-items:center;gap:6px;
    background:rgba(255,215,0,.1);border:1px solid rgba(255,215,0,.25);
    border-radius:100px;padding:4px 12px;
    font-size:11px;font-weight:700;color:#FFD700;letter-spacing:.5px;
  }
  .cd-icon-btn{
    background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.1);
    border-radius:9px;padding:8px 14px;color:rgba(255,255,255,.7);
    font-size:13px;font-weight:600;display:flex;align-items:center;gap:6px;
    transition:all .22s;
  }
  .cd-icon-btn:hover{border-color:rgba(255,215,0,.4);color:#FFD700;background:rgba(255,215,0,.07);}
  .cd-search{
    display:flex;align-items:center;gap:10px;
    background:rgba(255,255,255,.06);border:1.5px solid rgba(255,255,255,.1);
    border-radius:10px;padding:10px 16px;
    transition:border-color .22s;flex:1;max-width:420px;
  }
  .cd-search:focus-within{border-color:rgba(255,215,0,.5);}
  .cd-search input{background:none;border:none;outline:none;color:#fff;font-size:14px;font-family:'Inter',sans-serif;width:100%;}
  .cd-search input::placeholder{color:rgba(255,255,255,.35);}
  .cat-pill{
    display:inline-flex;align-items:center;gap:6px;
    padding:8px 16px;border-radius:100px;font-size:13px;font-weight:600;
    border:1.5px solid rgba(255,255,255,.1);background:rgba(255,255,255,.05);
    color:rgba(255,255,255,.65);cursor:pointer;white-space:nowrap;
    transition:all .2s;
  }
  .cat-pill:hover{border-color:rgba(255,215,0,.4);color:#FFD700;background:rgba(255,215,0,.07);}
  .cat-pill.active{background:#FFD700;color:#0A0A0A;border-color:#FFD700;box-shadow:0 4px 16px rgba(255,215,0,.4);}
  .club-card{
    background:#111;border:1.5px solid rgba(255,255,255,.08);border-radius:20px;
    transition:all .3s;display:flex;flex-direction:column;overflow:hidden;
    position:relative;
  }
  .club-card:hover{border-color:rgba(255,215,0,.4);transform:translateY(-4px);box-shadow:0 12px 40px rgba(0,0,0,.5), 0 0 20px rgba(255,215,0,.05);}
  .join-btn{
    display:flex;align-items:center;justify-content:center;gap:7px;
    background:transparent;color:#FFD700;border:1.5px solid rgba(255,215,0,.4);
    border-radius:12px;padding:14px 20px;font-size:14px;font-weight:700;
    cursor:pointer;transition:all .22s;width:100%;text-transform:none;
  }
  .join-btn:hover{background:rgba(255,215,0,.1);border-color:#FFD700;transform:translateY(-1px);}
  
  .member-badge{
    position:absolute;top:12px;right:12px;z-index:10;
    background:rgba(34,197,94,.9);backdrop-filter:blur(4px);
    color:#fff;font-size:11px;font-weight:800;padding:4px 10px;
    border-radius:100px;display:flex;align-items:center;gap:4px;
    box-shadow:0 4px 12px rgba(34,197,94,.4);
  }
  .modal-bg{position:fixed;inset:0;background:rgba(0,0,0,.8);z-index:600;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(8px);animation:fadeIn .25s;padding:20px;}
  .modal{background:#111;border:1.5px solid rgba(255,215,0,.2);border-radius:20px;max-width:480px;width:100%;animation:popIn .3s cubic-bezier(.22,.68,0,1.2);overflow:hidden;}
  .form-input{
    width:100%;background:rgba(255,255,255,.06);border:1.5px solid rgba(255,255,255,.1);
    border-radius:10px;padding:11px 14px;color:#fff;font-size:14px;
    font-family:'Inter',sans-serif;outline:none;transition:border-color .22s;
  }
  .form-input:focus{border-color:rgba(255,215,0,.5);}
  .form-input.err{border-color:rgba(239,68,68,.5);}
  .form-input::placeholder{color:rgba(255,255,255,.3);}
  .form-label{font-size:11px;font-weight:700;color:rgba(255,255,255,.5);letter-spacing:.5px;text-transform:uppercase;margin-bottom:6px;display:block;}
  .empty-state{text-align:center;padding:80px 20px;}
  @media(max-width:640px){
    .clubs-grid{grid-template-columns:1fr!important;}
  }
`;

function ApplicationModal({ club, user, onClose, onSuccess }) {
  const [form, setForm] = useState({ studentName: user?.name || "", studentIdNumber: user?.studentId || "", preferredRole: "", reason: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const ROLES = ["Member", "Organizer", "Leader", "Treasurer", "Secretary"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const name = form.studentName?.trim();
    const sid = form.studentIdNumber?.trim()?.toUpperCase();
    const reason = form.reason?.trim();

    if (!name || name.length < 3) return setError("Name must be at least 3 letters.");
    if (!/^[A-Za-z\s]+$/.test(name)) return setError("Name must contain letters only.");
    if (!/^IT\d{7}$/.test(sid)) return setError("Invalid Student Number (e.g. IT2324616).");
    if (!form.preferredRole) return setError("Please select a preferred role.");
    if (reason.length < 50) return setError("Reason too short. Min 50 characters required.");
    if (reason.length > 500) return setError("Reason too long. Max 500 characters allowed.");

    setLoading(true);
    try {
      await applicationsAPI.submit({ 
        clubId: club._id, 
        studentName: name, 
        studentIdNumber: sid, 
        preferredRole: form.preferredRole, 
        reason: reason 
      });
      onSuccess("Application submitted successfully! Our committee will review it soon. 🎉");
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div style={{ padding: "20px 24px 0", borderBottom: "1px solid rgba(255,255,255,.07)", paddingBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: "11px", color: "#FFD700", fontWeight: 700, marginBottom: "4px", letterSpacing: ".5px" }}>JOIN REQUEST</div>
            <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#fff" }}>{club.name}</h3>
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,.07)", border: "none", color: "#fff", width: "32px", height: "32px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <X size={16} />
          </button>
        </div>
        <div style={{ padding: "20px 24px 24px" }}>
          {error && <div style={{ display: "flex", alignItems: "center", gap: "7px", background: "rgba(239,68,68,.08)", border: "1px solid rgba(239,68,68,.2)", borderRadius: "9px", padding: "9px 12px", marginBottom: "14px", fontSize: "12px", color: "#f87171" }}>{error}</div>}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "12px" }}>
              <label className="form-label">Full Name</label>
              <input className={`form-input${!form.studentName ? "" : ""}`} placeholder="Your full name" value={form.studentName} onChange={e => setForm(p => ({ ...p, studentName: e.target.value }))} />
            </div>
            <div style={{ marginBottom: "12px" }}>
              <label className="form-label">Student ID</label>
              <input className="form-input" placeholder="e.g. IT2324616" value={form.studentIdNumber} onChange={e => setForm(p => ({ ...p, studentIdNumber: e.target.value }))} />
            </div>
            <div style={{ marginBottom: "12px" }}>
              <label className="form-label">Preferred Role</label>
              <select className="form-input" value={form.preferredRole} onChange={e => setForm(p => ({ ...p, preferredRole: e.target.value }))}>
                <option value="">-- Select a role --</option>
                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: "16px" }}>
              <label className="form-label">Reason for Joining <span style={{ color: "rgba(255,255,255,.3)", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>({form.reason.length}/50 min)</span></label>
              <textarea className="form-input" rows={4} placeholder="Why do you want to join this club? (min 50 characters)" value={form.reason} onChange={e => setForm(p => ({ ...p, reason: e.target.value }))} style={{ resize: "vertical", minHeight: "90px" }} />
            </div>
            <button type="submit" style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", background: "#FFD700", color: "#0A0A0A", border: "none", borderRadius: "10px", padding: "13px", fontSize: "14px", fontWeight: 700, cursor: "pointer", transition: "all .22s", boxShadow: "0 4px 18px rgba(255,215,0,.3)", opacity: loading ? .6 : 1 }} disabled={loading}>
              {loading ? "Submitting..." : "Submit Application"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function ClubsPage() {
  const navigate = useNavigate();
  const session = getSession();
  const user = session?.user;

  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [applyClub, setApplyClub] = useState(null);
  const [selectedClub, setSelectedClub] = useState(null);
  const [toast, setToast] = useState({ show: false, msg: "" });

  const showToast = (msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: "" }), 4000);
  };

  const Skeleton = () => (
    <div className="club-card" style={{ height: "360px", opacity: 0.5 }}>
      <div style={{ height: "140px", background: "rgba(255,255,255,.05)" }} />
      <div style={{ padding: "20px" }}>
        <div style={{ height: "20px", background: "rgba(255,255,255,.05)", borderRadius: "4px", width: "60%", marginBottom: "12px" }} />
        <div style={{ height: "14px", background: "rgba(255,255,255,.03)", borderRadius: "4px", width: "100%", marginBottom: "8px" }} />
        <div style={{ height: "14px", background: "rgba(255,255,255,.03)", borderRadius: "4px", width: "40%", marginBottom: "24px" }} />
        <div style={{ height: "40px", background: "rgba(255,255,255,.05)", borderRadius: "9px" }} />
      </div>
    </div>
  );

  useEffect(() => {
    if (!session) { navigate("/clubs/auth"); return; }
    if (user?.role === "admin") { navigate("/clubs/admin"); return; }
    fetchClubs();
  }, [category]);

  const fetchClubs = async () => {
    setLoading(true);
    try {
      const res = await clubsAPI.getAll(category !== "All" ? category : "");
      setClubs(res.data);
    } catch { setClubs([]); }
    finally { setLoading(false); }
  };

  const filtered = clubs.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleLogout = () => { clearSession(); navigate("/clubs/auth"); };

  return (
    <>
      <style>{CSS}</style>
      {toast.show && (
        <div style={{ position: "fixed", bottom: "24px", right: "24px", zIndex: 9999, background: "#FFD700", color: "#0A0A0A", borderRadius: "12px", padding: "14px 20px", fontWeight: 700, fontSize: "14px", boxShadow: "0 8px 32px rgba(255,215,0,.4)", animation: "fadeUp .3s ease", display: "flex", alignItems: "center", gap: "8px" }}>
          ✅ {toast.msg}
        </div>
      )}
      <nav className="cd-nav">
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div className="cd-badge">🏛️ UniMate Clubs</div>
          {user && <span style={{ fontSize: "13px", color: "rgba(255,255,255,.5)" }}>Hi, {user.name.split(" ")[0]}</span>}
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button className="cd-icon-btn" onClick={() => navigate("/clubs/chat")}><Bot size={14} /> AI Chatbot</button>
          <button className="cd-icon-btn" onClick={() => navigate("/clubs/advisor")}><MessageSquare size={14} /> Advisor</button>
          <button className="cd-icon-btn" onClick={() => navigate("/clubs/my-applications")}><ClipboardList size={14} /> My Applications</button>
          <button className="cd-icon-btn" onClick={handleLogout}><LogOut size={14} /> Logout</button>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ background: "linear-gradient(145deg,#0A0A0A,#111)", borderBottom: "1px solid rgba(255,215,0,.08)", padding: "40px clamp(16px,4vw,48px)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <h1 style={{ fontSize: "clamp(26px,4vw,40px)", fontWeight: 900, color: "#fff", letterSpacing: "-1px", marginBottom: "10px" }}>
            Discover <span style={{ color: "#FFD700" }}>Clubs & Societies</span>
          </h1>
          <p style={{ fontSize: "15px", color: "rgba(255,255,255,.5)", marginBottom: "24px" }}>Find your community. Explore {clubs.length} active student clubs at SLIIT.</p>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
            <div className="cd-search">
              <Search size={15} color="rgba(255,255,255,.35)" />
              <input placeholder="Search clubs..." value={search} onChange={e => setSearch(e.target.value)} />
              {search && <X size={14} color="rgba(255,255,255,.4)" style={{ cursor: "pointer", flexShrink: 0 }} onClick={() => setSearch("")} />}
            </div>
            <button style={{ display: "flex", alignItems: "center", gap: "7px", background: "#FFD700", color: "#0A0A0A", borderRadius: "10px", padding: "10px 18px", fontSize: "13px", fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 16px rgba(255,215,0,.3)", border: "none" }} onClick={() => navigate("/clubs/chat")}>
              <Bot size={14} /> Ask AI Chatbot
            </button>
          </div>
        </div>
      </div>


      {/* Clubs Grid */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "32px clamp(16px,4vw,48px) 80px" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div style={{ width: "36px", height: "36px", border: "3px solid rgba(255,215,0,.2)", borderTopColor: "#FFD700", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto" }} />
            <p style={{ color: "rgba(255,255,255,.4)", marginTop: "16px", fontSize: "14px" }}>Loading clubs...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <Users size={48} style={{ color: "rgba(255,255,255,.15)", marginBottom: "16px" }} />
            <p style={{ fontSize: "16px", color: "rgba(255,255,255,.5)", fontWeight: 600 }}>No clubs found</p>
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,.3)", marginTop: "6px" }}>Try a different search term or category</p>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px", gap: "20px", flexWrap: "wrap" }}>
              <h2 style={{ fontSize: "24px", fontWeight: 800, color: "#fff", margin: 0 }}>Popular Clubs</h2>
              <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "4px" }}>
                {CATEGORIES.map(c => (
                  <button key={c} className={`cat-pill${category === c ? " active" : ""}`} style={{ fontSize: "12px", padding: "6px 16px" }} onClick={() => setCategory(c)}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div className="clubs-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(400px,1fr))", gap: "32px" }}>
              {loading ? (
                [...Array(6)].map((_, i) => <Skeleton key={i} />)
              ) : (
                filtered.map((club, i) => (
                  <div key={club._id} className="club-card" style={{ animation: `fadeUp .5s ease ${i * .06}s both`, cursor: "pointer" }} onClick={() => setSelectedClub(club)}>
                    <div className="member-badge">
                      <Users size={12} strokeWidth={3} /> {club.memberCount || 0}+ Members
                    </div>
                    {club.logoUrl && (
                      <div style={{ height: "200px", overflow: "hidden", position: "relative" }}>
                        <img src={club.logoUrl} alt={club.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => { e.target.parentElement.style.display = "none"; }} />
                        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom,transparent 20%,rgba(17,17,17,1))" }} />
                      </div>
                    )}
                    <div style={{ padding: "24px" }}>
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "10px", marginBottom: "10px" }}>
                        <div>
                          <div style={{ display: "inline-flex", alignItems: "center", gap: "4px", background: "rgba(255,215,0,.1)", border: "1px solid rgba(255,215,0,.2)", borderRadius: "100px", padding: "2px 10px", marginBottom: "6px" }}>
                            <span style={{ fontSize: "11px", fontWeight: 700, color: "#FFD700" }}>{CAT_ICONS[club.category]} {club.category}</span>
                          </div>
                          <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#fff", letterSpacing: "-0.3px" }}>{club.name}</h3>
                        </div>
                      </div>
                      <p style={{ fontSize: "13px", color: "rgba(255,255,255,.5)", lineHeight: 1.65, marginBottom: "16px" }}>{club.description}</p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "16px" }}>
                        {club.tags.slice(0, 4).map(tag => (
                          <span key={tag} style={{ fontSize: "11px", background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.1)", borderRadius: "6px", padding: "2px 8px", color: "rgba(255,255,255,.6)" }}>
                            {tag.replace(/_/g, " ")}
                          </span>
                        ))}
                      </div>
                      <button className="join-btn" onClick={(e) => { e.stopPropagation(); setSelectedClub(club); }}>
                        View Club
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
            {!loading && filtered.length > 0 && (
              <div style={{ marginTop: "40px", display: "flex", justifyContent: "center" }}>
                <a href="#" style={{ color: "#FFD700", fontSize: "14px", fontWeight: 600, textDecoration: "none", display: "flex", alignItems: "center", gap: "6px" }}>
                  View All Clubs <ChevronRight size={16} />
                </a>
              </div>
            )}
          </>
        )}
      </div>

      {applyClub && <ApplicationModal club={applyClub} user={user} onClose={() => setApplyClub(null)} onSuccess={showToast} />}
      {selectedClub && <ClubDetailsModal club={selectedClub} onClose={() => setSelectedClub(null)} onJoin={(c) => { setSelectedClub(null); setApplyClub(c); }} />}
    </>
  );
}
