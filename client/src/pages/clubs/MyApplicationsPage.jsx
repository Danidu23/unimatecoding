import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, CheckCircle, ClipboardList, Clock, RefreshCw, Sparkles, XCircle } from "lucide-react";
import { applicationsAPI, getSession } from "../../api/clubsApi";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
  *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
  body{font-family:'Inter',sans-serif;background:#050A18;color:#fff;overflow-x:hidden;}
  
  .ma-layout{min-height:100vh;background:#050A18;background:radial-gradient(circle at top right, rgba(255,215,0,0.03), transparent 40%), radial-gradient(circle at bottom left, rgba(255,215,0,0.02), transparent 40%);}
  
  .ma-nav{
    position:sticky;top:0;z-index:100;background:rgba(5,10,24,0.92);backdrop-filter:blur(24px);
    border-bottom:1px solid rgba(255,255,255,0.07);display:grid;
    grid-template-columns:1fr auto 1fr;
    align-items:center;padding:0 32px;height:68px;
  }
  .nav-left{display:flex;align-items:center;}
  .nav-center{display:flex;align-items:center;justify-content:center;gap:10px;}
  .nav-center-icon{
    width:32px;height:32px;background:linear-gradient(135deg,#FFD700,#b8860b);
    border-radius:9px;display:flex;align-items:center;justify-content:center;
    box-shadow:0 0 16px rgba(255,215,0,0.35);
  }
  .nav-center-title{font-size:15px;font-weight:800;color:#fff;letter-spacing:-0.3px;}
  .nav-right{display:flex;align-items:center;justify-content:flex-end;gap:10px;}
  .nav-btn{
    display:flex;align-items:center;gap:8px;color:rgba(255,255,255,0.6);
    font-size:13px;font-weight:600;padding:9px 16px;border-radius:11px;
    background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.07);
    transition:all 0.25s;cursor:pointer;
  }
  .nav-btn:hover{background:rgba(255,215,0,0.1);color:#FFD700;border-color:rgba(255,215,0,0.25);transform:translateY(-1px);}

  .ma-container{max-width:1000px;margin:0 auto;padding:52px 40px 100px;}
  
  .page-header{margin-bottom:48px;text-align:center;}
  .page-header-badge{
    display:inline-flex;align-items:center;gap:7px;
    background:rgba(255,215,0,0.07);border:1px solid rgba(255,215,0,0.2);
    border-radius:100px;padding:6px 16px;font-size:11px;font-weight:800;
    color:#FFD700;letter-spacing:0.6px;text-transform:uppercase;
    margin-bottom:20px;
  }
  .page-title{
    font-size:46px;font-weight:900;letter-spacing:-1.5px;margin-bottom:14px;
    color:#fff;line-height:1.1;
  }
  .page-title span{color:#FFD700;}
  .page-subtitle{font-size:15px;color:rgba(255,255,255,0.4);max-width:520px;margin:0 auto;line-height:1.7;}

  .stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:20px;margin-bottom:48px;}
  .stats-card{
    background:rgba(14,21,40,0.4);backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,0.08);
    border-radius:24px;padding:24px;text-align:center;transition:all 0.3s;
  }
  .stats-card:hover{transform:translateY(-5px);border-color:rgba(255,215,0,0.2);box-shadow:0 10px 30px rgba(0,0,0,0.2);}
  .stats-value{font-size:32px;font-weight:900;margin-bottom:4px;font-family:inherit;}
  .stats-label{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:rgba(255,255,255,0.4);}

  .app-list{display:flex;flex-direction:column;gap:20px;}
  .updates-card{
    background:rgba(14,21,40,0.6);backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,0.1);
    border-radius:24px;padding:24px;margin-bottom:28px;
  }
  .update-item{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:14px 0;border-bottom:1px solid rgba(255,255,255,0.06);}
  .update-item:last-child{border-bottom:none;}
  .update-title{font-size:14px;font-weight:700;color:#fff;margin-bottom:4px;}
  .update-sub{font-size:12px;color:rgba(255,255,255,0.45);}
  .updates-toggle{margin-left:auto;display:flex;align-items:center;gap:6px;font-size:12px;font-weight:700;color:rgba(255,255,255,0.6);background:none;border:none;cursor:pointer;}
  .updates-toggle:hover{color:#FFD700;}
  .app-card-glass{
    background:rgba(14,21,40,0.6);backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,0.1);
    border-radius:28px;padding:32px;transition:all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    position:relative;overflow:hidden;
  }
  .app-card-glass:hover{
    border-color:rgba(255,215,0,0.3);transform:scale(1.01);
    box-shadow:0 20px 40px rgba(0,0,0,0.3);
  }
  .app-card-glass::before{
    content:'';position:absolute;top:0;left:0;width:4px;height:100%;
    background:var(--status-color);opacity:0.8;
  }

  .app-card-header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:24px;}
  .club-info-box{display:flex;gap:16px;align-items:center;}
  .club-avatar-placeholder{
    width:52px;height:52px;border-radius:16px;background:rgba(255,215,0,0.1);
    display:flex;align-items:center;justify-content:center;color:#FFD700;border:1px solid rgba(255,215,0,0.2);
  }
  .club-name-text{font-size:20px;font-weight:800;color:#fff;margin-bottom:4px;}
  .club-cat-badge{font-size:11px;font-weight:700;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:0.5px;}

  .status-badge-premium{
    display:flex;align-items:center;gap:8px;padding:8px 16px;border-radius:100px;
    font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:0.5px;
    background:var(--status-bg);color:var(--status-color);border:1px solid var(--status-border);
  }

  .app-details-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:24px;}
  .detail-item{background:rgba(255,255,255,0.03);padding:14px 18px;border-radius:16px;border:1px solid rgba(255,255,255,0.05);}
  .detail-label{font-size:10px;font-weight:800;color:rgba(255,255,255,0.3);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px;}
  .detail-value{font-size:14px;font-weight:600;color:rgba(255,255,255,0.9);}

  .reason-box{
    background:rgba(255,255,255,0.03);padding:20px;border-radius:20px;
    border:1px solid rgba(255,255,255,0.05);margin-bottom:20px;
  }
  .reason-text{font-size:14px;color:rgba(255,255,255,0.6);line-height:1.7;font-style:italic;}

  .timeline{display:flex;align-items:center;gap:12px;margin-bottom:24px;flex-wrap:wrap;}
  .timeline-step{display:flex;flex-direction:column;align-items:center;gap:6px;min-width:90px;}
  .timeline-dot{width:12px;height:12px;border-radius:50%;background:rgba(255,255,255,0.2);border:2px solid rgba(255,255,255,0.15);}
  .timeline-step.active .timeline-dot{background:#FFD700;border-color:#FFD700;box-shadow:0 0 12px rgba(255,215,0,0.4);} 
  .timeline-step.done .timeline-dot{background:#4ade80;border-color:#4ade80;}
  .timeline-label{font-size:11px;font-weight:800;color:rgba(255,255,255,0.5);text-transform:uppercase;letter-spacing:0.5px;text-align:center;}
  .timeline-step.active .timeline-label{color:#FFD700;}
  .timeline-step.done .timeline-label{color:rgba(255,255,255,0.85);} 
  .timeline-time{font-size:10px;color:rgba(255,255,255,0.35);text-align:center;}
  .timeline-line{flex:1;height:2px;background:rgba(255,255,255,0.12);min-width:30px;}
  .timeline-line.done{background:#4ade80;}

  .congrats-banner{
    display:flex;align-items:center;gap:12px;padding:16px 24px;border-radius:16px;
    background:rgba(34,197,94,0.1);border:1px solid rgba(34,197,94,0.2);
    color:#4ade80;font-size:13px;font-weight:700;animation:pulse 2s infinite;
  }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.7} }

  .empty-state{
    text-align:center;padding:100px 40px;background:rgba(14,21,40,0.4);
    backdrop-filter:blur(20px);border:1px dashed rgba(255,255,255,0.1);
    border-radius:40px;max-width:600px;margin:40px auto;
  }
  .explore-btn-gold{
    display:inline-flex;align-items:center;gap:10px;background:#FFD700;color:#050A18;
    padding:16px 32px;border-radius:16px;font-size:16px;font-weight:800;
    margin-top:24px;box-shadow:0 10px 30px rgba(255,215,0,0.2);transition:all 0.3s;
  }
  .explore-btn-gold:hover{transform:translateY(-3px) scale(1.02);box-shadow:0 15px 40px rgba(255,215,0,0.3);}

  @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
  .animate-fade-up{animation:fadeUp 0.6s ease-out both;}
`;

const STATUS_CONFIG = {
  Pending: { color: "#FFD700", bg: "rgba(255,215,0,0.1)", border: "rgba(255,215,0,0.2)", icon: <Clock size={16}/>, label: "Pending" },
  Interview: { color: "#60a5fa", bg: "rgba(96,165,250,0.1)", border: "rgba(96,165,250,0.2)", icon: <Clock size={16}/>, label: "Interview" },
  Approved: { color: "#4ade80", bg: "rgba(74,222,128,0.1)", border: "rgba(74,222,128,0.2)", icon: <CheckCircle size={16}/>, label: "Approved" },
  Rejected: { color: "#f87171", bg: "rgba(248,113,113,0.1)", border: "rgba(248,113,113,0.2)", icon: <XCircle size={16}/>, label: "Rejected" },
};

export default function MyApplicationsPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastSeenAt, setLastSeenAt] = useState(0);
  const [updatesOpen, setUpdatesOpen] = useState(false);

  useEffect(() => {
    const currentSession = getSession();

    if (!currentSession) {
      navigate("/login");
      return;
    }

    const prevSeen = Number(localStorage.getItem("clubsNotificationsSeenAt") || 0);
    setLastSeenAt(prevSeen);
    setUpdatesOpen(!!location.state?.openUpdates);
    fetchApps();
    localStorage.setItem("clubsNotificationsSeenAt", String(Date.now()));
  }, [navigate, location.state]);

  const fetchApps = async () => {
    setLoading(true);
    try {
      const res = await applicationsAPI.getMy();
      setApps(Array.isArray(res.data) ? res.data : []);
    } catch { setApps([]); }
    finally { setLoading(false); }
  };

  const stats = {
    total: apps.length,
    pending: apps.filter(a => a.status === "Pending" || a.status === "Interview").length,
    approved: apps.filter(a => a.status === "Approved").length,
    rejected: apps.filter(a => a.status === "Rejected").length,
  };

  const formatShortDate = (value) => {
    if (!value) return "";
    return new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const getTimelineSteps = (app) => {
    const finalLabel = app.status === "Rejected" ? "Rejected" : "Accepted";
    const activeIndex = app.status === "Pending" ? 1 : app.status === "Interview" ? 2 : 3;
    return {
      activeIndex,
      steps: [
        { label: "Submitted", time: app.submittedAt },
        { label: "Under Review", time: app.submittedAt },
        { label: "Interview Scheduled", time: app.interviewAt },
        { label: finalLabel, time: app.reviewedAt },
      ]
    };
  };

  const updates = apps
    .filter(a => a.status !== "Pending")
    .map(a => {
      const time = a.reviewedAt || a.interviewAt || a.submittedAt;
      return { app: a, time: time ? new Date(time).getTime() : 0 };
    })
    .filter(u => u.time > lastSeenAt)
    .sort((a, b) => b.time - a.time);

  useEffect(() => {
    if (location.state?.openUpdates) {
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  return (
    <div className="ma-layout">
      <style>{CSS}</style>
      <nav className="ma-nav">
        <div className="nav-left">
          <button className="nav-btn" onClick={() => navigate("/clubs")}>
            <ArrowLeft size={15} /> Dashboard
          </button>
        </div>
        <div className="nav-center">
          <div className="nav-center-icon">
            <ClipboardList size={17} color="#050A18" />
          </div>
          <span className="nav-center-title">My Applications</span>
        </div>
        <div className="nav-right">
          <button className="nav-btn" onClick={fetchApps}>
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
            Sync
          </button>
        </div>
      </nav>

      <div className="ma-container">
        <header className="page-header animate-fade-up">
          <div className="page-header-badge">
            <ClipboardList size={11} />
            Application Tracker
          </div>
          <h1 className="page-title">My <span>Applications</span></h1>
          <p className="page-subtitle">Elevate your campus experience. Track your journey with SLIIT's most prestigious clubs and societies.</p>
        </header>

        <div className="stats-grid">
          {[
            { label: "Total Submissions", value: stats.total, color: "#fff", icon: <ClipboardList size={20}/> },
            { label: "Pending Review", value: stats.pending, color: "#FFD700", icon: <Clock size={20}/> },
            { label: "Approved Access", value: stats.approved, color: "#4ade80", icon: <CheckCircle size={20}/> },
            { label: "Not Selected", value: stats.rejected, color: "#f87171", icon: <XCircle size={20}/> },
          ].map((s, i) => (
            <div key={s.label} className="stats-card animate-fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
              <div style={{ color: s.color, marginBottom: "12px", display: "flex", justifyContent: "center" }}>{s.icon}</div>
              <div className="stats-value" style={{ color: s.color }}>{s.value}</div>
              <div className="stats-label">{s.label}</div>
            </div>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "100px 0" }}>
            <div style={{ width: "40px", height: "40px", border: "3px solid rgba(255,215,0,0.1)", borderTopColor: "#FFD700", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 20px" }} />
            <p style={{ color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>Retrieving your records...</p>
          </div>
        ) : apps.length === 0 ? (
          <div className="empty-state animate-fade-up">
            <div style={{ background: "rgba(255,215,0,0.1)", width: "80px", height: "80px", borderRadius: "30px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
              <ClipboardList size={40} color="#FFD700" />
            </div>
            <h2 style={{ fontSize: "24px", fontWeight: 900, marginBottom: "12px" }}>No Active Applications</h2>
            <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}>Your journey is just beginning. Explore our diverse range of clubs and find the one that fits your passion.</p>
            <button className="explore-btn-gold" onClick={() => navigate("/clubs")}>
              Explore Clubs <ArrowLeft size={18} style={{ transform: "rotate(180deg)" }} />
            </button>
          </div>
        ) : (
          <div className="app-list">
            <div className="updates-card">
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                <ClipboardList size={16} color="#FFD700" />
                <div style={{ fontSize: "15px", fontWeight: 800 }}>Recent Updates</div>
                <button className="updates-toggle" onClick={() => setUpdatesOpen(o => !o)}>
                  {updatesOpen ? "Hide" : "Show"}
                </button>
              </div>
              {updatesOpen && (updates.length === 0 ? (
                <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px" }}>
                  No new updates since your last visit.
                </div>
              ) : (
                updates.map(({ app, time }) => (
                  <div key={`${app._id}-${time}`} className="update-item">
                    <div>
                      <div className="update-title">{app.clubId?.name} — {app.status}</div>
                      <div className="update-sub">{(app.preferredRole || "Role not specified")} · {new Date(time).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</div>
                    </div>
                    <div className="status-badge-premium" style={{ "--status-color": STATUS_CONFIG[app.status]?.color, "--status-bg": STATUS_CONFIG[app.status]?.bg, "--status-border": STATUS_CONFIG[app.status]?.border }}>
                      {STATUS_CONFIG[app.status]?.icon} {STATUS_CONFIG[app.status]?.label}
                    </div>
                  </div>
                ))
              ))}
            </div>
            {apps.map((app, i) => {
              const cfg = STATUS_CONFIG[app.status] || STATUS_CONFIG.Pending;
              return (
                <div 
                  key={app._id} 
                  className="app-card-glass animate-fade-up" 
                  style={{ 
                    animationDelay: `${(i + 4) * 0.1}s`,
                    "--status-color": cfg.color,
                    "--status-bg": cfg.bg,
                    "--status-border": cfg.border
                  }}
                >
                  <div className="app-card-header">
                    <div className="club-info-box">
                      <div className="club-avatar-placeholder">
                        <Sparkles size={24} />
                      </div>
                      <div>
                        <h3 className="club-name-text">{app.clubId?.name || "Premium Club"}</h3>
                        <span className="club-cat-badge">{app.clubId?.category || "University Society"}</span>
                      </div>
                    </div>
                    <div className="status-badge-premium">
                      {cfg.icon} {cfg.label}
                    </div>
                  </div>

                  <div className="app-details-grid">
                    {[
                      { label: "Nominated Role", value: app.preferredRole },
                      { label: "Application Date", value: new Date(app.submittedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) },
                      { label: "Last Updated", value: app.reviewedAt ? new Date(app.reviewedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : app.interviewAt ? new Date(app.interviewAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "In Review" },
                    ].map(f => (
                      <div key={f.label} className="detail-item">
                        <div className="detail-label">{f.label}</div>
                        <div className="detail-value">{f.value}</div>
                      </div>
                    ))}
                  </div>

                  {(() => {
                    const timeline = getTimelineSteps(app);
                    return (
                      <div className="timeline">
                        {timeline.steps.map((step, idx) => (
                          <div key={step.label} style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1 }}>
                            <div className={`timeline-step ${idx < timeline.activeIndex ? "done" : ""} ${idx === timeline.activeIndex ? "active" : ""}`}>
                              <div className="timeline-dot" />
                              <div className="timeline-label">{step.label}</div>
                              {step.time && <div className="timeline-time">{formatShortDate(step.time)}</div>}
                            </div>
                            {idx < timeline.steps.length - 1 && (
                              <div className={`timeline-line ${idx < timeline.activeIndex ? "done" : ""}`} />
                            )}
                          </div>
                        ))}
                      </div>
                    );
                  })()}

                  <div className="reason-box">
                    <div className="detail-label" style={{ marginBottom: "8px" }}>Statement of Purpose</div>
                    <p className="reason-text">"{app.reason || "No statement provided."}"</p>
                  </div>

                  {app.status === "Approved" && (
                    <div className="congrats-banner">
                      <CheckCircle size={18} />
                      Congratulations! Your membership has been ratified. Welcome to the {app.clubId?.name}.
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .animate-spin { animation: spin 1s linear infinite; }
      `}</style>
    </div>
  );
}
