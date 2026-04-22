import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Users, ClipboardList, BookOpen, LogOut,
  Plus, Pencil, Trash2, Check, X, ChevronDown, RefreshCw,
  Shield, BarChart3, Search, AlertTriangle
} from "lucide-react";
import { adminAPI, getSession, clearSession } from "../../api/clubsApi";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
  *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
  html,body,#root{width:100%;min-height:100vh;}
  body{font-family:'Inter',system-ui,sans-serif;background:#050A18;color:#fff;}
  button{font-family:inherit;cursor:pointer;border:none;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes popIn{from{transform:scale(.75);opacity:0}to{transform:scale(1);opacity:1}}

  .adm-layout{display:flex;min-height:100vh;background:radial-gradient(circle at top right, rgba(255,215,0,0.03), transparent 40%), radial-gradient(circle at bottom left, rgba(255,215,0,0.02), transparent 40%);}
  .adm-sidebar{
    width:240px;flex-shrink:0;background:rgba(5,10,24,0.6);backdrop-filter:blur(20px);
    border-right:1px solid rgba(255,255,255,0.06);display:flex;flex-direction:column;
    position:sticky;top:0;height:100vh;overflow-y:auto;
  }
  .adm-main{flex:1;min-width:0;display:flex;flex-direction:column;}
  .adm-header{
    position:sticky;top:0;z-index:50;background:rgba(5,10,24,0.8);backdrop-filter:blur(20px);
    border-bottom:1px solid rgba(255,255,255,0.06);padding:0 32px;height:72px;
    display:flex;align-items:center;justify-content:space-between;
  }
  .nav-item{
    display:flex;align-items:center;gap:12px;padding:12px 20px;
    border-radius:12px;font-size:14px;font-weight:600;color:rgba(255,255,255,0.55);
    cursor:pointer;transition:all .25s;border:none;background:none;width:100%;text-align:left;
    margin-bottom:6px;
  }
  .nav-item:hover{color:#fff;background:rgba(255,215,0,0.05);}
  .nav-item.active{color:#FFD700;background:rgba(255,215,0,0.1);font-weight:700;}
  
  .ad-btn{
    display:flex;align-items:center;justify-content:center;gap:8px;
    background:linear-gradient(135deg, #FFD700, #d4af37);color:#050A18;border:none;border-radius:12px;
    padding:10px 20px;font-size:13px;font-weight:800;cursor:pointer;
    transition:all .25s;box-shadow:0 8px 24px rgba(255,215,0,.25);
  }
  .ad-btn:hover{box-shadow:0 12px 30px rgba(255,215,0,.35);transform:translateY(-2px);}
  .ad-btn.sec{background:rgba(255,255,255,.05);color:rgba(255,255,255,.8);box-shadow:none;border:1px solid rgba(255,255,255,.1);}
  .ad-btn.sec:hover{background:rgba(255,215,0,.1);border-color:rgba(255,215,0,.3);color:#FFD700;transform:translateY(-1px);}
  .ad-btn.danger{background:rgba(239,68,68,.1);color:#f87171;border:1px solid rgba(239,68,68,.2);box-shadow:none;}
  .ad-btn.danger:hover{background:rgba(239,68,68,.2);border-color:rgba(239,68,68,.4);transform:translateY(-1px);}
  .ad-btn.approve{background:rgba(74,222,128,.1);color:#4ade80;border:1px solid rgba(74,222,128,.2);box-shadow:none;}
  .ad-btn.approve:hover{background:rgba(74,222,128,.2);border-color:rgba(74,222,128,.4);transform:translateY(-1px);}
  
  .stat-card{
    background:rgba(14,21,40,0.5);backdrop-filter:blur(10px);
    border:1px solid rgba(255,255,255,.08);border-radius:24px;padding:24px;transition:all .3s;
  }
  .stat-card:hover{border-color:rgba(255,215,0,.25);transform:translateY(-4px);box-shadow:0 12px 32px rgba(0,0,0,.3);}
  
  .ad-table-wrapper{
    background:rgba(14,21,40,0.6);backdrop-filter:blur(20px);
    border:1px solid rgba(255,255,255,.08);border-radius:24px;overflow:hidden;
  }
  .ad-table th{font-size:11px;font-weight:800;color:rgba(255,255,255,.4);letter-spacing:.5px;text-transform:uppercase;padding:16px 20px;background:rgba(255,255,255,.02);border-bottom:1px solid rgba(255,255,255,.06);text-align:left;}
  .ad-table td{font-size:13px;color:rgba(255,255,255,.8);padding:14px 20px;border-bottom:1px solid rgba(255,255,255,.04);vertical-align:middle;}
  .ad-table tr:hover td{background:rgba(255,215,0,.02);}
  .ad-table tr:last-child td{border-bottom:none;}
  
  .form-field input,.form-field select,.form-field textarea{
    width:100%;background:rgba(14,21,40,0.6);border:1px solid rgba(255,255,255,.1);
    border-radius:12px;padding:12px 16px;color:#fff;font-size:14px;
    font-family:'Inter',sans-serif;outline:none;transition:border-color .25s, box-shadow .25s;
  }
  .form-field input:focus,.form-field select:focus,.form-field textarea:focus{border-color:#FFD700;box-shadow:0 0 0 3px rgba(255,215,0,0.15);background:rgba(5,10,24,0.8);}
  
  .form-label{font-size:12px;font-weight:700;color:rgba(255,255,255,.6);margin-bottom:8px;display:block;}
  .modal-bg{position:fixed;inset:0;background:rgba(5,10,24,.85);z-index:200;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(12px);animation:fadeIn .25s;padding:20px;}
  .modal{background:rgba(14,21,40,0.95);border:1px solid rgba(255,215,0,.2);border-radius:28px;max-width:540px;width:100%;animation:popIn .3s cubic-bezier(.22,.68,0,1.2);overflow:hidden;box-shadow:0 24px 60px rgba(0,0,0,0.5);max-height:90vh;display:flex;flex-direction:column;}
  .modal-header{padding:24px 28px;border-bottom:1px solid rgba(255,255,255,.06);display:flex;justify-content:space-between;align-items:center;}
  .modal-body{padding:24px 28px;overflow-y:auto;}
  
  .status-badge{display:inline-flex;align-items:center;gap:6px;border-radius:100px;padding:6px 14px;font-size:12px;font-weight:800;letter-spacing:0.5px;text-transform:uppercase;}
  .status-badge.Pending{background:rgba(255,215,0,.1);border:1px solid rgba(255,215,0,.2);color:#FFD700;}
  .status-badge.Approved{background:rgba(74,222,128,.1);border:1px solid rgba(74,222,128,.2);color:#4ade80;}
  .status-badge.Rejected{background:rgba(248,113,113,.1);border:1px solid rgba(248,113,113,.2);color:#f87171;}
  
  .search-bar{
    display:flex;align-items:center;gap:10px;
    background:rgba(14,21,40,0.6);border:1px solid rgba(255,255,255,.1);
    border-radius:12px;padding:12px 18px;transition:all .25s;
  }
  .search-bar:focus-within{border-color:#FFD700;box-shadow:0 0 0 3px rgba(255,215,0,0.1);}
  .search-bar input{background:none;border:none;outline:none;color:#fff;font-size:14px;font-family:'Inter',sans-serif;width:100%;}
  .search-bar input::placeholder{color:rgba(255,255,255,.3);}
`;

const CATEGORIES = ["Technology", "Leadership", "Academic", "Community", "Media", "Arts", "Sports", "Wellness"];
const ROLES = ["Member", "Organizer", "Leader", "Treasurer", "Secretary"];

function ClubModal({ club, onClose, onSave }) {
  const [form, setForm] = useState(club || { name: "", category: "Technology", description: "", tags: "", logoUrl: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const name = form.name?.trim();
    const desc = form.description?.trim();

    if (!name || name.length < 3) return setError("Club name must be at least 3 characters.");
    if (!desc || desc.length < 20) return setError("Description must be at least 20 characters.");
    if (!form.category) return setError("Please select a category.");

    setLoading(true);
    try {
      const data = { 
        ...form, 
        name, 
        description: desc,
        tags: typeof form.tags === "string" ? form.tags.split(",").map(t => t.trim()).filter(Boolean) : form.tags 
      };
      if (club?._id) {
        await adminAPI.updateClub(club._id, data);
      } else {
        await adminAPI.createClub(data);
      }
      onSave();
    } catch (err) {
      setError(err.response?.data?.message || "Save failed. Please try again.");
    } finally { setLoading(false); }
  };

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 style={{ fontSize: "20px", fontWeight: 900, color: "#fff" }}>{club ? "Edit Club Profile" : "Create New Club"}</h3>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,.05)", border: "none", color: "rgba(255,255,255,0.6)", width: "36px", height: "36px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s" }} onMouseEnter={e => e.currentTarget.style.color="#fff"} onMouseLeave={e => e.currentTarget.style.color="rgba(255,255,255,0.6)"}><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="modal-body">
          {error && <div style={{ background: "rgba(239,68,68,.1)", border: "1px solid rgba(239,68,68,.2)", borderRadius: "12px", padding: "12px 16px", marginBottom: "20px", fontSize: "13px", color: "#f87171", display: "flex", gap: "8px", alignItems: "center" }}><AlertTriangle size={16}/> {error}</div>}
          {[{ label: "Club Name", key: "name", ph: "e.g. CodeSpace Club" }, { label: "Brand Logo URL (optional)", key: "logoUrl", ph: "https://..." }].map(f => (
            <div key={f.key} className="form-field" style={{ marginBottom: "16px" }}>
              <label className="form-label">{f.label}</label>
              <input placeholder={f.ph} value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} />
            </div>
          ))}
          <div className="form-field" style={{ marginBottom: "16px" }}>
            <label className="form-label">Classification Category</label>
            <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-field" style={{ marginBottom: "16px" }}>
            <label className="form-label">Detailed Description</label>
            <textarea rows={4} placeholder="Describe the club's mission, vision, and activities..." value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} style={{ resize: "vertical" }} />
          </div>
          <div className="form-field" style={{ marginBottom: "24px" }}>
            <label className="form-label">AI Matching Tags (Comma-separated)</label>
            <input placeholder="e.g. programming, workshops, data-science" value={typeof form.tags === "string" ? form.tags : form.tags?.join(", ")} onChange={e => setForm(p => ({ ...p, tags: e.target.value }))} />
          </div>
          <button type="submit" className="ad-btn" style={{ width: "100%", padding: "16px", fontSize: "15px" }} disabled={loading}>
            {loading ? "Processing..." : club ? "Update Club Profile" : "Launch New Club"}
          </button>
        </form>
      </div>
    </div>
  );
}

function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div className="modal-bg" onClick={onCancel}>
      <div style={{ background: "rgba(14,21,40,0.95)", border: "1px solid rgba(239,68,68,.3)", borderRadius: "24px", maxWidth: "400px", width: "100%", padding: "32px", animation: "popIn .3s cubic-bezier(.22,.68,0,1.2)", textAlign: "center", boxShadow: "0 24px 60px rgba(0,0,0,0.5)" }} onClick={e => e.stopPropagation()}>
        <div style={{ width: "64px", height: "64px", borderRadius: "20px", background: "rgba(239,68,68,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
          <AlertTriangle size={32} color="#f87171" />
        </div>
        <h3 style={{ fontSize: "20px", fontWeight: 800, color: "#fff", marginBottom: "8px" }}>Delete Confirmation</h3>
        <p style={{ fontSize: "14px", color: "rgba(255,255,255,.6)", marginBottom: "32px", lineHeight: 1.6 }}>{message}</p>
        <div style={{ display: "flex", gap: "12px" }}>
          <button className="ad-btn sec" style={{ flex: 1, padding: "14px" }} onClick={onCancel}>Cancel</button>
          <button className="ad-btn danger" style={{ flex: 1, padding: "14px" }} onClick={onConfirm}>Yes, Delete</button>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const session = getSession();
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState(null);
  const [clubs, setClubs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [appFilter, setAppFilter] = useState({ status: "", clubId: "" });
  const [clubSearch, setClubSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [clubModal, setClubModal] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (!session) { navigate("/clubs/auth"); return; }
    if (session.user?.role !== "admin") { navigate("/clubs"); return; }
    loadAll();
  }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [s, c, a] = await Promise.all([adminAPI.getStats(), adminAPI.getClubs(), adminAPI.getApplications()]);
      setStats(s.data); setClubs(c.data); setApplications(a.data);
    } catch { }
    finally { setLoading(false); }
  };

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 4000); };

  const handleDeleteClub = (id) => {
    setConfirm({ message: "This will also delete all related applications. This action cannot be undone.", onConfirm: async () => { setConfirm(null); await adminAPI.deleteClub(id); showToast("Club successfully deleted."); loadAll(); } });
  };

  const handleAppStatus = async (id, status) => {
    try {
      await adminAPI.updateApplication(id, { status });
      showToast(`Application successfully ${status.toLowerCase()}!`);
      const res = await adminAPI.getApplications(appFilter);
      setApplications(res.data);
      const s = await adminAPI.getStats(); setStats(s.data);
    } catch (err) { showToast("Action failed. Please try again."); }
  };

  const filteredApps = applications.filter(a =>
    (!appFilter.status || a.status === appFilter.status) &&
    (!appFilter.clubId || a.clubId?._id === appFilter.clubId)
  );
  const filteredClubs = clubs.filter(c => c.name.toLowerCase().includes(clubSearch.toLowerCase()));

  const NAV = [
    { key: "overview", icon: <BarChart3 size={18} />, label: "Overview" },
    { key: "clubs", icon: <BookOpen size={18} />, label: "Club Directory" },
    { key: "applications", icon: <ClipboardList size={18} />, label: "Applications" },
  ];

  return (
    <>
      <style>{CSS}</style>
      {toast && <div style={{ position: "fixed", bottom: "32px", right: "32px", zIndex: 9999, background: "linear-gradient(135deg, #FFD700, #d4af37)", color: "#0A0A0A", borderRadius: "12px", padding: "16px 24px", fontWeight: 800, fontSize: "14px", boxShadow: "0 12px 40px rgba(255,215,0,.4)", animation: "fadeUp .4s cubic-bezier(0.175, 0.885, 0.32, 1.275)" }}>✅ {toast}</div>}
      {confirm && <ConfirmModal message={confirm.message} onConfirm={confirm.onConfirm} onCancel={() => setConfirm(null)} />}
      {(clubModal !== undefined && clubModal !== false) && <ClubModal club={clubModal || null} onClose={() => setClubModal(false)} onSave={() => { setClubModal(false); showToast("Club profile saved successfully!"); loadAll(); }} />}

      <div className="adm-layout">
        <aside className="adm-sidebar">
          <div style={{ padding: "24px", borderBottom: "1px solid rgba(255,255,255,.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "36px", height: "36px", background: "linear-gradient(135deg, #FFD700, #d4af37)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 4px 15px rgba(255,215,0,0.3)" }}>
                <Shield size={18} color="#050A18" />
              </div>
              <div style={{ overflow: "hidden" }}>
                <div style={{ fontSize: "15px", fontWeight: 900, color: "#fff", whiteSpace: "nowrap", letterSpacing: "-0.5px" }}>Commander</div>
                <div style={{ fontSize: "11px", color: "rgba(255,215,0,0.8)", fontWeight: 700, letterSpacing: "0.5px" }}>UNIMATE ADMIN</div>
              </div>
            </div>
          </div>
          <nav style={{ padding: "20px 16px", flex: 1 }}>
            {NAV.map(n => (
              <button key={n.key} className={`nav-item${activeTab === n.key ? " active" : ""}`} onClick={() => setActiveTab(n.key)}>
                {n.icon} <span>{n.label}</span>
              </button>
            ))}
          </nav>
          <div style={{ padding: "20px 16px", borderTop: "1px solid rgba(255,255,255,.06)" }}>
            <button className="nav-item" onClick={() => { clearSession(); navigate("/clubs/auth"); }} style={{ color: "#f87171" }}>
              <LogOut size={18} /> <span>Secure Logout</span>
            </button>
          </div>
        </aside>

        <main className="adm-main">
          <header className="adm-header">
            <h1 style={{ fontSize: "20px", fontWeight: 900, color: "#fff", letterSpacing: "-0.5px" }}>
              {activeTab === "overview" ? "System Overview" : activeTab === "clubs" ? "Club Directory" : "Application Review Center"}
            </h1>
            <div style={{ display: "flex", gap: "12px" }}>
              <button className="ad-btn sec" onClick={loadAll}>
                <RefreshCw size={14} className={loading?"animate-spin":""} /> Sync Data
              </button>
              {activeTab === "clubs" && (
                <button className="ad-btn" onClick={() => setClubModal({})}>
                  <Plus size={16} /> Register Club
                </button>
              )}
            </div>
          </header>

          <div style={{ padding: "32px", flex: 1, maxWidth: "1400px", margin: "0 auto", width: "100%" }}>

            {/* OVERVIEW */}
            {activeTab === "overview" && (
              <div style={{ animation: "fadeUp .5s ease both" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "24px", marginBottom: "40px" }}>
                  {stats && [
                    { label: "Total Active Clubs", value: stats.totalClubs, color: "#FFD700", icon: <BookOpen size={20} /> },
                    { label: "Submitted Applications", value: stats.totalApplications, color: "#60a5fa", icon: <ClipboardList size={20} /> },
                    { label: "Registered Students", value: stats.totalMembers, color: "#4ade80", icon: <Users size={20} /> },
                    { label: "Pending Reviews", value: stats.pendingCount, color: "#f87171", icon: <AlertTriangle size={20} /> },
                  ].map((s, i) => (
                    <div key={s.label} className="stat-card" style={{ animation: `fadeUp .5s ease ${i*0.1}s both` }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                        <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: `${s.color}15`, display: "flex", alignItems: "center", justifyContent: "center", color: s.color }}>{s.icon}</div>
                        <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: s.color, boxShadow: `0 0 12px ${s.color}` }} />
                      </div>
                      <div style={{ fontSize: "36px", fontWeight: 900, color: "#fff", lineHeight: 1, marginBottom: "8px" }}>{s.value}</div>
                      <div style={{ fontSize: "12px", color: "rgba(255,255,255,.5)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>{s.label}</div>
                    </div>
                  ))}
                </div>

                <div className="ad-table-wrapper" style={{ animation: "fadeUp .6s ease .3s both" }}>
                  <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#fff" }}>Recent Application Activity</h3>
                    <button className="ad-btn sec" style={{ padding: "8px 16px" }} onClick={() => setActiveTab("applications")}>View Ledger</button>
                  </div>
                  <div style={{ overflowX: "auto" }}>
                    <table className="ad-table" style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead><tr><th>Applicant Profile</th><th>Target Club</th><th>Nominated Role</th><th>Current Status</th><th>Submission Date</th></tr></thead>
                      <tbody>
                        {applications.slice(0, 7).map(a => (
                          <tr key={a._id}>
                            <td>
                              <div style={{ fontWeight: 700, color: "#fff", marginBottom: "2px" }}>{a.studentName}</div>
                              <div style={{ fontSize: "11px", color: "rgba(255,255,255,.4)", fontWeight: 600 }}>{a.studentIdNumber}</div>
                            </td>
                            <td style={{ fontWeight: 600 }}>{a.clubId?.name}</td>
                            <td><span style={{ background: "rgba(255,255,255,0.05)", padding: "4px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: 600 }}>{a.preferredRole}</span></td>
                            <td><span className={`status-badge ${a.status}`}>{a.status}</span></td>
                            <td style={{ fontSize: "12px", color: "rgba(255,255,255,.5)", fontWeight: 500 }}>{new Date(a.submittedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {applications.length === 0 && <div style={{ textAlign: "center", padding: "60px", color: "rgba(255,255,255,.4)", fontSize: "14px", fontWeight: 600 }}>No applications recorded in the system.</div>}
                  </div>
                </div>
              </div>
            )}

            {/* CLUBS */}
            {activeTab === "clubs" && (
              <div style={{ animation: "fadeUp .5s ease both" }}>
                <div className="search-bar" style={{ maxWidth: "400px", marginBottom: "24px" }}>
                  <Search size={16} color="rgba(255,215,0,0.6)" />
                  <input placeholder="Search clubs by name..." value={clubSearch} onChange={e => setClubSearch(e.target.value)} />
                </div>
                <div className="ad-table-wrapper">
                  <div style={{ overflowX: "auto" }}>
                    <table className="ad-table" style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead><tr><th>Club Entity</th><th>Classification</th><th>AI Matching Tags</th><th>Established</th><th>Actions</th></tr></thead>
                      <tbody>
                        {filteredClubs.map(c => (
                          <tr key={c._id}>
                            <td style={{ fontWeight: 800, color: "#fff", fontSize: "14px" }}>{c.name}</td>
                            <td><span style={{ background: "rgba(255,215,0,.1)", border: "1px solid rgba(255,215,0,.2)", borderRadius: "100px", padding: "4px 12px", fontSize: "11px", fontWeight: 800, color: "#FFD700", textTransform: "uppercase", letterSpacing: "0.5px" }}>{c.category}</span></td>
                            <td>
                              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                                {c.tags.slice(0, 3).map(t => <span key={t} style={{ fontSize: "11px", background: "rgba(255,255,255,.05)", borderRadius: "6px", padding: "4px 8px", color: "rgba(255,255,255,.6)", fontWeight: 600 }}>{t}</span>)}
                                {c.tags.length > 3 && <span style={{ fontSize: "11px", color: "rgba(255,215,0,.8)", fontWeight: 800, border: "1px dashed rgba(255,215,0,.3)", padding: "4px 8px", borderRadius: "6px" }}>+{c.tags.length - 3}</span>}
                              </div>
                            </td>
                            <td style={{ fontSize: "12px", color: "rgba(255,255,255,.5)", fontWeight: 500 }}>{new Date(c.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td>
                            <td>
                              <div style={{ display: "flex", gap: "8px" }}>
                                <button className="ad-btn sec" style={{ padding: "8px 12px", fontSize: "12px" }} onClick={() => setClubModal(c)}><Pencil size={14} /> Profile</button>
                                <button className="ad-btn danger" style={{ padding: "8px 12px", fontSize: "12px" }} onClick={() => handleDeleteClub(c._id)}><Trash2 size={14} /> Demolish</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {filteredClubs.length === 0 && <div style={{ textAlign: "center", padding: "60px", color: "rgba(255,255,255,.4)", fontSize: "14px", fontWeight: 600 }}>No clubs match your query.</div>}
                  </div>
                </div>
              </div>
            )}

            {/* APPLICATIONS */}
            {activeTab === "applications" && (
              <div style={{ animation: "fadeUp .5s ease both" }}>
                <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginBottom: "24px" }}>
                  <select className="search-bar" style={{ cursor: "pointer", appearance: "none", paddingRight: "32px", minWidth: "160px" }} value={appFilter.status} onChange={e => setAppFilter(p => ({ ...p, status: e.target.value }))}>
                    <option value="">All Statuses</option>
                    <option value="Pending">Pending Review</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                  <select className="search-bar" style={{ cursor: "pointer", appearance: "none", paddingRight: "32px", minWidth: "200px" }} value={appFilter.clubId} onChange={e => setAppFilter(p => ({ ...p, clubId: e.target.value }))}>
                    <option value="">All Clubs</option>
                    {clubs.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                  <button className="ad-btn sec" onClick={() => setAppFilter({ status: "", clubId: "" })}>
                    <X size={14} /> Reset
                  </button>
                  <div style={{ flex: 1 }} />
                  <span style={{ fontSize: "13px", color: "rgba(255,215,0,.8)", display: "flex", alignItems: "center", fontWeight: 700, background: "rgba(255,215,0,.1)", padding: "0 16px", borderRadius: "12px" }}>{filteredApps.length} Application{filteredApps.length !== 1 ? "s" : ""} Found</span>
                </div>

                <div className="ad-table-wrapper">
                  <div style={{ overflowX: "auto" }}>
                    <table className="ad-table" style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr><th>Applicant</th><th>Target Club</th><th>Role Requested</th><th>Statement of Purpose</th><th>Status</th><th>Submitted</th><th>Action Required</th></tr>
                      </thead>
                      <tbody>
                        {filteredApps.map(a => (
                          <tr key={a._id} style={{ opacity: a.status === "Pending" ? 1 : 0.7 }}>
                            <td>
                              <div style={{ fontWeight: 800, color: "#fff", marginBottom: "2px" }}>{a.studentName}</div>
                              <div style={{ fontSize: "11px", color: "rgba(255,255,255,.4)", fontWeight: 600 }}>{a.studentIdNumber}</div>
                            </td>
                            <td style={{ fontWeight: 700 }}>{a.clubId?.name}</td>
                            <td><span style={{ background: "rgba(255,255,255,0.05)", padding: "4px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: 600 }}>{a.preferredRole}</span></td>
                            <td style={{ maxWidth: "240px" }}>
                              <p title={a.reason} style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontStyle: "italic", fontSize: "13px", color: "rgba(255,255,255,.55)" }}>"{a.reason}"</p>
                            </td>
                            <td><span className={`status-badge ${a.status}`}>{a.status}</span></td>
                            <td style={{ fontSize: "12px", color: "rgba(255,255,255,.5)", fontWeight: 500 }}>{new Date(a.submittedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td>
                            <td>
                              <div style={{ display: "flex", gap: "8px" }}>
                                {a.status !== "Approved" && (
                                  <button className="ad-btn approve" style={{ padding: "8px 12px" }} onClick={() => handleAppStatus(a._id, "Approved")}>
                                    <Check size={14} /> Approve
                                  </button>
                                )}
                                {a.status !== "Rejected" && (
                                  <button className="ad-btn danger" style={{ padding: "8px 12px" }} onClick={() => handleAppStatus(a._id, "Rejected")}>
                                    <X size={14} /> Reject
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {filteredApps.length === 0 && <div style={{ textAlign: "center", padding: "80px", color: "rgba(255,255,255,.4)", fontSize: "15px", fontWeight: 600 }}>No applications match your criteria.</div>}
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
