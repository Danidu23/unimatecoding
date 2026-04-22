import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, ArrowRight, AlertCircle, GraduationCap } from "lucide-react";
import unimateLogo from "../assets/unimatelogo.png";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800;900&family=DM+Sans:ital,wght@0,400;0,500;0,600;1,400&display=swap');
  *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
  html, body, #root { width:100%; max-width:100%; overflow-x:hidden; }
  body { font-family:'DM Sans',system-ui,sans-serif; background:#07091a; }
  ::-webkit-scrollbar { width:5px; }
  ::-webkit-scrollbar-track { background:#07091a; }
  ::-webkit-scrollbar-thumb { background:#F5A623; border-radius:3px; }

  @keyframes fadeUp   { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
  @keyframes float    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  @keyframes glow     { 0%,100%{opacity:.4} 50%{opacity:.85} }
  @keyframes shimmer  { 0%{background-position:200% center} 100%{background-position:-200% center} }
  @keyframes pulse    { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.18);opacity:.8} }
  @keyframes shake    { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-6px)} 40%,80%{transform:translateX(6px)} }

  .page-wrap {
    min-height:100vh; display:flex; align-items:stretch;
    background:#07091a;
  }

  /* ── Left panel ── */
  .left-panel {
    flex:1; display:flex; flex-direction:column; justify-content:center; align-items:center;
    padding:clamp(32px,6vw,64px); position:relative; overflow:hidden;
    background:linear-gradient(150deg,#07091a 0%,#0c1130 55%,#14193a 100%);
  }
  .left-panel::before {
    content:''; position:absolute; inset:0;
    background:repeating-linear-gradient(90deg,rgba(255,255,255,.015) 0,rgba(255,255,255,.015) 1px,transparent 1px,transparent 60px),
               repeating-linear-gradient(0deg,rgba(255,255,255,.015) 0,rgba(255,255,255,.015) 1px,transparent 1px,transparent 60px);
    pointer-events:none;
  }

  /* ── Right panel (form) ── */
  .right-panel {
    width:clamp(340px,44%,520px); display:flex; flex-direction:column;
    justify-content:center; padding:clamp(32px,5vw,64px) clamp(28px,5vw,56px);
    background:#0a0d22; border-left:1px solid rgba(255,255,255,.07);
    position:relative; overflow-y:auto;
  }

  /* ── Input field ── */
  .field-wrap {
    position:relative; margin-bottom:16px;
  }
  .field-icon {
    position:absolute; left:14px; top:50%; transform:translateY(-50%);
    color:rgba(255,255,255,.35); pointer-events:none; display:flex;
  }
  .field-input {
    width:100%; background:rgba(255,255,255,.05);
    border:1.5px solid rgba(255,255,255,.1);
    border-radius:12px; padding:13px 14px 13px 42px;
    color:#fff; font-size:14px; font-family:'DM Sans',sans-serif;
    outline:none; transition:border-color .22s, background .22s;
  }
  .field-input::placeholder { color:rgba(255,255,255,.3); }
  .field-input:focus { border-color:rgba(245,166,35,.55); background:rgba(245,166,35,.04); }
  .field-input.error { border-color:rgba(239,68,68,.5); background:rgba(239,68,68,.04); animation:shake .35s ease; }
  .field-input.has-toggle { padding-right:44px; }

  .toggle-eye {
    position:absolute; right:13px; top:50%; transform:translateY(-50%);
    background:none; border:none; color:rgba(255,255,255,.35);
    cursor:pointer; display:flex; padding:4px; transition:color .2s;
  }
  .toggle-eye:hover { color:rgba(255,255,255,.7); }

  /* ── Submit button ── */
  .btn-submit {
    width:100%; display:flex; align-items:center; justify-content:center; gap:8px;
    background:#F5A623; color:#07091a; border:none; border-radius:12px;
    padding:15px; font-size:15px; font-weight:800; font-family:'Manrope',sans-serif;
    cursor:pointer; margin-top:8px;
    transition:transform .22s, box-shadow .22s, background .22s;
    box-shadow:0 4px 20px rgba(245,166,35,.38);
    position:relative; overflow:hidden;
  }
  .btn-submit::after {
    content:''; position:absolute; inset:0;
    background:linear-gradient(110deg,transparent 30%,rgba(255,255,255,.25) 50%,transparent 70%);
    transform:translateX(-100%); transition:transform .5s;
  }
  .btn-submit:hover { transform:translateY(-2px); background:#f9ba3c; box-shadow:0 8px 28px rgba(245,166,35,.55); }
  .btn-submit:hover::after { transform:translateX(100%); }
  .btn-submit:disabled { opacity:.55; cursor:not-allowed; transform:none; }

  /* ── Divider ── */
  .or-divider {
    display:flex; align-items:center; gap:12px; margin:20px 0;
  }
  .or-line { flex:1; height:1px; background:rgba(255,255,255,.08); }
  .or-text  { font-size:12px; color:rgba(255,255,255,.35); font-weight:600; white-space:nowrap; }

  /* ── Error box ── */
  .error-box {
    display:flex; align-items:center; gap:8px;
    background:rgba(239,68,68,.08); border:1px solid rgba(239,68,68,.25);
    border-radius:10px; padding:10px 14px; margin-bottom:16px;
    font-size:13px; color:#f87171; line-height:1.5;
    animation:fadeUp .3s ease both;
  }

  /* ── Responsive ── */
  @media (max-width:768px) {
    .page-wrap { flex-direction:column; }
    .left-panel { min-height:220px; padding:32px 24px; flex:none; }
    .right-panel { width:100%; border-left:none; border-top:1px solid rgba(255,255,255,.07); }
  }
`;

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm]       = useState({ email:"", password:"" });
  const [showPw, setShowPw]   = useState(false);
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);
  const [shake, setShake]     = useState(false);

  const set = (k, v) => { setForm(p => ({...p, [k]:v})); setError(""); };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!form.email) return triggerError("Please enter your email address.");
  if (!form.password) return triggerError("Please enter your password.");
  if (!form.email.includes("@")) return triggerError("Please enter a valid email address.");

  try {
    setLoading(true);

    const res = await api.post("/auth/login", {
      email: form.email,
      password: form.password,
    });

    login(res.data.data);
    const user = res.data?.data?.user;

    const permissions = Array.isArray(user?.permissions)
      ? user.permissions
      : typeof user?.permissions === "string"
        ? [user.permissions]
        : [];

    const isClubsAdmin =
      user?.role === "admin" &&
      permissions.includes("clubs_admin");

    const isSportsAdmin =
      user?.role === "admin" &&
      permissions.includes("sports_admin");

    const isLostFoundAdmin =
      user?.role === "admin" &&
      permissions.includes("lostfound_admin");

    if (isClubsAdmin) {
      navigate("/clubs/admin");
    } else if (isSportsAdmin) {
      navigate("/sports/admin");
    } else if (isLostFoundAdmin) {
      navigate("/lost-found/admin");
    } else if (user?.role === "staff") {
      navigate("/staff");
    } else {
      navigate("/dashboard");
    }
  } catch (err) {
    triggerError(err.response?.data?.message || "Login failed");
  } finally {
    setLoading(false);
  }
};

  const triggerError = msg => {
    setError(msg);
    setShake(true);
    setTimeout(() => setShake(false), 400);
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="page-wrap">

        {/* ── Left branding panel ── */}
        <div className="left-panel">
          {/* Orbs */}
          <div style={{ position:"absolute", top:"20%", left:"50%", transform:"translateX(-50%)", width:"500px", height:"260px", background:"radial-gradient(ellipse,rgba(245,166,35,.1) 0%,transparent 68%)", animation:"glow 5s ease-in-out infinite", pointerEvents:"none" }}/>
          <div style={{ position:"absolute", bottom:"15%", left:"10%", width:"280px", height:"280px", background:"radial-gradient(ellipse,rgba(100,120,255,.07) 0%,transparent 68%)", animation:"glow 7s ease-in-out infinite 2s", pointerEvents:"none" }}/>

          <div style={{ position:"relative", textAlign:"center", maxWidth:"420px" }}>
            {/* Logo */}
            <div style={{ marginBottom:"36px" }}>
              <img src={unimateLogo} alt="Unimate"
                style={{ height:"52px", width:"auto", objectFit:"contain", animation:"float 3.5s ease-in-out infinite" }}
                onError={e => { e.target.style.display="none"; e.target.nextSibling.style.display="flex"; }}
              />
              <div style={{ display:"none", alignItems:"center", justifyContent:"center", gap:"10px", marginBottom:"4px" }}>
                <div style={{ width:"40px", height:"40px", background:"#F5A623", borderRadius:"10px", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <span style={{ fontWeight:900, fontSize:"20px", fontFamily:"Manrope,sans-serif", color:"#07091a" }}>U</span>
                </div>
                <span style={{ fontWeight:900, fontSize:"26px", fontFamily:"Manrope,sans-serif", color:"#fff" }}>
                  Uni<span style={{ color:"#F5A623" }}>mate</span>
                </span>
              </div>
            </div>

            {/* Headline */}
            <h1 style={{ fontSize:"clamp(28px,4vw,42px)", fontWeight:900, color:"#fff", fontFamily:"Manrope,sans-serif", letterSpacing:"-1px", lineHeight:1.1, marginBottom:"16px" }}>
              Your campus,<br/>
              <span style={{ backgroundImage:"linear-gradient(90deg,#F5A623,#ffd166,#F5A623)", backgroundSize:"200% auto", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text", animation:"shimmer 3.5s linear infinite" }}>
                all in one place
              </span>
            </h1>
            <p style={{ fontSize:"15px", color:"rgba(255,255,255,.5)", lineHeight:1.75, marginBottom:"40px" }}>
              Order meals, report lost items, book events and access all campus services — built exclusively for SLIT students.
            </p>

            {/* Feature pills */}
            <div style={{ display:"flex", flexWrap:"wrap", gap:"8px", justifyContent:"center" }}>
              {["🍛 Canteen Orders","📦 Lost & Found","🏟 Event Booking","🏋 Sports & Clubs"].map((f,i) => (
                <div key={i} style={{ background:"rgba(245,166,35,.1)", border:"1px solid rgba(245,166,35,.2)", borderRadius:"100px", padding:"6px 14px", fontSize:"12px", color:"rgba(255,255,255,.7)", fontWeight:600, animation:`fadeUp .5s ease ${i*.1}s both` }}>
                  {f}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right form panel ── */}
        <div className="right-panel">
          <div style={{ animation:"fadeUp .6s ease both" }}>
            {/* Header */}
            <div style={{ marginBottom:"32px", textAlign:"left" }}>
              <div style={{ display:"inline-flex", alignItems:"center", gap:"6px", background:"rgba(245,166,35,.1)", border:"1px solid rgba(245,166,35,.2)", borderRadius:"100px", padding:"4px 12px", marginBottom:"16px" }}>
                <GraduationCap size={12} color="#F5A623"/>
                <span style={{ fontSize:"11px", fontWeight:700, color:"#F5A623", fontFamily:"Manrope,sans-serif", letterSpacing:"0.6px" }}>SLIT STUDENT PORTAL</span>
              </div>
              <h2 style={{ fontSize:"clamp(22px,3vw,30px)", fontWeight:900, color:"#fff", fontFamily:"Manrope,sans-serif", letterSpacing:"-0.6px", marginBottom:"6px" }}>
                Welcome back 👋
              </h2>
              <p style={{ fontSize:"14px", color:"rgba(255,255,255,.45)" }}>
                Sign in to your Unimate account to continue
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="error-box">
                <AlertCircle size={16} style={{ flexShrink:0 }}/>
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate>
              {/* Email */}
              <label style={{ fontSize:"12px", fontWeight:700, color:"rgba(255,255,255,.55)", fontFamily:"Manrope,sans-serif", letterSpacing:"0.5px", textTransform:"uppercase", display:"flex", alignItems:"center", gap:"6px", marginBottom:"6px" }}>
                <Mail size={13} color="rgba(255,255,255,.4)"/> Email Address
              </label>
              <div className="field-wrap">
                <span className="field-icon"><Mail size={16}/></span>
                <input
                  className={`field-input${shake && !form.email ? " error" : ""}`}
                  type="email" placeholder="yourname@slit.lk"
                  value={form.email} onChange={e => set("email", e.target.value)}
                  autoComplete="email"
                />
              </div>

              {/* Password */}
              <label style={{ fontSize:"12px", fontWeight:700, color:"rgba(255,255,255,.55)", fontFamily:"Manrope,sans-serif", letterSpacing:"0.5px", textTransform:"uppercase", display:"flex", alignItems:"center", gap:"6px", marginBottom:"6px" }}>
                <Lock size={13} color="rgba(255,255,255,.4)"/> Password
              </label>
              <div className="field-wrap">
                <span className="field-icon"><Lock size={16}/></span>
                <input
                  className={`field-input has-toggle${shake && !form.password ? " error" : ""}`}
                  type={showPw ? "text" : "password"} placeholder="Enter your password"
                  value={form.password} onChange={e => set("password", e.target.value)}
                  autoComplete="current-password"
                />
                <button type="button" className="toggle-eye" onClick={() => setShowPw(v => !v)}>
                  {showPw ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
              </div>

              {/* Forgot password */}
              <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:"24px", marginTop:"-8px" }}>
                <Link
                  to="/forgot-password"
                  style={{ fontSize:"13px", color:"#F5A623", fontWeight:600, textDecoration:"none", transition:"opacity .2s" }}
                  onMouseOver={e => e.currentTarget.style.opacity=".75"}
                  onMouseOut={e => e.currentTarget.style.opacity="1"}
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit */}
              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? (
                  <div style={{ width:"18px", height:"18px", border:"2px solid rgba(7,9,26,.3)", borderTopColor:"#07091a", borderRadius:"50%", animation:"spin 0.7s linear infinite" }}/>
                ) : (
                  <><span>Sign In</span><ArrowRight size={16}/></>
                )}
              </button>
            </form>

            <div className="or-divider">
              <div className="or-line"/><span className="or-text">Don't have an account?</span><div className="or-line"/>
            </div>

            {/* Register link */}
            <Link to="/register" style={{ textDecoration:"none", display:"block" }}>
              <button type="button" style={{
                width:"100%", display:"flex", alignItems:"center", justifyContent:"center", gap:"8px",
                background:"rgba(255,255,255,.05)", border:"1.5px solid rgba(255,255,255,.1)",
                borderRadius:"12px", padding:"13px", fontSize:"14px", fontWeight:700,
                fontFamily:"Manrope,sans-serif", color:"rgba(255,255,255,.8)", cursor:"pointer",
                transition:"all .22s"
              }}
                onMouseOver={e => { e.currentTarget.style.borderColor="rgba(245,166,35,.4)"; e.currentTarget.style.color="#F5A623"; e.currentTarget.style.background="rgba(245,166,35,.06)"; }}
                onMouseOut={e  => { e.currentTarget.style.borderColor="rgba(255,255,255,.1)"; e.currentTarget.style.color="rgba(255,255,255,.8)"; e.currentTarget.style.background="rgba(255,255,255,.05)"; }}
              >
                Create an Account
              </button>
            </Link>

            <p style={{ textAlign:"left", fontSize:"12px", color:"rgba(255,255,255,.22)", marginTop:"28px", lineHeight:1.6 }}>
              By signing in you agree to Unimate's{" "}
              <a href="#" style={{ color:"rgba(255,255,255,.4)", textDecoration:"none" }}>Terms of Service</a>
              {" "}and{" "}
              <a href="#" style={{ color:"rgba(255,255,255,.4)", textDecoration:"none" }}>Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>

      {/* Spin keyframe */}
      <style>{`@keyframes spin { to { transform:rotate(360deg); } }`}</style>
    </>
  );
}