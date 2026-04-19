import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Search, Filter, Bot, ClipboardList, Star, MessageSquare,
  Users, BookOpen, Zap, Palette, Trophy, Globe2, Briefcase, Tv2, ChevronRight, X, Sparkles, Bell, LogOut
} from "lucide-react";
import { clubsAPI, applicationsAPI, recommendationsAPI, getSession, clearSession } from "../../api/clubsApi";
import ClubDetailsModal from "../../components/clubs/ClubDetailsModal";

const CATEGORIES = [
  "All",
  "Technology",
  "Leadership",
  "Academic",
  "Community",
  "Media",
  "Arts",
  "Sports",
  "Wellness",
  "Cultural",
  "Science",
  "Business",
];

const CAT_ICONS = {
  All: <Filter size={14} />,
  Technology: <Zap size={14} />,
  Leadership: <Star size={14} />,
  Academic: <BookOpen size={14} />,
  Community: <Users size={14} />,
  Media: <Tv2 size={14} />,
  Arts: <Palette size={14} />,
  Sports: <Trophy size={14} />,
  Wellness: <Star size={14} />,
  Cultural: <Globe2 size={14} />,
  Science: <BookOpen size={14} />,
  Business: <Briefcase size={14} />,
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
  .cd-icon-btn.logout-btn{background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.22);color:#f87171;}
  .cd-icon-btn.logout-btn:hover{background:rgba(239,68,68,.18);border-color:rgba(239,68,68,.38);color:#fecaca;}
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

  .ai-assist-btn{
    margin-left:auto;display:inline-flex;align-items:center;gap:6px;
    background:rgba(255,215,0,.12);border:1px solid rgba(255,215,0,.3);color:#FFD700;
    font-size:10px;font-weight:800;padding:5px 10px;border-radius:100px;cursor:pointer;
    transition:all .2s;letter-spacing:.2px;
  }
  .ai-assist-btn:hover{background:rgba(255,215,0,.2);border-color:#FFD700;}
  .ai-assist-btn.loading{opacity:.6;cursor:wait;}

  .notif-btn{position:relative;}
  .notif-badge{
    position:absolute;top:-6px;right:-6px;min-width:18px;height:18px;padding:0 5px;
    border-radius:999px;background:#ef4444;color:#fff;font-size:10px;font-weight:800;
    display:flex;align-items:center;justify-content:center;box-shadow:0 0 0 2px rgba(10,10,10,.8);
  }

  .rec-row{margin-bottom:28px;}
  .rec-row-title{font-size:20px;font-weight:900;color:#fff;margin-bottom:12px;}
  .rec-row-sub{font-size:12px;color:rgba(255,255,255,.4);margin-bottom:16px;}
  .rec-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px;}
  .rec-card{background:#111;border:1.5px solid rgba(255,215,0,.15);border-radius:16px;overflow:hidden;cursor:pointer;transition:all .25s;}
  .rec-card:hover{border-color:rgba(255,215,0,.4);transform:translateY(-3px);box-shadow:0 10px 30px rgba(0,0,0,.4);} 
  .rec-card-body{padding:16px;}
  .rec-card-name{font-size:14px;font-weight:800;color:#fff;margin-bottom:6px;}
  .rec-card-desc{font-size:12px;color:rgba(255,255,255,.5);line-height:1.5;}
  
  .member-badge{
    position:absolute;top:12px;right:12px;z-index:10;
    background:rgba(34,197,94,.9);backdrop-filter:blur(4px);
    color:#fff;font-size:11px;font-weight:800;padding:4px 10px;
    border-radius:100px;display:flex;align-items:center;gap:4px;
    box-shadow:0 4px 12px rgba(34,197,94,.4);
  }
  .modal-bg{position:fixed;inset:0;background:rgba(0,0,0,.8);z-index:600;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(8px);animation:fadeIn .25s;padding:20px;}
  .modal{background:#111;border:1.5px solid rgba(255,215,0,.2);border-radius:20px;max-width:480px;width:100%;animation:popIn .3s cubic-bezier(.22,.68,0,1.2);overflow:hidden;}
  .confirm-overlay{position:fixed;inset:0;background:rgba(0,0,0,.78);backdrop-filter:blur(8px);z-index:950;display:flex;align-items:center;justify-content:center;padding:20px;animation:fadeIn .2s ease;}
  .confirm-box{width:100%;max-width:420px;background:#111;border:1.5px solid rgba(255,215,0,.2);border-radius:20px;box-shadow:0 20px 60px rgba(0,0,0,.55),0 0 20px rgba(255,215,0,.06);overflow:hidden;animation:popIn .22s ease;}
  .confirm-title{font-size:18px;font-weight:800;color:#fff;letter-spacing:-.3px;}
  .confirm-text{font-size:13px;line-height:1.65;color:rgba(255,255,255,.5);margin-top:8px;}
  .confirm-actions{display:flex;gap:10px;justify-content:flex-end;}
  .confirm-btn{border:none;border-radius:12px;padding:12px 16px;font-size:13px;font-weight:800;transition:all .2s;display:inline-flex;align-items:center;justify-content:center;}
  .confirm-btn.cancel{background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.1);color:rgba(255,255,255,.8);}
  .confirm-btn.cancel:hover{border-color:rgba(255,215,0,.28);color:#FFD700;background:rgba(255,215,0,.06);}
  .confirm-btn.logout{background:#FFD700;color:#0A0A0A;box-shadow:0 8px 26px rgba(255,215,0,.22);}
  .confirm-btn.logout:hover{transform:translateY(-1px);box-shadow:0 12px 32px rgba(255,215,0,.28);}
  .form-input{
    width:100%;background:rgba(255,255,255,.06);border:1.5px solid rgba(255,255,255,.1);
    border-radius:10px;padding:11px 14px;color:#fff;font-size:14px;
    font-family:'Inter',sans-serif;outline:none;transition:border-color .22s;
  }
  .form-input:focus{border-color:rgba(255,215,0,.5);}
  .form-input.err{border-color:rgba(239,68,68,.5);}
  .form-input::placeholder{color:rgba(255,255,255,.3);}
  .form-label{font-size:11px;font-weight:700;color:rgba(255,255,255,.5);letter-spacing:.5px;text-transform:uppercase;margin-bottom:6px;display:block;}
  .clubs-empty-state{
    text-align:center;
    padding:80px 20px;
    background:#111;
    border:1.5px solid rgba(255,255,255,.08);
    border-radius:20px;
  }

  /* Custom Role Dropdown */
  .role-dropdown-wrapper{position:relative;}
  .role-dropdown-btn{
    width:100%;background:rgba(255,255,255,.06);border:1.5px solid rgba(255,255,255,.1);
    border-radius:10px;padding:11px 14px;color:#fff;font-size:14px;
    font-family:'Inter',sans-serif;outline:none;transition:border-color .22s;
    display:flex;align-items:center;justify-content:space-between;
    cursor:pointer;text-align:left;
  }
  .role-dropdown-btn:hover,.role-dropdown-btn.open{border-color:rgba(255,215,0,.5);}
  .role-dropdown-btn.placeholder{color:rgba(255,255,255,.3);}
  .role-dropdown-menu{
    position:absolute;top:calc(100% + 6px);left:0;right:0;z-index:900;
    background:#1a1a1a;border:1.5px solid rgba(255,215,0,.25);
    border-radius:12px;overflow:hidden;
    box-shadow:0 16px 48px rgba(0,0,0,.6);
    animation:fadeIn .15s ease;
  }
  .role-option{
    padding:12px 16px;font-size:14px;font-weight:600;color:rgba(255,255,255,.8);
    cursor:pointer;transition:all .15s;display:flex;align-items:center;gap:10px;
    border-bottom:1px solid rgba(255,255,255,.04);
  }
  .role-option:last-child{border-bottom:none;}
  .role-option:hover{background:rgba(255,215,0,.1);color:#FFD700;}
  .role-option.selected{background:rgba(255,215,0,.08);color:#FFD700;}
  .role-option .role-dot{width:7px;height:7px;border-radius:50%;background:rgba(255,215,0,.4);flex-shrink:0;}
  .role-option.selected .role-dot{background:#FFD700;box-shadow:0 0 6px rgba(255,215,0,.5);}

  @media(max-width:640px){
    .clubs-grid{grid-template-columns:1fr!important;}
  }
`;

function RoleDropdown({ value, onChange, roles }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="role-dropdown-wrapper">
      <button
        type="button"
        className={`role-dropdown-btn${open ? " open" : ""}${!value ? " placeholder" : ""}`}
        onClick={() => setOpen(o => !o)}
      >
        <span>{value || "-- Select a role --"}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
          style={{ transition: "transform .2s", transform: open ? "rotate(180deg)" : "rotate(0deg)", flexShrink: 0 }}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && (
        <>
          <div style={{ position: "fixed", inset: 0, zIndex: 800 }} onClick={() => setOpen(false)} />
          <div className="role-dropdown-menu">
            {roles.map(r => (
              <div
                key={r}
                className={`role-option${value === r ? " selected" : ""}`}
                onClick={() => { onChange(r); setOpen(false); }}
              >
                <span className="role-dot" />
                {r}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function ApplicationModal({ club, user, onClose, onSuccess }) {
  const [form, setForm] = useState({ studentName: user?.name || "", studentIdNumber: user?.studentId || "", preferredRole: "", reason: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDrafting, setIsDrafting] = useState(false);

  const ROLES = ["Member", "Organizer", "Leader", "Treasurer", "Secretary"];

  const handleDraft = async () => {
    if (!form.preferredRole) {
      setError("Please select a preferred role first so the AI knows what to draft.");
      return;
    }
    setIsDrafting(true);
    setError("");
    try {
      const res = await recommendationsAPI.getDraft({
        clubName: club.name,
        role: form.preferredRole,
        userName: form.studentName || user?.name
      });
      if (res.data?.draft) {
        setForm(p => ({ ...p, reason: res.data.draft }));
      }
    } catch (err) {
      setError("AI generation failed. Please try drafting manually.");
    } finally {
      setIsDrafting(false);
    }
  };

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
              <RoleDropdown
                value={form.preferredRole}
                onChange={(val) => setForm(p => ({ ...p, preferredRole: val }))}
                roles={ROLES}
              />
            </div>
            <div style={{ marginBottom: "16px" }}>
              <label className="form-label" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span>Reason for Joining <span style={{ color: "rgba(255,255,255,.3)", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>({form.reason.length}/50 min)</span></span>
                <button type="button" className={`ai-assist-btn ${isDrafting ? "loading" : ""}`} onClick={handleDraft} disabled={isDrafting || loading}>
                  <Sparkles size={12} /> {isDrafting ? "Drafting..." : "AI Assist"}
                </button>
              </label>
              <textarea className="form-input" rows={4} placeholder="Why do you want to join this club? (min 50 characters)" value={form.reason} onChange={e => setForm(p => ({ ...p, reason: e.target.value }))} style={{ resize: "vertical", minHeight: "90px" }} disabled={isDrafting || loading} />
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
  const location = useLocation();
  const user = getSession()?.user;

  const [toast, setToast] = useState({ show: false, msg: "" });
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    setShowLogoutConfirm(false);
    clearSession();
    navigate("/login");
  };

  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [applyClub, setApplyClub] = useState(null);
  const [selectedClub, setSelectedClub] = useState(null);
  const [recommended, setRecommended] = useState([]);
  const [recommendedSource, setRecommendedSource] = useState("");
  const [notifCount, setNotifCount] = useState(0);

  const showToast = (msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: "" }), 4000);
  };

  const getLastSeenNotifications = () => Number(localStorage.getItem("clubsNotificationsSeenAt") || 0);

  const markNotificationsSeen = () => {
    const now = Date.now();
    localStorage.setItem("clubsNotificationsSeenAt", String(now));
    setNotifCount(0);
  };

  const buildRecommendationsFromApps = (apps, clubList) => {
    if (!apps?.length) return [];
    const appliedIds = new Set(apps.map(a => a.clubId?._id).filter(Boolean));
    const categories = new Set(apps.map(a => a.clubId?.category).filter(Boolean));
    return clubList
      .filter(c => categories.has(c.category) && !appliedIds.has(c._id))
      .slice(0, 4);
  };

  const buildRecommendationsFromHistory = (history, clubList) => {
    const text = (history || [])
      .filter(m => m.type === "user")
      .slice(-4)
      .map(m => m.text)
      .join(" ")
      .toLowerCase();
    if (!text) return [];
    const keywords = new Set(text.split(/\W+/).filter(w => w.length > 3));
    const scored = clubList.map(club => {
      const category = club.category?.toLowerCase() || "";
      const tags = (club.tags || []).map(t => t.toLowerCase());
      const desc = (club.description || "").toLowerCase();
      let score = 0;
      keywords.forEach(k => {
        if (category.includes(k)) score += 3;
        if (tags.some(t => t.includes(k))) score += 2;
        if (desc.includes(k)) score += 1;
      });
      return { club, score };
    });
    return scored
      .filter(s => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
      .map(s => s.club);
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
    const currentSession = getSession();
    const currentUser = currentSession?.user;

    if (!currentSession) {
      navigate("/login");
      return;
    }
    if (currentUser?.role === "admin") {
      navigate("/clubs/admin");
      return;
    }
    fetchClubs();
  }, [category, navigate]);

  const fetchClubs = async () => {
    setLoading(true);
    try {
      const res = await clubsAPI.getAll(category !== "All" ? category : "");
      setClubs(res.data);
      loadUserSignals(res.data);
      if (location.state?.openClubId) {
        const clubToOpen = res.data.find(c => c._id === location.state.openClubId);
        if (clubToOpen) {
          setSelectedClub(clubToOpen);
          // clear state so it doesn't reopen continuously on refreshes within the same category
          window.history.replaceState({}, document.title);
        }
      }
    } catch { setClubs([]); }
    finally { setLoading(false); }
  };

  const loadUserSignals = async (clubList) => {
    try {
      const appsRes = await applicationsAPI.getMy();
      const apps = Array.isArray(appsRes.data) ? appsRes.data : [];
      const lastSeen = getLastSeenNotifications();
      const updates = apps.filter(a => {
        if (a.status === "Pending") return false;
        const reviewedAt = a.reviewedAt ? new Date(a.reviewedAt).getTime() : 0;
        const interviewAt = a.interviewAt ? new Date(a.interviewAt).getTime() : 0;
        return reviewedAt > lastSeen || interviewAt > lastSeen;
      });
      setNotifCount(updates.length);

      const recFromApps = buildRecommendationsFromApps(apps, clubList);
      if (recFromApps.length > 0) {
        setRecommended(recFromApps);
        setRecommendedSource("applications");
        return;
      }

      const historyRes = await recommendationsAPI.getHistory();
      const recFromHistory = buildRecommendationsFromHistory(historyRes.data, clubList);
      setRecommended(recFromHistory);
      setRecommendedSource(recFromHistory.length > 0 ? "history" : "");
    } catch {
      setRecommended([]);
      setRecommendedSource("");
      setNotifCount(0);
    }
  };

  const filtered = clubs.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <style>{CSS}</style>
      {toast.show && (
        <div style={{ position: "fixed", bottom: "24px", right: "24px", zIndex: 9999, background: "#FFD700", color: "#0A0A0A", borderRadius: "12px", padding: "14px 20px", fontWeight: 700, fontSize: "14px", boxShadow: "0 8px 32px rgba(255,215,0,.4)", animation: "fadeUp .3s ease", display: "flex", alignItems: "center", gap: "8px" }}>
          ✅ {toast.msg}
        </div>
      )}
      {showLogoutConfirm && (
        <div className="confirm-overlay" onClick={() => setShowLogoutConfirm(false)}>
          <div className="confirm-box" onClick={e => e.stopPropagation()}>
            <div style={{ padding: "22px 24px 18px", borderBottom: "1px solid rgba(255,255,255,.06)" }}>
              <div className="cd-badge" style={{ marginBottom: "12px" }}>⚠️ Confirm Action</div>
              <div className="confirm-title">Log out of Unimate?</div>
              <p className="confirm-text">You will be signed out from your current session and returned to the login page.</p>
            </div>
            <div style={{ padding: "18px 24px 24px" }}>
              <div className="confirm-actions">
                <button type="button" className="confirm-btn cancel" onClick={() => setShowLogoutConfirm(false)}>
                  Cancel
                </button>
                <button type="button" className="confirm-btn logout" onClick={confirmLogout}>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <nav className="cd-nav">
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div className="cd-badge">🏛️ UniMate Clubs</div>
          {user && <span style={{ fontSize: "13px", color: "rgba(255,255,255,.5)" }}>Hi, {(user.name || "Student").split(" ")[0]}</span>}
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button className="cd-icon-btn" onClick={() => navigate("/dashboard")}>Dashboard</button>
          <button className="cd-icon-btn" onClick={() => navigate("/clubs/chat")}><Bot size={14} /> AI Chatbot</button>
          <button className="cd-icon-btn" onClick={() => navigate("/clubs/advisor")}><MessageSquare size={14} /> Advisor</button>
          <button className="cd-icon-btn notif-btn" onClick={() => { markNotificationsSeen(); navigate("/clubs/my-applications", { state: { openUpdates: true } }); }}>
            <Bell size={14} /> Updates
            {notifCount > 0 && <span className="notif-badge">{notifCount}</span>}
          </button>
          <button className="cd-icon-btn" onClick={() => navigate("/clubs/my-applications")}><ClipboardList size={14} /> My Applications</button>
          <button className="cd-icon-btn logout-btn" onClick={handleLogout}><LogOut size={14} /> Logout</button>
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

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px", gap: "20px", flexWrap: "wrap" }}>
          <h2 style={{ fontSize: "24px", fontWeight: 800, color: "#fff", margin: 0 }}>Popular Clubs</h2>
          <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "4px" }}>
            {CATEGORIES.map(c => (
              <button
                key={c}
                className={`cat-pill${category === c ? " active" : ""}`}
                style={{ fontSize: "12px", padding: "6px 16px" }}
                onClick={() => setCategory(c)}
              >
                {CAT_ICONS[c]} {c}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                border: "3px solid rgba(255,215,0,.2)",
                borderTopColor: "#FFD700",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
                margin: "0 auto"
              }}
            />
            <p style={{ color: "rgba(255,255,255,.4)", marginTop: "16px", fontSize: "14px" }}>
              Loading clubs...
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="clubs-empty-state">
            <Users size={48} style={{ color: "rgba(255,255,255,.15)", marginBottom: "16px" }} />
            <p style={{ fontSize: "16px", color: "rgba(255,255,255,.5)", fontWeight: 600 }}>No clubs found</p>
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,.3)", marginTop: "6px" }}>
              Try a different search term or category
            </p>
          </div>
        ) : (
          <>
            {recommended.length > 0 && (
              <div className="rec-row">
                <div className="rec-row-title">Recommended for You</div>
                <div className="rec-row-sub">
                  {recommendedSource === "applications"
                    ? "Based on your active applications"
                    : "Based on your AI chat interests"}
                </div>
                <div className="rec-grid">
                  {recommended.map((club) => (
                    <div key={club._id} className="rec-card" onClick={() => setSelectedClub(club)}>
                      {club.logoUrl && (
                        <div style={{ height: "120px", overflow: "hidden" }}>
                          <img
                            src={club.logoUrl}
                            alt={club.name}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            onError={e => { e.target.parentElement.style.display = "none"; }}
                          />
                        </div>
                      )}
                      <div className="rec-card-body">
                        <div style={{ fontSize: "11px", color: "rgba(255,215,0,.8)", fontWeight: 800, textTransform: "uppercase", marginBottom: "6px" }}>
                          {club.category}
                        </div>
                        <div className="rec-card-name">{club.name}</div>
                        <div className="rec-card-desc">{club.description?.slice(0, 80)}...</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="clubs-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(400px,1fr))", gap: "32px" }}>
              {filtered.map((club, i) => (
                <div
                  key={club._id}
                  className="club-card"
                  style={{ animation: `fadeUp .5s ease ${i * .06}s both`, cursor: "pointer" }}
                  onClick={() => setSelectedClub(club)}
                >
                  <div className="member-badge">
                    <Users size={12} strokeWidth={3} /> {club.memberCount || 0}+ Members
                  </div>

                  {club.logoUrl && (
                    <div style={{ height: "200px", overflow: "hidden", position: "relative" }}>
                      <img
                        src={club.logoUrl}
                        alt={club.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        onError={e => { e.target.parentElement.style.display = "none"; }}
                      />
                      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom,transparent 20%,rgba(17,17,17,1))" }} />
                    </div>
                  )}

                  <div style={{ padding: "24px" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "10px", marginBottom: "10px" }}>
                      <div>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: "4px", background: "rgba(255,215,0,.1)", border: "1px solid rgba(255,215,0,.2)", borderRadius: "100px", padding: "2px 10px", marginBottom: "6px" }}>
                          <span style={{ fontSize: "11px", fontWeight: 700, color: "#FFD700" }}>
                            {CAT_ICONS[club.category]} {club.category}
                          </span>
                        </div>
                        <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#fff", letterSpacing: "-0.3px" }}>
                          {club.name}
                        </h3>
                      </div>
                    </div>

                    <p style={{ fontSize: "13px", color: "rgba(255,255,255,.5)", lineHeight: 1.65, marginBottom: "16px" }}>
                      {club.description}
                    </p>

                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "16px" }}>
                      {(club.tags || []).slice(0, 4).map(tag => (
                        <span
                          key={tag}
                          style={{
                            fontSize: "11px",
                            background: "rgba(255,255,255,.07)",
                            border: "1px solid rgba(255,255,255,.1)",
                            borderRadius: "6px",
                            padding: "2px 8px",
                            color: "rgba(255,255,255,.6)"
                          }}
                        >
                          {tag.replace(/_/g, " ")}
                        </span>
                      ))}
                    </div>

                    <button
                      className="join-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedClub(club);
                      }}
                    >
                      View Club
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: "40px", display: "flex", justifyContent: "center" }}>
              <a
                href="#"
                style={{
                  color: "#FFD700",
                  fontSize: "14px",
                  fontWeight: 600,
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px"
                }}
              >
                View All Clubs <ChevronRight size={16} />
              </a>
            </div>
          </>
)}
      </div>

      {applyClub && <ApplicationModal club={applyClub} user={user} onClose={() => setApplyClub(null)} onSuccess={showToast} />}
      {selectedClub && <ClubDetailsModal club={selectedClub} onClose={() => setSelectedClub(null)} onJoin={(c) => { setSelectedClub(null); setApplyClub(c); }} />}
    </>
  );
}
