import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, AlertCircle, CheckCircle2, GraduationCap } from "lucide-react";
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
  @keyframes spin     { to{transform:rotate(360deg)} }
  @keyframes popIn    { from{transform:scale(.7);opacity:0} to{transform:scale(1);opacity:1} }

  .page-wrap {
    min-height:100vh; display:flex; align-items:stretch; background:#07091a;
  }

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

  .right-panel {
    width:clamp(360px,48%,560px); display:flex; flex-direction:column;
    justify-content:center; padding:clamp(28px,4vw,52px) clamp(28px,5vw,56px);
    background:#0a0d22; border-left:1px solid rgba(255,255,255,.07);
    position:relative; overflow-y:auto;
  }

  .field-wrap { position:relative; margin-bottom:14px; }
  .field-icon  { position:absolute; left:14px; top:50%; transform:translateY(-50%); color:rgba(255,255,255,.35); pointer-events:none; display:flex; }
  .field-input {
    width:100%; background:rgba(255,255,255,.05);
    border:1.5px solid rgba(255,255,255,.1); border-radius:12px;
    padding:12px 14px 12px 42px; color:#fff; font-size:14px;
    font-family:'DM Sans',sans-serif; outline:none;
    transition:border-color .22s, background .22s;
  }
  .field-input::placeholder { color:rgba(255,255,255,.3); }
  .field-input:focus { border-color:rgba(245,166,35,.55); background:rgba(245,166,35,.04); }
  .field-input.error { border-color:rgba(239,68,68,.5); background:rgba(239,68,68,.04); animation:shake .35s ease; }
  .field-input.has-toggle { padding-right:44px; }
  .field-input.valid { border-color:rgba(34,197,94,.4); }

  .toggle-eye { position:absolute; right:13px; top:50%; transform:translateY(-50%); background:none; border:none; color:rgba(255,255,255,.35); cursor:pointer; display:flex; padding:4px; transition:color .2s; }
  .toggle-eye:hover { color:rgba(255,255,255,.7); }

  .strength-bar { display:flex; gap:4px; margin-top:6px; }
  .strength-seg { flex:1; height:3px; border-radius:2px; background:rgba(255,255,255,.1); transition:background .3s; }

  .btn-submit {
    width:100%; display:flex; align-items:center; justify-content:center; gap:8px;
    background:#F5A623; color:#07091a; border:none; border-radius:12px;
    padding:14px; font-size:15px; font-weight:800; font-family:'Manrope',sans-serif;
    cursor:pointer; margin-top:6px;
    transition:transform .22s, box-shadow .22s, background .22s;
    box-shadow:0 4px 20px rgba(245,166,35,.38);
    position:relative; overflow:hidden;
  }
  .btn-submit::after { content:''; position:absolute; inset:0; background:linear-gradient(110deg,transparent 30%,rgba(255,255,255,.25) 50%,transparent 70%); transform:translateX(-100%); transition:transform .5s; }
  .btn-submit:hover { transform:translateY(-2px); background:#f9ba3c; box-shadow:0 8px 28px rgba(245,166,35,.55); }
  .btn-submit:hover::after { transform:translateX(100%); }
  .btn-submit:disabled { opacity:.55; cursor:not-allowed; transform:none; }

  .error-box { display:flex; align-items:center; gap:8px; background:rgba(239,68,68,.08); border:1px solid rgba(239,68,68,.25); border-radius:10px; padding:10px 14px; margin-bottom:14px; font-size:13px; color:#f87171; line-height:1.5; animation:fadeUp .3s ease both; }
  .success-overlay { position:fixed; inset:0; background:rgba(0,0,0,.75); z-index:600; display:flex; align-items:center; justify-content:center; backdrop-filter:blur(8px); animation:fadeIn .3s ease; }
  .success-card { background:#0d1130; border:1.5px solid rgba(245,166,35,.2); border-radius:28px; padding:40px 36px; text-align:center; max-width:380px; width:90%; animation:popIn .4s cubic-bezier(.22,.68,0,1.2); }

  .or-divider { display:flex; align-items:center; gap:12px; margin:18px 0; }
  .or-line { flex:1; height:1px; background:rgba(255,255,255,.08); }
  .or-text  { font-size:12px; color:rgba(255,255,255,.35); font-weight:600; white-space:nowrap; }

  @media (max-width:768px) {
    .page-wrap { flex-direction:column; }
    .left-panel { min-height:180px; padding:28px 24px; flex:none; }
    .right-panel { width:100%; border-left:none; border-top:1px solid rgba(255,255,255,.07); }
  }
`;

const getStrength = pw => {
  if (!pw) return 0;
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
};

const STRENGTH_LABELS = ["", "Weak", "Fair", "Good", "Strong"];
const STRENGTH_COLORS = ["", "#ef4444", "#f59e0b", "#3b82f6", "#22c55e"];

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
  });

  const [showPw, setShowPw] = useState(false);
  const [showCf, setShowCf] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const set = (k, v) => {
    setForm(p => ({ ...p, [k]: v }));
    setError("");
  };

  const strength = getStrength(form.password);

  const validate = () => {
    if (!form.name.trim()) return "Please enter your full name.";
    if (!form.email.includes("@")) return "Please enter a valid email address.";
    if (!form.phone.trim()) return "Please enter your phone number.";
    if (form.phone && !/^\d{10}$/.test(form.phone.replace(/\s/g, ""))) return "Phone number must be 10 digits.";
    if (form.password.length < 8) return "Password must be at least 8 characters.";
    if (form.password !== form.confirm) return "Passwords do not match.";
    return null;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const err = validate();
    if (err) return setError(err);

    try {
      setLoading(true);

      const res = await api.post("/auth/register", {
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
      });

      login(res.data.data);
      setSuccess(true);

      setTimeout(() => navigate("/dashboard"), 1800);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="page-wrap">
        <div className="left-panel">
          <div style={{ position:"absolute", top:"15%", left:"50%", transform:"translateX(-50%)", width:"500px", height:"260px", background:"radial-gradient(ellipse,rgba(245,166,35,.1) 0%,transparent 68%)", animation:"glow 5s ease-in-out infinite", pointerEvents:"none" }}/>
          <div style={{ position:"absolute", bottom:"20%", right:"8%", width:"260px", height:"260px", background:"radial-gradient(ellipse,rgba(100,120,255,.07) 0%,transparent 68%)", animation:"glow 7s ease-in-out infinite 2s", pointerEvents:"none" }}/>

          <div style={{ position:"relative", textAlign:"center", maxWidth:"400px" }}>
            <div style={{ marginBottom:"32px" }}>
              <img
                src={unimateLogo}
                alt="Unimate"
                style={{ height:"52px", width:"auto", objectFit:"contain", animation:"float 3.5s ease-in-out infinite" }}
                onError={e => { e.target.style.display="none"; e.target.nextSibling.style.display="flex"; }}
              />
              <div style={{ display:"none", alignItems:"center", justifyContent:"center", gap:"10px" }}>
                <div style={{ width:"40px", height:"40px", background:"#F5A623", borderRadius:"10px", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <span style={{ fontWeight:900, fontSize:"20px", fontFamily:"Manrope,sans-serif", color:"#07091a" }}>U</span>
                </div>
                <span style={{ fontWeight:900, fontSize:"26px", fontFamily:"Manrope,sans-serif", color:"#fff" }}>
                  Uni<span style={{ color:"#F5A623" }}>mate</span>
                </span>
              </div>
            </div>

            <h1 style={{ fontSize:"clamp(26px,4vw,40px)", fontWeight:900, color:"#fff", fontFamily:"Manrope,sans-serif", letterSpacing:"-1px", lineHeight:1.1, marginBottom:"14px" }}>
              Join Unimate<br/>
              <span style={{ backgroundImage:"linear-gradient(90deg,#F5A623,#ffd166,#F5A623)", backgroundSize:"200% auto", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text", animation:"shimmer 3.5s linear infinite" }}>
                today
              </span>
            </h1>
            <p style={{ fontSize:"14px", color:"rgba(255,255,255,.5)", lineHeight:1.75, marginBottom:"32px" }}>
              Create your free account and start pre-ordering meals, booking events, and managing campus life.
            </p>

            {[
              { num:"1", label:"Create your account" },
              { num:"2", label:"Verify your student email" },
              { num:"3", label:"Start using campus services" },
            ].map((s,i) => (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:"12px", marginBottom:"12px", textAlign:"left", animation:`fadeUp .5s ease ${i*.12}s both` }}>
                <div style={{ width:"28px", height:"28px", borderRadius:"50%", background:"rgba(245,166,35,.15)", border:"1.5px solid rgba(245,166,35,.3)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <span style={{ fontSize:"12px", fontWeight:800, color:"#F5A623", fontFamily:"Manrope,sans-serif" }}>{s.num}</span>
                </div>
                <span style={{ fontSize:"13px", color:"rgba(255,255,255,.6)", fontWeight:500 }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="right-panel">
          <div style={{ animation:"fadeUp .6s ease both" }}>
            <div style={{ marginBottom:"24px", textAlign:"left" }}>
              <div style={{ display:"inline-flex", alignItems:"center", gap:"6px", background:"rgba(245,166,35,.1)", border:"1px solid rgba(245,166,35,.2)", borderRadius:"100px", padding:"4px 12px", marginBottom:"14px" }}>
                <GraduationCap size={12} color="#F5A623"/>
                <span style={{ fontSize:"11px", fontWeight:700, color:"#F5A623", fontFamily:"Manrope,sans-serif", letterSpacing:"0.6px" }}>CREATE ACCOUNT</span>
              </div>
              <h2 style={{ fontSize:"clamp(20px,3vw,28px)", fontWeight:900, color:"#fff", fontFamily:"Manrope,sans-serif", letterSpacing:"-0.6px", marginBottom:"5px" }}>
                Get started for free
              </h2>
              <p style={{ fontSize:"14px", color:"rgba(255,255,255,.45)" }}>
                Fill in your details to create your SLIT campus account
              </p>
            </div>

            {error && (
              <div className="error-box">
                <AlertCircle size={16} style={{ flexShrink:0 }}/> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <label style={{ fontSize:"12px", fontWeight:700, color:"rgba(255,255,255,.55)", fontFamily:"Manrope,sans-serif", letterSpacing:"0.5px", textTransform:"uppercase", display:"flex", alignItems:"center", gap:"6px", marginBottom:"6px" }}>
                <User size={13} color="rgba(255,255,255,.4)"/> Full Name
              </label>
              <div className="field-wrap">
                <span className="field-icon"><User size={16}/></span>
                <input
                  className="field-input"
                  type="text"
                  placeholder="Kamal Perera"
                  value={form.name}
                  onChange={e => set("name", e.target.value)}
                  autoComplete="name"
                />
              </div>

              <label style={{ fontSize:"12px", fontWeight:700, color:"rgba(255,255,255,.55)", fontFamily:"Manrope,sans-serif", letterSpacing:"0.5px", textTransform:"uppercase", display:"flex", alignItems:"center", gap:"6px", marginBottom:"6px" }}>
                <Mail size={13} color="rgba(255,255,255,.4)"/> Email Address
              </label>
              <div className="field-wrap">
                <span className="field-icon"><Mail size={16}/></span>
                <input
                  className={`field-input${form.email && !form.email.includes("@") ? " error" : form.email.includes("@") ? " valid" : ""}`}
                  type="email"
                  placeholder="yourname@slit.lk"
                  value={form.email}
                  onChange={e => set("email", e.target.value)}
                  autoComplete="email"
                />
              </div>

              <label style={{ fontSize:"12px", fontWeight:700, color:"rgba(255,255,255,.55)", fontFamily:"Manrope,sans-serif", letterSpacing:"0.5px", textTransform:"uppercase", display:"flex", alignItems:"center", gap:"6px", marginBottom:"6px" }}>
                <Phone size={13} color="rgba(255,255,255,.4)"/> Phone
              </label>
              <div className="field-wrap">
                <span className="field-icon"><Phone size={16}/></span>
                <input
                  className="field-input"
                  type="tel"
                  placeholder="07X XXX XXXX"
                  value={form.phone}
                  onChange={e => set("phone", e.target.value)}
                  autoComplete="tel"
                />
              </div>

              <label style={{ fontSize:"12px", fontWeight:700, color:"rgba(255,255,255,.55)", fontFamily:"Manrope,sans-serif", letterSpacing:"0.5px", textTransform:"uppercase", display:"flex", alignItems:"center", gap:"6px", marginBottom:"6px" }}>
                <Lock size={13} color="rgba(255,255,255,.4)"/> Password
              </label>
              <div className="field-wrap" style={{ marginBottom:"6px" }}>
                <span className="field-icon"><Lock size={16}/></span>
                <input
                  className="field-input has-toggle"
                  type={showPw ? "text" : "password"}
                  placeholder="Min. 8 characters"
                  value={form.password}
                  onChange={e => set("password", e.target.value)}
                  autoComplete="new-password"
                />
                <button type="button" className="toggle-eye" onClick={() => setShowPw(v => !v)}>
                  {showPw ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
              </div>

              {form.password && (
                <div style={{ marginBottom:"14px" }}>
                  <div className="strength-bar">
                    {[1,2,3,4].map(n => (
                      <div key={n} className="strength-seg" style={{ background: n <= strength ? STRENGTH_COLORS[strength] : undefined }}/>
                    ))}
                  </div>
                  <p style={{ fontSize:"11px", color: STRENGTH_COLORS[strength], fontWeight:600, marginTop:"4px", fontFamily:"Manrope,sans-serif" }}>
                    {STRENGTH_LABELS[strength]} password
                  </p>
                </div>
              )}

              <label style={{ fontSize:"12px", fontWeight:700, color:"rgba(255,255,255,.55)", fontFamily:"Manrope,sans-serif", letterSpacing:"0.5px", textTransform:"uppercase", display:"flex", alignItems:"center", gap:"6px", marginBottom:"6px" }}>
                <Lock size={13} color="rgba(255,255,255,.4)"/> Confirm Password
              </label>
              <div className="field-wrap">
                <span className="field-icon"><Lock size={16}/></span>
                <input
                  className={`field-input has-toggle${form.confirm && form.confirm !== form.password ? " error" : form.confirm && form.confirm === form.password ? " valid" : ""}`}
                  type={showCf ? "text" : "password"}
                  placeholder="Re-enter your password"
                  value={form.confirm}
                  onChange={e => set("confirm", e.target.value)}
                  autoComplete="new-password"
                />
                <button type="button" className="toggle-eye" onClick={() => setShowCf(v => !v)}>
                  {showCf ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
              </div>

              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? (
                  <div style={{ width:"18px", height:"18px", border:"2px solid rgba(7,9,26,.3)", borderTopColor:"#07091a", borderRadius:"50%", animation:"spin 0.7s linear infinite" }}/>
                ) : (
                  <><span>Create Account</span><ArrowRight size={16}/></>
                )}
              </button>
            </form>

            <div className="or-divider">
              <div className="or-line"/><span className="or-text">Already have an account?</span><div className="or-line"/>
            </div>

            <Link to="/login" style={{ textDecoration:"none", display:"block" }}>
              <button
                type="button"
                style={{
                  width:"100%", display:"flex", alignItems:"center", justifyContent:"center", gap:"8px",
                  background:"rgba(255,255,255,.05)", border:"1.5px solid rgba(255,255,255,.1)",
                  borderRadius:"12px", padding:"12px", fontSize:"14px", fontWeight:700,
                  fontFamily:"Manrope,sans-serif", color:"rgba(255,255,255,.8)", cursor:"pointer",
                  transition:"all .22s"
                }}
                onMouseOver={e => { e.currentTarget.style.borderColor="rgba(245,166,35,.4)"; e.currentTarget.style.color="#F5A623"; e.currentTarget.style.background="rgba(245,166,35,.06)"; }}
                onMouseOut={e  => { e.currentTarget.style.borderColor="rgba(255,255,255,.1)"; e.currentTarget.style.color="rgba(255,255,255,.8)"; e.currentTarget.style.background="rgba(255,255,255,.05)"; }}
              >
                Sign In Instead
              </button>
            </Link>

            <p style={{ textAlign:"left", fontSize:"12px", color:"rgba(255,255,255,.22)", marginTop:"20px", lineHeight:1.6 }}>
              By creating an account you agree to Unimate's{" "}
              <a href="#" style={{ color:"rgba(255,255,255,.4)", textDecoration:"none" }}>Terms</a>
              {" "}and{" "}
              <a href="#" style={{ color:"rgba(255,255,255,.4)", textDecoration:"none" }}>Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>

      {success && (
        <div className="success-overlay">
          <div className="success-card">
            <div style={{ width:"60px", height:"60px", borderRadius:"50%", background:"rgba(34,197,94,.15)", border:"1.5px solid rgba(34,197,94,.3)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px" }}>
              <CheckCircle2 size={30} color="#22c55e"/>
            </div>
            <h3 style={{ fontSize:"20px", fontWeight:900, color:"#fff", fontFamily:"Manrope,sans-serif", marginBottom:"8px" }}>Account Created! 🎉</h3>
            <p style={{ fontSize:"13px", color:"rgba(255,255,255,.5)", lineHeight:1.7, marginBottom:"6px" }}>
              Welcome to Unimate, <strong style={{ color:"#F5A623" }}>{form.name.split(" ")[0]}</strong>!
            </p>
            <p style={{ fontSize:"12px", color:"rgba(255,255,255,.35)" }}>Redirecting to dashboard...</p>
            <div style={{ marginTop:"16px", height:"3px", borderRadius:"2px", background:"rgba(255,255,255,.1)", overflow:"hidden" }}>
              <div style={{ height:"100%", background:"#F5A623", animation:"progress 2s linear forwards" }}/>
            </div>
          </div>
          <style>{`@keyframes progress { from{width:0} to{width:100%} }`}</style>
        </div>
      )}
    </>
  );
}