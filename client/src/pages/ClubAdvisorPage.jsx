import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Bot, Check, Star, ChevronRight, Loader } from "lucide-react";
import { recommendationsAPI, applicationsAPI, getSession } from "../api/clubsApi";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
  *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
  html,body,#root{width:100%;min-height:100vh;}
  body{font-family:'Inter',system-ui,sans-serif;background:#050A18;color:#fff;}
  button{font-family:inherit;cursor:pointer;border:none;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes popIn{from{transform:scale(.8);opacity:0}to{transform:scale(1);opacity:1}}

  .adv-nav{
    position:sticky;top:0;z-index:100;
    background:rgba(5,10,24,.9);backdrop-filter:blur(16px);
    border-bottom:1px solid rgba(255,215,0,.1);
    display:flex;align-items:center;justify-content:space-between;
    padding:0 clamp(16px,4vw,48px);height:60px;
  }
  .back-btn{
    display:flex;align-items:center;gap:6px;
    background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);
    border-radius:10px;padding:8px 14px;color:rgba(255,255,255,.7);font-size:12px;font-weight:600;
    transition:all .2s;
  }
  .back-btn:hover{border-color:rgba(255,215,0,.4);color:#FFD700;background:rgba(255,215,0,.07);}

  /* Stepper Styles */
  .stepper-container{display:flex;align-items:center;justify-content:center;gap:0;margin-bottom:40px;position:relative;}
  .step-node{display:flex;flex-direction:column;align-items:center;z-index:2;width:80px;position:relative;}
  .step-circle{
    width:36px;height:36px;border-radius:50%;border:2px solid rgba(255,255,255,.15);
    background:#050A18;color:rgba(255,255,255,.4);display:flex;align-items:center;justify-content:center;
    font-size:14px;font-weight:800;transition:all .3s;margin-bottom:10px;
  }
  .step-circle.active{background:transparent;border-color:#FFD700;color:#FFD700;box-shadow:0 0 15px rgba(255,215,0,0.3);}
  .step-circle.completed{background:#FFD700;border-color:#FFD700;color:#050A18;}
  .step-label{font-size:11px;font-weight:700;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:.5px;transition:all .3s;}
  .step-node.active .step-label{color:#FFD700;}
  .step-node.completed .step-label{color:rgba(255,255,255,0.8);}
  .step-line{flex:1;height:2px;background:rgba(255,255,255,.1);margin:0 -20px 22px;z-index:1;transition:all .3s;}
  .step-line.active{background:#FFD700;}

  /* Card and Tile Styles */
  .quiz-card{
    background:#0E1528;border:1px solid rgba(255,255,255,.08);
    border-radius:24px;padding:48px;box-shadow:0 20px 60px rgba(0,0,0,.4);
    position:relative;animation:fadeUp .6s ease both;
  }
  .tile-grid{display:grid;grid-template-columns:repeat(2, 1fr);gap:16px;}
  .option-tile{
    background:rgba(255,255,255,.03);border:1.5px solid rgba(255,255,255,.08);
    border-radius:14px;padding:22px 24px;color:rgba(255,255,255,.7);text-align:left;
    font-size:14px;font-weight:600;transition:all .2s;display:flex;align-items:center;justify-content:space-between;
  }
  .option-tile:hover{background:rgba(255,255,255,.05);border-color:rgba(255,215,0,.3);color:#fff;}
  .option-tile.selected{background:rgba(255,215,0,.08);border-color:#FFD700;color:#fff;}
  .option-tile .check-circle{width:18px;height:18px;border-radius:50%;border:1.5px solid rgba(255,255,255,.2);display:flex;align-items:center;justify-content:center;}
  .option-tile.selected .check-circle{background:#FFD700;border-color:#FFD700;}

  .next-btn-gold{
    background:#FFD700;color:#050A18;border-radius:12px;padding:12px 36px;
    font-size:14px;font-weight:800;transition:all .25s;box-shadow:0 8px 24px rgba(255,215,0,0.25);
    margin-top:40px;margin-left:auto;display:flex;align-items:center;gap:8px;
  }
  .next-btn-gold:hover{background:#ffe629;transform:translateY(-2px);box-shadow:0 12px 32px rgba(255,215,0,0.4);}
  .next-btn-gold:disabled{opacity:.4;cursor:not-allowed;transform:none;}

  .modal-bg{position:fixed;inset:0;background:rgba(0,0,0,.8);z-index:600;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(10px);animation:fadeIn .25s;padding:20px;}
  .modal{background:#0E1528;border:1.5px solid rgba(255,215,0,.2);border-radius:20px;max-width:440px;width:100%;animation:popIn .3s cubic-bezier(.22,.68,0,1.2);overflow:hidden;}
  .form-input{width:100%;background:rgba(255,255,255,.06);border:1.5px solid rgba(255,255,255,.1);border-radius:10px;padding:11px 14px;color:#fff;font-size:14px;font-family:'Inter',sans-serif;outline:none;transition:border-color .22s;}
  .form-input:focus{border-color:rgba(255,215,0,.5);}
  .form-input::placeholder{color:rgba(255,255,255,.3);}
  .form-label{font-size:11px;font-weight:700;color:rgba(255,255,255,.5);letter-spacing:.5px;text-transform:uppercase;margin-bottom:6px;display:block;}

  @media(max-width:640px){
    .tile-grid{grid-template-columns:1fr;}
    .quiz-card{padding:24px;}
  }
`;

const STEPS = [
  {
    id: "skills", title: "Select skills to develop", subtitle: "Choose areas you want to improve during your university life.",
    options: ["Leadership", "Programming", "Communication", "Networking", "Volunteering", "Entrepreneurship"]
  },
  {
    id: "activities", title: "Select interests", subtitle: "What type of activities interest you most?",
    options: ["Creative Projects", "Technical Projects", "Sports & Fitness", "Community Service", "Workshops", "Competitions"]
  },
  {
    id: "commitment", title: "Time Commitment", subtitle: "How much time can you dedicate per week?",
    options: ["Low (1–2 hrs/week)", "Medium (3–5 hrs/week)", "High (6+ hrs/week)"]
  }
];

function ApplyFromRecommendation({ club, user, onClose, onSuccess }) {
  const ROLES = ["Member", "Organizer", "Leader", "Treasurer", "Secretary"];
  const [form, setForm] = useState({ studentName: user?.name || "", studentIdNumber: user?.studentId || "", preferredRole: "", reason: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
      onSuccess(`Applied to ${club.name}! Our committee will review your request. 🎉`);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Submission failed. Please try again.");
    } finally { setLoading(false); }
  };

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div style={{ padding: "18px 22px", borderBottom: "1px solid rgba(255,255,255,.07)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div><div style={{ fontSize: "11px", color: "#FFD700", fontWeight: 700, marginBottom: "3px" }}>APPLY NOW</div><h3 style={{ fontSize: "16px", fontWeight: 800, color: "#fff" }}>{club.name}</h3></div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,.07)", border: "none", color: "#fff", width: "30px", height: "30px", borderRadius: "7px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: "18px" }}>×</button>
        </div>
        <div style={{ padding: "18px 22px 22px" }}>
          {error && <div style={{ background: "rgba(239,68,68,.08)", border: "1px solid rgba(239,68,68,.2)", borderRadius: "8px", padding: "8px 12px", marginBottom: "12px", fontSize: "12px", color: "#f87171" }}>{error}</div>}
          <form onSubmit={handleSubmit}>
            {[{ label: "Full Name", key: "studentName", ph: "Your full name" }, { label: "Student ID", key: "studentIdNumber", ph: "e.g. IT2324616" }].map(f => (
              <div key={f.key} style={{ marginBottom: "10px" }}>
                <label className="form-label">{f.label}</label>
                <input className="form-input" placeholder={f.ph} value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} />
              </div>
            ))}
            <div style={{ marginBottom: "10px" }}>
              <label className="form-label">Preferred Role</label>
              <select className="form-input" value={form.preferredRole} onChange={e => setForm(p => ({ ...p, preferredRole: e.target.value }))}>
                <option value="">-- Select a role --</option>
                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: "14px" }}>
              <label className="form-label">Reason for Joining <span style={{ color: "rgba(255,255,255,.3)", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>({form.reason.length}/50 min)</span></label>
              <textarea className="form-input" rows={3} placeholder="Why do you want to join? (min 50 chars)" value={form.reason} onChange={e => setForm(p => ({ ...p, reason: e.target.value }))} style={{ resize: "vertical" }} />
            </div>
            <button type="submit" style={{ width: "100%", background: "#FFD700", color: "#0A0A0A", border: "none", borderRadius: "10px", padding: "12px", fontSize: "14px", fontWeight: 700, cursor: "pointer", opacity: loading ? .6 : 1 }} disabled={loading}>
              {loading ? "Submitting..." : "Submit Application"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

const Stepper = ({ currentStep }) => {
  const steps = ["Skills", "Activities", "Commitment"];
  return (
    <div className="stepper-container">
      {steps.map((label, idx) => (
        <React.Fragment key={label}>
          <div className={`step-node ${idx === currentStep ? "active" : ""} ${idx < currentStep ? "completed" : ""}`}>
            <div className={`step-circle ${idx === currentStep ? "active" : ""} ${idx < currentStep ? "completed" : ""}`}>
              {idx < currentStep ? <Check size={18} /> : idx + 1}
            </div>
            <span className="step-label">{label}</span>
          </div>
          {idx < steps.length - 1 && (
            <div className={`step-line ${idx < currentStep ? "active" : ""}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default function ClubAdvisorPage() {
  const navigate = useNavigate();
  const session = getSession();
  const user = session?.user;

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({ skills: [], activities: [], commitment: "" });
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [done, setDone] = useState(false);
  const [applyClub, setApplyClub] = useState(null);
  const [toast, setToast] = useState("");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 4000); };

  const toggleMulti = (key, val) => {
    setAnswers(p => ({
      ...p,
      [key]: p[key].includes(val) ? p[key].filter(v => v !== val) : [...p[key], val]
    }));
  };

  const handleNext = async () => {
    if (step < 2) {
      setStep(s => s + 1);
    } else {
      setLoading(true);
      try {
        const res = await recommendationsAPI.get({
          skills: answers.skills,
          activities: answers.activities,
          commitment: answers.commitment.split(" ")[0].toLowerCase(),
        });
        setRecommendations(res.data.recommendations);
        setDone(true);
      } catch {
        setRecommendations([]);
        setDone(true);
      } finally {
        setLoading(false);
      }
    }
  };

  const canNext = () => {
    if (step === 0) return answers.skills.length > 0;
    if (step === 1) return answers.activities.length > 0;
    if (step === 2) return answers.commitment !== "";
    return false;
  };

  const currentStepData = STEPS[step];

  return (
    <>
      <style>{CSS}</style>
      {toast && <div style={{ position: "fixed", bottom: "24px", right: "24px", zIndex: 9999, background: "#FFD700", color: "#0A0A0A", borderRadius: "12px", padding: "14px 20px", fontWeight: 700, fontSize: "14px", boxShadow: "0 8px 32px rgba(255,215,0,.4)", animation: "fadeUp .3s ease" }}>✅ {toast}</div>}

      <nav className="adv-nav">
        <button className="back-btn" onClick={() => navigate("/clubs")}><ArrowLeft size={16} /> Back</button>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "rgba(255,255,255,.5)" }}>
          <Bot size={16} color="#FFD700" /> <span style={{ color: "#FFD700", fontWeight: 700 }}>Interest Quiz</span>
        </div>
      </nav>

      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "60px clamp(16px,4vw,48px) 100px" }}>
        
        <h1 style={{ fontSize: "32px", fontWeight: 900, color: "#fff", textAlign: "center", marginBottom: "40px", letterSpacing: "-0.5px" }}>Interest Questionnaire</h1>
        
        <Stepper currentStep={step} />

        <div className="quiz-card">
          {!done ? (
            <div key={step}>
              <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#fff", marginBottom: "8px" }}>{currentStepData.title}</h2>
              <p style={{ fontSize: "14px", color: "rgba(255,255,255,.5)", marginBottom: "32px" }}>{currentStepData.subtitle}</p>

              {step < 2 ? (
                <div className="tile-grid">
                  {currentStepData.options.map(opt => {
                    const selected = answers[currentStepData.id].includes(opt);
                    return (
                      <button key={opt} className={`option-tile ${selected ? "selected" : ""}`} onClick={() => toggleMulti(currentStepData.id, opt)}>
                        {opt}
                        <div className="check-circle">{selected && <Check size={12} strokeWidth={4} color="#050A18" />}</div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "12px" }}>
                  {currentStepData.options.map(opt => {
                    const selected = answers.commitment === opt;
                    return (
                      <button key={opt} className={`option-tile ${selected ? "selected" : ""}`} onClick={() => setAnswers(p => ({ ...p, commitment: opt }))}>
                        <span>{opt.startsWith("Low") ? "🌱 " : opt.startsWith("Medium") ? "⭐ " : "🔥 "}{opt}</span>
                        <div className="check-circle">{selected && <Check size={12} strokeWidth={4} color="#050A18" />}</div>
                      </button>
                    );
                  })}
                </div>
              )}

              <div style={{ display: "flex", alignItems: "center", marginTop: "40px" }}>
                {step > 0 && (
                  <button onClick={() => setStep(s => s - 1)} style={{ background: "transparent", color: "rgba(255,255,255,.5)", fontSize: "14px", fontWeight: 600 }}>Previous</button>
                )}
                <button className="next-btn-gold" onClick={handleNext} disabled={!canNext() || loading}>
                  {loading ? <Loader size={18} className="spin" /> : step === 2 ? "Get Recommendations" : "Next"}
                </button>
              </div>
            </div>
          ) : (
            <div style={{ animation: "fadeIn .5s ease" }}>
              <div style={{ textAlign: "center", marginBottom: "40px" }}>
                <div style={{ width: "56px", height: "56px", background: "rgba(255,215,0,.1)", border: "1.5px solid rgba(255,215,0,.2)", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                  <Bot size={28} color="#FFD700" />
                </div>
                <h2 style={{ fontSize: "24px", fontWeight: 900, color: "#fff", marginBottom: "8px" }}>Top Matches for You</h2>
                <p style={{ fontSize: "14px", color: "rgba(255,255,255,.5)" }}>Based on your selected skills and commitment level.</p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px" }}>
                {recommendations.map((club, i) => (
                  <div key={club._id} style={{ background: "rgba(255,255,255,.03)", border: "1.5px solid rgba(255,215,0,.15)", borderRadius: "18px", padding: "24px", animation: `fadeUp .4s ease ${i * .1}s both` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                      <div>
                        <span style={{ fontSize: "10px", fontWeight: 800, color: "#FFD700", textTransform: "uppercase", letterSpacing: "1px" }}>{club.category}</span>
                        <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#fff", marginTop: "4px" }}>{club.name}</h3>
                      </div>
                      <div style={{ background: "rgba(255,215,0,.1)", padding: "4px 10px", borderRadius: "8px", fontSize: "12px", color: "#FFD700", fontWeight: 800 }}>{club.matchScore}% Match</div>
                    </div>
                    <p style={{ fontSize: "13px", color: "rgba(255,255,255,.5)", marginBottom: "18px", lineHeight: 1.6 }}>{club.description}</p>
                    <button className="next-btn-gold" style={{ margin: 0, width: "100%", padding: "10px" }} onClick={() => setApplyClub(club)}>Apply Now</button>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", gap: "12px", marginTop: "32px" }}>
                <button onClick={() => { setDone(false); setStep(0); setAnswers({ skills: [], activities: [], commitment: "" }); }} style={{ flex: 1, background: "rgba(255,255,255,.05)", padding: "14px", borderRadius: "12px", color: "#fff", fontSize: "14px", fontWeight: 700 }}>Retake</button>
                <button onClick={() => navigate("/clubs")} style={{ flex: 1, background: "#FFD700", padding: "14px", borderRadius: "12px", color: "#050A18", fontSize: "14px", fontWeight: 700 }}>Back to Clubs</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {applyClub && <ApplyFromRecommendation club={applyClub} user={user} onClose={() => setApplyClub(null)} onSuccess={showToast} />}
    </>
  );
}
