import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, ArrowRight, AlertCircle, GraduationCap, User, IdCard } from "lucide-react";
import { authAPI, setSession } from "../api/clubsApi";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
  *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
  html, body, #root { width:100%; min-height:100vh; }
  body { font-family:'Inter',system-ui,sans-serif; background:#0A0A0A; color:#fff; }
  button { font-family:inherit; cursor:pointer; border:none; }
  a { text-decoration:none; }

  @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  @keyframes glow { 0%,100%{opacity:.5} 50%{opacity:1} }
  @keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-6px)} 75%{transform:translateX(6px)} }

  .ca-wrap { min-height:100vh; display:flex; align-items:stretch; background:#0A0A0A; }
  .ca-left {
    flex:1; display:flex; flex-direction:column; justify-content:center; align-items:center;
    padding:clamp(32px,6vw,64px); position:relative; overflow:hidden;
    background:linear-gradient(145deg,#0A0A0A 0%,#111 50%,#0f0f0f 100%);
  }
  .ca-right {
    width:clamp(340px,44%,500px); background:#111; border-left:1px solid rgba(255,215,0,.12);
    display:flex; flex-direction:column; justify-content:center;
    padding:clamp(32px,5vw,64px) clamp(28px,5vw,52px); overflow-y:auto;
  }
  .ca-input {
    width:100%; background:rgba(255,255,255,.06); border:1.5px solid rgba(255,255,255,.1);
    border-radius:10px; padding:12px 14px 12px 42px; color:#fff; font-size:14px;
    font-family:'Inter',sans-serif; outline:none; transition:border-color .22s, background .22s;
  }
  .ca-input:focus { border-color:rgba(255,215,0,.6); background:rgba(255,215,0,.04); }
  .ca-input.err { border-color:rgba(239,68,68,.6); animation:shake .3s ease; }
  .ca-input::placeholder { color:rgba(255,255,255,.3); }
  .ca-btn {
    width:100%; display:flex; align-items:center; justify-content:center; gap:8px;
    background:#FFD700; color:#0A0A0A; border:none; border-radius:10px;
    padding:14px; font-size:15px; font-weight:700; font-family:'Inter',sans-serif;
    cursor:pointer; transition:transform .2s, box-shadow .2s, background .2s;
    box-shadow:0 4px 20px rgba(255,215,0,.35); margin-top:8px;
  }
  .ca-btn:hover { transform:translateY(-2px); box-shadow:0 8px 28px rgba(255,215,0,.5); background:#ffe629; }
  .ca-btn:disabled { opacity:.5; cursor:not-allowed; transform:none; }
  .ca-link-btn {
    width:100%; display:flex; align-items:center; justify-content:center;
    background:rgba(255,255,255,.05); border:1.5px solid rgba(255,255,255,.12);
    border-radius:10px; padding:13px; font-size:14px; font-weight:600;
    color:rgba(255,255,255,.8); cursor:pointer; transition:all .22s;
  }
  .ca-link-btn:hover { border-color:rgba(255,215,0,.4); color:#FFD700; background:rgba(255,215,0,.06); }
  .ca-err { display:flex; align-items:center; gap:8px; background:rgba(239,68,68,.08); border:1px solid rgba(239,68,68,.25); border-radius:9px; padding:10px 14px; margin-bottom:14px; font-size:13px; color:#f87171; }
  .ca-field { position:relative; margin-bottom:14px; }
  .ca-field-icon { position:absolute; left:13px; top:50%; transform:translateY(-50%); color:rgba(255,255,255,.35); display:flex; pointer-events:none; }
  .ca-label { font-size:11px; font-weight:700; color:rgba(255,255,255,.5); letter-spacing:.6px; text-transform:uppercase; display:flex; align-items:center; gap:5px; margin-bottom:6px; }
  .ca-divider { display:flex; align-items:center; gap:10px; margin:18px 0; }
  .ca-div-line { flex:1; height:1px; background:rgba(255,255,255,.08); }
  @media(max-width:768px){
    .ca-wrap{flex-direction:column;}
    .ca-left{min-height:200px;flex:none;}
    .ca-right{width:100%;border-left:none;border-top:1px solid rgba(255,215,0,.12);}
  }
`;

export default function ClubsAuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", studentId: "", email: "", password: "", confirm: "" });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({});

  const set = (k, v) => { 
    setForm(p => ({ ...p, [k]: v })); 
    setError(""); 
    setTouched(p => ({ ...p, [k]: true }));
  };

  const validate = () => {
    if (mode === "register") {
      if (!form.name || form.name.trim().length < 3) return "Name must be at least 3 letters.";
      if (!/^[A-Za-z\s]+$/.test(form.name)) return "Name must contain letters only.";
      if (!/^IT\d{7}$/i.test(form.studentId)) return "Invalid Student ID (e.g. IT2324616).";
      if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(form.email)) return "Invalid email address.";
      if (form.password.length < 8) return "Password must be at least 8 characters.";
      if (!/(?=.*[0-9])(?=.*[!@#$%^&*])/.test(form.password)) return "Include a number and special character.";
      if (form.password !== form.confirm) return "Passwords do not match.";
    } else {
      if (!form.email || !form.password) return "Please fill in all fields.";
    }
    return null;
  };

  const getStrength = () => {
    if (!form.password) return 0;
    let s = 0;
    if (form.password.length >= 8) s++;
    if (/[0-9]/.test(form.password)) s++;
    if (/[!@#$%^&*]/.test(form.password)) s++;
    return s;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const vErr = validate();
    if (vErr) { setError(vErr); return; }

    setLoading(true);
    try {
      let res;
      if (mode === "login") {
        res = await authAPI.login({ email: form.email, password: form.password });
      } else {
        res = await authAPI.register({ 
          name: form.name.trim(), 
          studentId: form.studentId.trim().toUpperCase(), 
          email: form.email.trim().toLowerCase(), 
          password: form.password 
        });
      }
      const { token, user } = res.data;
      setSession(token, user);
      if (user.role === "admin") navigate("/clubs/admin");
      else navigate("/clubs");
    } catch (err) {
      setError(err.response?.data?.message || "Authentication failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="ca-wrap">
        {/* Left branding */}
        <div className="ca-left">
          <div style={{ position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)", width: "500px", height: "300px", background: "radial-gradient(ellipse,rgba(255,215,0,.08) 0%,transparent 70%)", animation: "glow 5s ease-in-out infinite", pointerEvents: "none" }} />
          <div style={{ position: "relative", textAlign: "center", maxWidth: "400px", animation: "fadeUp .6s ease both" }}>
            <div style={{ width: "60px", height: "60px", background: "#FFD700", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", boxShadow: "0 6px 30px rgba(255,215,0,.4)" }}>
              <GraduationCap size={30} color="#0A0A0A" />
            </div>
            <h1 style={{ fontSize: "clamp(28px,4vw,40px)", fontWeight: 900, color: "#fff", letterSpacing: "-1px", lineHeight: 1.1, marginBottom: "14px" }}>
              Clubs &<br />
              <span style={{ color: "#FFD700" }}>Societies</span>
            </h1>
            <p style={{ fontSize: "15px", color: "rgba(255,255,255,.5)", lineHeight: 1.75, marginBottom: "32px" }}>
              Discover student clubs, get AI-powered recommendations, and apply for membership — all in one place.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center" }}>
              {["🤖 AI Recommendations", "🏛️ Club Discovery", "📋 Application Tracking", "⚙️ Admin Management"].map((f, i) => (
                <div key={i} style={{ background: "rgba(255,215,0,.1)", border: "1px solid rgba(255,215,0,.2)", borderRadius: "100px", padding: "5px 14px", fontSize: "12px", color: "rgba(255,255,255,.7)", fontWeight: 600 }}>
                  {f}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right form */}
        <div className="ca-right">
          <div style={{ animation: "fadeUp .5s ease both" }}>
            <div style={{ marginBottom: "28px" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(255,215,0,.1)", border: "1px solid rgba(255,215,0,.25)", borderRadius: "100px", padding: "4px 12px", marginBottom: "14px" }}>
                <span style={{ fontSize: "11px", fontWeight: 700, color: "#FFD700", letterSpacing: ".5px" }}>SLIIT CAMPUS — UniMate</span>
              </div>
              <h2 style={{ fontSize: "24px", fontWeight: 800, color: "#fff", letterSpacing: "-0.5px", marginBottom: "4px" }}>
                {mode === "login" ? "Welcome back 👋" : "Create Account"}
              </h2>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,.4)" }}>
                {mode === "login" ? "Sign in to access the clubs portal" : "Register as a SLIIT student"}
              </p>
            </div>

            {error && <div className="ca-err"><AlertCircle size={15} style={{ flexShrink: 0 }} />{error}</div>}

            <form onSubmit={handleSubmit} noValidate>
              {mode === "register" && (
                <>
                  <label className="ca-label"><User size={11} /> Full Name</label>
                  <div className="ca-field">
                    <span className="ca-field-icon"><User size={16} /></span>
                    <input className="ca-input" placeholder="e.g. Kamal Perera" value={form.name} onChange={e => set("name", e.target.value)} />
                  </div>
                  <label className="ca-label"><IdCard size={11} /> Student ID</label>
                  <div className="ca-field">
                    <span className="ca-field-icon"><IdCard size={16} /></span>
                    <input className="ca-input" placeholder="e.g. IT2324616" value={form.studentId} onChange={e => set("studentId", e.target.value)} />
                  </div>
                </>
              )}

              <label className="ca-label"><Mail size={11} /> Email Address</label>
              <div className="ca-field">
                <span className="ca-field-icon"><Mail size={16} /></span>
                <input className="ca-input" type="email" placeholder="your@slit.lk" value={form.email} onChange={e => set("email", e.target.value)} />
              </div>

              <label className="ca-label"><Lock size={11} /> Password</label>
              <div className="ca-field">
                <span className="ca-field-icon"><Lock size={16} /></span>
                <input 
                  className={`ca-input ${touched.password && (form.password.length < 8 || !/(?=.*[0-9])(?=.*[!@#$%^&*])/.test(form.password)) ? 'err' : ''}`} 
                  type={showPw ? "text" : "password"} 
                  placeholder="Min 8 characters, 1 number, 1 special" 
                  value={form.password} 
                  onChange={e => set("password", e.target.value)} 
                  style={{ paddingRight: "40px" }} 
                />
                <button type="button" style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "rgba(255,255,255,.35)", cursor: "pointer" }} onClick={() => setShowPw(v => !v)}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {mode === "register" && form.password && (
                <div style={{ display: "flex", gap: "4px", marginBottom: "14px", marginTop: "-10px" }}>
                  {[1, 2, 3].map(level => (
                    <div 
                      key={level} 
                      style={{ 
                        flex: 1, 
                        height: "3px", 
                        borderRadius: "2px", 
                        background: getStrength() >= level 
                          ? (getStrength() === 1 ? "#ef4444" : getStrength() === 2 ? "#eab308" : "#22c55e") 
                          : "rgba(255,255,255,.1)",
                        transition: "all .3s"
                      }} 
                    />
                  ))}
                </div>
              )}

              {mode === "register" && (
                <>
                  <label className="ca-label"><Lock size={11} /> Confirm Password</label>
                  <div className="ca-field">
                    <span className="ca-field-icon"><Lock size={16} /></span>
                    <input 
                      className={`ca-input ${touched.confirm && form.password !== form.confirm ? 'err' : ''}`} 
                      type="password" 
                      placeholder="Re-enter password" 
                      value={form.confirm} 
                      onChange={e => set("confirm", e.target.value)} 
                    />
                  </div>
                </>
              )}

              <button type="submit" className="ca-btn" disabled={loading}>
                {loading ? <div style={{ width: "16px", height: "16px", border: "2px solid rgba(0,0,0,.3)", borderTopColor: "#0A0A0A", borderRadius: "50%", animation: "spin .7s linear infinite" }} /> : <>{mode === "login" ? "Sign In" : "Create Account"} <ArrowRight size={16} /></>}
              </button>
            </form>

            <div className="ca-divider">
              <div className="ca-div-line" />
              <span style={{ fontSize: "12px", color: "rgba(255,255,255,.3)", fontWeight: 600 }}>
                {mode === "login" ? "No account?" : "Have an account?"}
              </span>
              <div className="ca-div-line" />
            </div>

            <button className="ca-link-btn" onClick={() => { setMode(m => m === "login" ? "register" : "login"); setError(""); setForm({ name: "", studentId: "", email: "", password: "", confirm: "" }); }}>
              {mode === "login" ? "Create a Student Account" : "Sign In Instead"}
            </button>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform:rotate(360deg); } }`}</style>
    </>
  );
}
