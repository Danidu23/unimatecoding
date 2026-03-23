import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, User, Mail, Phone, GraduationCap, Bell, ShoppingCart,
  Camera, Edit3, Save, X, ChevronRight, LogOut, Shield,
  BookOpen, Clock, Star, UtensilsCrossed, Package, Lock,
  CheckCircle, AlertTriangle, Eye, EyeOff, Menu
} from "lucide-react";
import unimateLogo from "../assets/unimatelogo.png";

/* ─────────────────────────────────────────────────────────────────────────────
   CSS
───────────────────────────────────────────────────────────────────────────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800;900&family=DM+Sans:ital,wght@0,400;0,500;0,600;1,400&display=swap');
  *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
  html, body, #root { width:100%; max-width:100%; overflow-x:hidden; scroll-behavior:smooth; }
  body { font-family:'DM Sans',system-ui,sans-serif; background:#07091a; }
  a { text-decoration:none; }
  button { font-family:inherit; cursor:pointer; border:none; }
  ::-webkit-scrollbar { width:5px; }
  ::-webkit-scrollbar-track { background:#07091a; }
  ::-webkit-scrollbar-thumb { background:#F5A623; border-radius:3px; }

  @keyframes fadeUp   { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
  @keyframes glow     { 0%,100%{opacity:.4} 50%{opacity:.85} }
  @keyframes pulse    { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.18);opacity:.8} }
  @keyframes popIn    { from{transform:scale(.7);opacity:0} to{transform:scale(1);opacity:1} }
  @keyframes shimmer  { 0%{background-position:200% center} 100%{background-position:-200% center} }

  /* ── Navbar ── */
  .p-nav {
    position:fixed; top:0; left:0; right:0; z-index:400;
    background:rgba(7,9,26,.97); backdrop-filter:blur(18px);
    border-bottom:1px solid rgba(255,255,255,.07);
    display:flex; align-items:center; justify-content:space-between;
    padding:0 clamp(16px,4vw,60px); height:66px;
    transition:border-color .4s, box-shadow .4s;
  }
  .p-nav.scrolled { border-bottom-color:rgba(245,166,35,.2); box-shadow:0 6px 40px rgba(0,0,0,.5); }
  .nav-lnk {
    color:rgba(255,255,255,.6); font-size:14px; font-weight:600;
    font-family:'Manrope',sans-serif; padding:4px 0;
    position:relative; transition:color .2s; text-decoration:none;
  }
  .nav-lnk::after { content:''; position:absolute; bottom:-3px; left:0; right:0; height:2px; background:#F5A623; border-radius:2px; transform:scaleX(0); transform-origin:left; transition:transform .25s; }
  .nav-lnk:hover { color:#fff; }
  .nav-lnk:hover::after { transform:scaleX(1); }
  .nav-lnk.active { color:#F5A623; }
  .nav-lnk.active::after { transform:scaleX(1); }

  /* ── Icon btn ── */
  .icon-btn { background:none; border:none; color:rgba(255,255,255,.55); width:38px; height:38px; border-radius:10px; display:flex; align-items:center; justify-content:center; cursor:pointer; transition:background .2s, color .2s; position:relative; }
  .icon-btn:hover { background:rgba(255,255,255,.09); color:#fff; }

  /* ── Back btn ── */
  .btn-back { display:inline-flex; align-items:center; gap:6px; background:rgba(255,255,255,.07); border:1px solid rgba(255,255,255,.13); border-radius:9px; padding:7px 14px; color:rgba(255,255,255,.75); font-size:13px; font-weight:600; cursor:pointer; transition:all .22s; }
  .btn-back:hover { background:rgba(245,166,35,.12); border-color:rgba(245,166,35,.3); color:#F5A623; }

  /* ── Primary btn ── */
  .btn-primary { display:inline-flex; align-items:center; gap:8px; background:#F5A623; color:#07091a; border:none; border-radius:10px; padding:11px 22px; font-size:14px; font-weight:800; font-family:'Manrope',sans-serif; cursor:pointer; transition:transform .22s, box-shadow .22s, background .22s; box-shadow:0 4px 20px rgba(245,166,35,.35); position:relative; overflow:hidden; }
  .btn-primary::after { content:''; position:absolute; inset:0; background:linear-gradient(110deg,transparent 30%,rgba(255,255,255,.25) 50%,transparent 70%); transform:translateX(-100%); transition:transform .5s; }
  .btn-primary:hover { transform:translateY(-2px); background:#f9ba3c; box-shadow:0 8px 28px rgba(245,166,35,.55); }
  .btn-primary:hover::after { transform:translateX(100%); }

  /* ── Card ── */
  .p-card { background:rgba(255,255,255,.04); border:1.5px solid rgba(255,255,255,.08); border-radius:20px; padding:24px; transition:border-color .25s; }
  .p-card:hover { border-color:rgba(255,255,255,.13); }

  /* ── Input ── */
  .p-input { width:100%; background:rgba(255,255,255,.06); border:1.5px solid rgba(255,255,255,.1); border-radius:11px; padding:11px 14px 11px 40px; color:#fff; font-size:14px; font-family:'DM Sans',sans-serif; outline:none; transition:border-color .22s, background .22s; }
  .p-input:focus { border-color:rgba(245,166,35,.5); background:rgba(245,166,35,.04); }
  .p-input:disabled { opacity:.5; cursor:not-allowed; }
  .p-input::placeholder { color:rgba(255,255,255,.3); }

  /* ── Tab ── */
  .p-tab { display:flex; align-items:center; gap:7px; padding:9px 18px; border-radius:10px; font-size:13px; font-weight:700; font-family:'Manrope',sans-serif; cursor:pointer; transition:all .22s; color:rgba(255,255,255,.5); background:none; border:none; white-space:nowrap; }
  .p-tab:hover { color:#fff; background:rgba(255,255,255,.07); }
  .p-tab.active { color:#F5A623; background:rgba(245,166,35,.1); }

  /* ── Stat card ── */
  .stat-card { background:rgba(255,255,255,.04); border:1.5px solid rgba(255,255,255,.08); border-radius:16px; padding:18px 20px; flex:1; min-width:100px; transition:all .25s; }
  .stat-card:hover { border-color:rgba(245,166,35,.3); background:rgba(245,166,35,.04); transform:translateY(-2px); }

  /* ── Activity item ── */
  .activity-item { display:flex; align-items:center; gap:14px; padding:14px 0; border-bottom:1px solid rgba(255,255,255,.06); }
  .activity-item:last-child { border-bottom:none; }

  /* ── Setting row ── */
  .setting-row { display:flex; align-items:center; justify-content:space-between; padding:14px 0; border-bottom:1px solid rgba(255,255,255,.06); cursor:pointer; transition:background .18s; border-radius:8px; }
  .setting-row:last-child { border-bottom:none; }
  .setting-row:hover { background:rgba(255,255,255,.03); padding-left:6px; }

  /* ── Toggle switch ── */
  .toggle { width:42px; height:24px; border-radius:100px; position:relative; cursor:pointer; transition:background .25s; flex-shrink:0; border:none; }
  .toggle::after { content:''; position:absolute; top:3px; left:3px; width:18px; height:18px; border-radius:50%; background:#fff; transition:transform .25s; }
  .toggle.on { background:#F5A623; }
  .toggle.off { background:rgba(255,255,255,.15); }
  .toggle.on::after { transform:translateX(18px); }

  /* ── Modal ── */
  .modal-bg { position:fixed; inset:0; background:rgba(0,0,0,.75); z-index:600; display:flex; align-items:center; justify-content:center; backdrop-filter:blur(8px); animation:fadeIn .25s; padding:20px; }
  .modal { background:#0d1130; border:1.5px solid rgba(245,166,35,.2); border-radius:24px; max-width:400px; width:100%; overflow:hidden; animation:popIn .32s cubic-bezier(.22,.68,0,1.2); }

  /* ── Responsive ── */
  @media (max-width:768px) {
    .desktop-nav { display:none !important; }
    .profile-layout { flex-direction:column !important; }
    .profile-sidebar { width:100% !important; }
  }
`;

/* ─────────────────────────────────────────────────────────────────────────────
   MOCK DATA
───────────────────────────────────────────────────────────────────────────── */
const USER = {
  name: "Kamal Perera",
  email: "kamal.perera@slit.lk",
  phone: "0771234567",
  role: "Student",
  course: "BSc (Hons) in Information Technology",
  studentId: "IT23224834",
  year: "3rd Year",
  joined: "January 2023",
  avatar: null,
};

const STATS = [
  { icon: <UtensilsCrossed size={18} color="#F5A623"/>, label:"Orders Placed",   value:"47" },
  { icon: <Star size={18} color="#F5A623"/>,            label:"Avg. Rating",      value:"4.8" },
  { icon: <Clock size={18} color="#F5A623"/>,           label:"Time Saved",       value:"3.2h" },
  { icon: <Package size={18} color="#F5A623"/>,         label:"Items Reported",   value:"2" },
];

const ACTIVITY = [
  { icon:<UtensilsCrossed size={15}/>, color:"#F5A623", bg:"rgba(245,166,35,.12)", title:"Rice & Chicken Curry", sub:"Main Canteen · Pay on Collect", time:"Today, 12:34 PM",  status:"completed" },
  { icon:<UtensilsCrossed size={15}/>, color:"#F5A623", bg:"rgba(245,166,35,.12)", title:"Chicken Kottu + Iced Milo", sub:"24 Basement · Bank Transfer", time:"Yesterday, 1:10 PM", status:"completed" },
  { icon:<Package size={15}/>,         color:"#60a5fa", bg:"rgba(96,165,250,.12)", title:"Lost: Black Backpack",    sub:"Lost & Found · Block C",        time:"Jun 18, 10:00 AM",  status:"pending" },
  { icon:<UtensilsCrossed size={15}/>, color:"#F5A623", bg:"rgba(245,166,35,.12)", title:"Mixed Fried Rice",        sub:"Main Canteen · Pay on Collect", time:"Jun 17, 12:55 PM",  status:"completed" },
  { icon:<UtensilsCrossed size={15}/>, color:"#F5A623", bg:"rgba(245,166,35,.12)", title:"Spring Rolls + Plain Tea", sub:"24 Basement · Pay on Collect", time:"Jun 16, 3:20 PM",  status:"cancelled" },
];

/* ─────────────────────────────────────────────────────────────────────────────
   NAVBAR
───────────────────────────────────────────────────────────────────────────── */
function Navbar() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav className={`p-nav${scrolled ? " scrolled" : ""}`}>
      {/* Left */}
      <div style={{ display:"flex", alignItems:"center", gap:"14px" }}>
        <button className="btn-back" onClick={() => navigate("/dashboard")}>
          <ArrowLeft size={14}/> Back
        </button>
        <div style={{ width:"1px", height:"22px", background:"rgba(255,255,255,.12)" }}/>
        <img src={unimateLogo} alt="Unimate"
          style={{ height:"36px", width:"auto", objectFit:"contain" }}
          onError={e => { e.target.style.display="none"; e.target.nextSibling.style.display="block"; }}
        />
        <span style={{ display:"none", fontWeight:900, fontSize:"20px", fontFamily:"Manrope,sans-serif", color:"#fff" }}>
          Uni<span style={{ color:"#F5A623" }}>mate</span>
        </span>
      </div>

      {/* Center nav */}
      <div className="desktop-nav" style={{ display:"flex", gap:"clamp(18px,3vw,32px)" }}>
        {["Dashboard","Canteen","Lost & Found","Sports","Clubs","Orders"].map((item,i) => (
          <a key={i} href="#" className="nav-lnk"
            onClick={e => {
              e.preventDefault();
              if (item === "Dashboard") navigate("/dashboard");
              if (item === "Canteen")   navigate("/canteen");
            }}>
            {item}
          </a>
        ))}
      </div>

      {/* Right */}
      <div style={{ display:"flex", alignItems:"center", gap:"4px" }}>
        <button className="icon-btn"><Bell size={19}/></button>
        <div style={{
          width:"38px", height:"38px", borderRadius:"50%", background:"#F5A623",
          display:"flex", alignItems:"center", justifyContent:"center",
          marginLeft:"8px", cursor:"pointer",
          transition:"transform .25s, box-shadow .25s",
          boxShadow:"0 2px 14px rgba(245,166,35,.4)",
          outline:"2.5px solid rgba(245,166,35,.5)"
        }}
          onClick={() => navigate("/profile")}
          onMouseOver={e => { e.currentTarget.style.transform="scale(1.12)"; e.currentTarget.style.boxShadow="0 4px 22px rgba(245,166,35,.65)"; }}
          onMouseOut={e  => { e.currentTarget.style.transform="scale(1)";    e.currentTarget.style.boxShadow="0 2px 14px rgba(245,166,35,.4)"; }}
        >
          <User size={18} color="#07091a"/>
        </div>
      </div>
    </nav>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   CHANGE PASSWORD MODAL
───────────────────────────────────────────────────────────────────────────── */
function ChangePasswordModal({ onClose }) {
  const [form, setForm]     = useState({ current:"", newPw:"", confirm:"" });
  const [show, setShow]     = useState({ current:false, newPw:false, confirm:false });
  const [error, setError]   = useState("");
  const [success, setSuccess] = useState(false);

  const handle = () => {
    if (!form.current)              return setError("Enter your current password.");
    if (form.newPw.length < 6)      return setError("New password must be at least 6 characters.");
    if (form.newPw !== form.confirm) return setError("Passwords do not match.");
    setSuccess(true);
    setTimeout(onClose, 1800);
  };

  const fields = [
    { key:"current", label:"Current Password" },
    { key:"newPw",   label:"New Password" },
    { key:"confirm", label:"Confirm New Password" },
  ];

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div style={{ padding:"22px 24px 0", borderBottom:"1px solid rgba(255,255,255,.07)", paddingBottom:"16px" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
              <div style={{ width:"34px", height:"34px", borderRadius:"10px", background:"rgba(245,166,35,.12)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <Lock size={16} color="#F5A623"/>
              </div>
              <h3 style={{ fontSize:"16px", fontWeight:900, color:"#fff", fontFamily:"Manrope,sans-serif" }}>Change Password</h3>
            </div>
            <button className="icon-btn" onClick={onClose}><X size={18}/></button>
          </div>
        </div>

        <div style={{ padding:"20px 24px 24px" }}>
          {success ? (
            <div style={{ textAlign:"center", padding:"20px 0" }}>
              <div style={{ width:"52px", height:"52px", borderRadius:"50%", background:"rgba(34,197,94,.12)", border:"1.5px solid rgba(34,197,94,.3)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 12px" }}>
                <CheckCircle size={26} color="#22c55e"/>
              </div>
              <p style={{ fontSize:"15px", fontWeight:700, color:"#fff", fontFamily:"Manrope,sans-serif" }}>Password Updated!</p>
              <p style={{ fontSize:"13px", color:"rgba(255,255,255,.45)", marginTop:"4px" }}>Your password has been changed successfully.</p>
            </div>
          ) : (
            <>
              {error && (
                <div style={{ display:"flex", alignItems:"center", gap:"7px", background:"rgba(239,68,68,.08)", border:"1px solid rgba(239,68,68,.2)", borderRadius:"9px", padding:"9px 12px", marginBottom:"14px", fontSize:"12px", color:"#f87171" }}>
                  <AlertTriangle size={13}/> {error}
                </div>
              )}
              {fields.map(f => (
                <div key={f.key} style={{ marginBottom:"12px" }}>
                  <label style={{ fontSize:"11px", fontWeight:700, color:"rgba(255,255,255,.5)", fontFamily:"Manrope,sans-serif", letterSpacing:"0.5px", textTransform:"uppercase", display:"flex", alignItems:"center", gap:"5px", marginBottom:"6px" }}>
                    <Lock size={11}/> {f.label}
                  </label>
                  <div style={{ position:"relative" }}>
                    <input
                      type={show[f.key] ? "text" : "password"}
                      className="p-input" style={{ paddingLeft:"14px", paddingRight:"40px" }}
                      placeholder="••••••••"
                      value={form[f.key]}
                      onChange={e => { setForm(p => ({...p, [f.key]:e.target.value})); setError(""); }}
                    />
                    <button type="button" style={{ position:"absolute", right:"12px", top:"50%", transform:"translateY(-50%)", background:"none", border:"none", color:"rgba(255,255,255,.35)", cursor:"pointer" }}
                      onClick={() => setShow(p => ({...p, [f.key]:!p[f.key]}))}>
                      {show[f.key] ? <EyeOff size={15}/> : <Eye size={15}/>}
                    </button>
                  </div>
                </div>
              ))}
              <button className="btn-primary" style={{ width:"100%", justifyContent:"center", marginTop:"8px", padding:"12px" }} onClick={handle}>
                Update Password
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────────────────────────────────────── */
export default function ProfilePage() {
  const navigate = useNavigate();
  const [tab, setTab]         = useState("overview");
  const [editing, setEditing] = useState(false);
  const [showPwModal, setShowPwModal] = useState(false);
  const [saved, setSaved]     = useState(false);
  const [notifs, setNotifs]   = useState({ orders:true, announcements:true, reminders:false, promotions:false });
  const [form, setForm]       = useState({ name:USER.name, email:USER.email, phone:USER.phone, course:USER.course });

  const handleSave = () => {
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const TABS = [
    { key:"overview",  label:"Overview",  icon:<User size={14}/> },
    { key:"activity",  label:"Activity",  icon:<Clock size={14}/> },
    { key:"settings",  label:"Settings",  icon:<Shield size={14}/> },
  ];

  return (
    <>
      <style>{CSS}</style>
      <div style={{ width:"100%", minHeight:"100vh", background:"#07091a" }}>
        <Navbar/>

        {/* ── Hero banner ── */}
        <div style={{
          background:"linear-gradient(135deg,#07091a 0%,#0c1130 55%,#14193a 100%)",
          paddingTop:"66px", position:"relative", overflow:"hidden",
          borderBottom:"1px solid rgba(255,255,255,.06)"
        }}>
          {/* Ambient orb */}
          <div style={{ position:"absolute", top:0, left:"40%", width:"600px", height:"260px", background:"radial-gradient(ellipse,rgba(245,166,35,.09) 0%,transparent 68%)", animation:"glow 5s ease-in-out infinite", pointerEvents:"none" }}/>
          {/* Left amber bar */}
          <div style={{ position:"absolute", left:0, top:0, bottom:0, width:"4px", background:"linear-gradient(to bottom,#F5A623,rgba(245,166,35,.2))" }}/>

          <div style={{ maxWidth:"1100px", margin:"0 auto", padding:"36px clamp(20px,6vw,60px) 0", position:"relative" }}>
            {/* Avatar + name row */}
            <div style={{ display:"flex", alignItems:"flex-end", gap:"24px", flexWrap:"wrap", marginBottom:"28px" }}>
              {/* Avatar */}
              <div style={{ position:"relative", flexShrink:0 }}>
                <div style={{
                  width:"88px", height:"88px", borderRadius:"50%",
                  background:"linear-gradient(135deg,#F5A623,#f9ba3c)",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  border:"3px solid rgba(245,166,35,.4)",
                  boxShadow:"0 0 0 5px rgba(245,166,35,.1), 0 8px 32px rgba(245,166,35,.3)"
                }}>
                  <User size={38} color="#07091a"/>
                </div>
                {/* Camera badge */}
                <div style={{
                  position:"absolute", bottom:"2px", right:"2px",
                  width:"24px", height:"24px", borderRadius:"50%",
                  background:"#0a0d22", border:"2px solid rgba(245,166,35,.4)",
                  display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer",
                  transition:"all .2s"
                }}
                  onMouseOver={e => { e.currentTarget.style.background="#F5A623"; e.currentTarget.children[0].style.color="#07091a"; }}
                  onMouseOut={e =>  { e.currentTarget.style.background="#0a0d22"; e.currentTarget.children[0].style.color="#F5A623"; }}
                >
                  <Camera size={11} color="#F5A623"/>
                </div>
              </div>

              {/* Name + meta */}
              <div style={{ flex:1, minWidth:0, paddingBottom:"4px" }}>
                <div style={{ display:"flex", alignItems:"center", gap:"10px", flexWrap:"wrap", marginBottom:"6px" }}>
                  <h1 style={{ fontSize:"clamp(20px,3vw,28px)", fontWeight:900, color:"#fff", fontFamily:"Manrope,sans-serif", letterSpacing:"-0.6px" }}>{form.name}</h1>
                  <div style={{ display:"inline-flex", alignItems:"center", gap:"5px", background:"rgba(245,166,35,.12)", border:"1px solid rgba(245,166,35,.25)", borderRadius:"100px", padding:"3px 10px" }}>
                    <GraduationCap size={11} color="#F5A623"/>
                    <span style={{ fontSize:"11px", fontWeight:700, color:"#F5A623", fontFamily:"Manrope,sans-serif" }}>{USER.role}</span>
                  </div>
                </div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:"14px" }}>
                  {[
                    { icon:<BookOpen size={12}/>, text:USER.course },
                    { icon:<GraduationCap size={12}/>, text:`${USER.studentId} · ${USER.year}` },
                    { icon:<Clock size={12}/>, text:`Joined ${USER.joined}` },
                  ].map((m,i) => (
                    <span key={i} style={{ display:"flex", alignItems:"center", gap:"5px", fontSize:"13px", color:"rgba(255,255,255,.5)" }}>
                      <span style={{ color:"#F5A623" }}>{m.icon}</span> {m.text}
                    </span>
                  ))}
                </div>
              </div>

              {/* Edit button */}
              <div style={{ paddingBottom:"6px" }}>
                {editing ? (
                  <div style={{ display:"flex", gap:"8px" }}>
                    <button className="btn-primary" style={{ padding:"9px 18px", fontSize:"13px" }} onClick={handleSave}>
                      <Save size={14}/> Save
                    </button>
                    <button style={{ display:"inline-flex", alignItems:"center", gap:"6px", background:"rgba(255,255,255,.07)", border:"1px solid rgba(255,255,255,.13)", borderRadius:"10px", padding:"9px 14px", color:"rgba(255,255,255,.7)", fontSize:"13px", fontWeight:600, cursor:"pointer", transition:"all .22s" }}
                      onMouseOver={e => e.currentTarget.style.borderColor="rgba(239,68,68,.4)"}
                      onMouseOut={e => e.currentTarget.style.borderColor="rgba(255,255,255,.13)"}
                      onClick={() => setEditing(false)}>
                      <X size={14}/> Cancel
                    </button>
                  </div>
                ) : (
                  <button style={{ display:"inline-flex", alignItems:"center", gap:"7px", background:"rgba(255,255,255,.07)", border:"1px solid rgba(255,255,255,.13)", borderRadius:"10px", padding:"9px 18px", color:"rgba(255,255,255,.75)", fontSize:"13px", fontWeight:600, cursor:"pointer", transition:"all .22s" }}
                    onMouseOver={e => { e.currentTarget.style.borderColor="rgba(245,166,35,.35)"; e.currentTarget.style.color="#F5A623"; }}
                    onMouseOut={e =>  { e.currentTarget.style.borderColor="rgba(255,255,255,.13)"; e.currentTarget.style.color="rgba(255,255,255,.75)"; }}
                    onClick={() => setEditing(true)}>
                    <Edit3 size={14}/> Edit Profile
                  </button>
                )}
              </div>
            </div>

            {/* Stats strip */}
            <div style={{ display:"flex", gap:"0", borderTop:"1px solid rgba(255,255,255,.07)", overflowX:"auto" }}>
              {STATS.map((s,i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:"10px", padding:"16px 24px", borderRight: i<3 ? "1px solid rgba(255,255,255,.07)" : "none", flexShrink:0 }}>
                  <div style={{ width:"34px", height:"34px", borderRadius:"10px", background:"rgba(245,166,35,.1)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                    {s.icon}
                  </div>
                  <div>
                    <div style={{ fontSize:"16px", fontWeight:900, color:"#fff", fontFamily:"Manrope,sans-serif", lineHeight:1.1 }}>{s.value}</div>
                    <div style={{ fontSize:"11px", color:"rgba(255,255,255,.45)", marginTop:"1px" }}>{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div style={{ background:"rgba(7,9,26,.97)", backdropFilter:"blur(16px)", borderBottom:"1px solid rgba(255,255,255,.07)", position:"sticky", top:"66px", zIndex:100 }}>
          <div style={{ maxWidth:"1100px", margin:"0 auto", padding:"0 clamp(20px,6vw,60px)", display:"flex", gap:"4px", overflowX:"auto" }}>
            {TABS.map(t => (
              <button key={t.key} className={`p-tab${tab===t.key?" active":""}`} onClick={() => setTab(t.key)}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Content ── */}
        <div style={{ maxWidth:"1100px", margin:"0 auto", padding:"32px clamp(20px,6vw,60px) 80px" }}>

          {/* ── OVERVIEW TAB ── */}
          {tab === "overview" && (
            <div style={{ display:"flex", gap:"24px", flexWrap:"wrap" }} className="profile-layout">

              {/* Left — personal info */}
              <div style={{ flex:"1 1 340px", display:"flex", flexDirection:"column", gap:"20px" }}>
                <div className="p-card" style={{ animation:"fadeUp .5s ease both" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"20px" }}>
                    <User size={15} color="#F5A623"/>
                    <h3 style={{ fontSize:"14px", fontWeight:800, color:"#fff", fontFamily:"Manrope,sans-serif" }}>Personal Information</h3>
                  </div>

                  {[
                    { icon:<User size={14}/>,          key:"name",   label:"Full Name",     placeholder:"Your full name" },
                    { icon:<Mail size={14}/>,          key:"email",  label:"Email Address",  placeholder:"your@email.com" },
                    { icon:<Phone size={14}/>,         key:"phone",  label:"Phone Number",   placeholder:"07X XXX XXXX" },
                    { icon:<BookOpen size={14}/>,      key:"course", label:"Course",         placeholder:"Your course" },
                  ].map(f => (
                    <div key={f.key} style={{ marginBottom:"14px" }}>
                      <label style={{ fontSize:"11px", fontWeight:700, color:"rgba(255,255,255,.45)", fontFamily:"Manrope,sans-serif", letterSpacing:"0.5px", textTransform:"uppercase", display:"flex", alignItems:"center", gap:"5px", marginBottom:"6px" }}>
                        <span style={{ color:"rgba(245,166,35,.7)" }}>{f.icon}</span> {f.label}
                      </label>
                      <div style={{ position:"relative" }}>
                        <span style={{ position:"absolute", left:"13px", top:"50%", transform:"translateY(-50%)", color:"rgba(255,255,255,.3)", display:"flex" }}>{f.icon}</span>
                        <input
                          className="p-input"
                          disabled={!editing}
                          value={form[f.key]}
                          placeholder={f.placeholder}
                          onChange={e => setForm(p => ({...p, [f.key]:e.target.value}))}
                        />
                      </div>
                    </div>
                  ))}

                  {saved && (
                    <div style={{ display:"flex", alignItems:"center", gap:"7px", background:"rgba(34,197,94,.08)", border:"1px solid rgba(34,197,94,.2)", borderRadius:"9px", padding:"9px 12px", fontSize:"12px", color:"#4ade80", marginTop:"4px", animation:"fadeUp .3s ease" }}>
                      <CheckCircle size={13}/> Profile saved successfully!
                    </div>
                  )}
                </div>

                {/* Student ID card */}
                <div className="p-card" style={{ animation:"fadeUp .5s ease .1s both" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"16px" }}>
                    <GraduationCap size={15} color="#F5A623"/>
                    <h3 style={{ fontSize:"14px", fontWeight:800, color:"#fff", fontFamily:"Manrope,sans-serif" }}>Student Details</h3>
                  </div>
                  {[
                    ["Student ID",  USER.studentId],
                    ["Year",        USER.year],
                    ["Role",        USER.role],
                    ["Member Since",USER.joined],
                  ].map(([l,v],i) => (
                    <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"9px 0", borderBottom: i<3 ? "1px solid rgba(255,255,255,.06)" : "none" }}>
                      <span style={{ fontSize:"13px", color:"rgba(255,255,255,.45)" }}>{l}</span>
                      <span style={{ fontSize:"13px", fontWeight:700, color: i===0 ? "#F5A623" : "rgba(255,255,255,.8)", fontFamily:"Manrope,sans-serif" }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right — recent activity preview */}
              <div style={{ flex:"1 1 300px", display:"flex", flexDirection:"column", gap:"20px" }}>
                <div className="p-card" style={{ animation:"fadeUp .5s ease .15s both" }}>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"16px" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                      <Clock size={15} color="#F5A623"/>
                      <h3 style={{ fontSize:"14px", fontWeight:800, color:"#fff", fontFamily:"Manrope,sans-serif" }}>Recent Activity</h3>
                    </div>
                    <button style={{ fontSize:"12px", color:"#F5A623", background:"none", border:"none", cursor:"pointer", fontWeight:600 }} onClick={() => setTab("activity")}>
                      View all
                    </button>
                  </div>
                  {ACTIVITY.slice(0,3).map((a,i) => (
                    <div key={i} className="activity-item">
                      <div style={{ width:"36px", height:"36px", borderRadius:"10px", background:a.bg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, color:a.color }}>
                        {a.icon}
                      </div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <p style={{ fontSize:"13px", fontWeight:700, color:"#fff", fontFamily:"Manrope,sans-serif", marginBottom:"2px", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{a.title}</p>
                        <p style={{ fontSize:"11px", color:"rgba(255,255,255,.4)" }}>{a.time}</p>
                      </div>
                      <span style={{
                        fontSize:"10px", fontWeight:700, fontFamily:"Manrope,sans-serif",
                        padding:"2px 8px", borderRadius:"100px",
                        background: a.status==="completed" ? "rgba(34,197,94,.12)" : a.status==="pending" ? "rgba(245,166,35,.12)" : "rgba(239,68,68,.12)",
                        color: a.status==="completed" ? "#4ade80" : a.status==="pending" ? "#F5A623" : "#f87171",
                        flexShrink:0
                      }}>
                        {a.status}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Quick links */}
                <div className="p-card" style={{ animation:"fadeUp .5s ease .2s both" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"14px" }}>
                    <Star size={15} color="#F5A623"/>
                    <h3 style={{ fontSize:"14px", fontWeight:800, color:"#fff", fontFamily:"Manrope,sans-serif" }}>Quick Actions</h3>
                  </div>
                  {[
                    { icon:<UtensilsCrossed size={15}/>, label:"Order Food",     action:() => navigate("/canteen") },
                    { icon:<Package size={15}/>,         label:"Lost & Found",   action:() => {} },
                    { icon:<Lock size={15}/>,            label:"Change Password",action:() => setShowPwModal(true) },
                    { icon:<LogOut size={15}/>,          label:"Sign Out",        action:() => navigate("/login"), red:true },
                  ].map((q,i) => (
                    <div key={i} className="setting-row" onClick={q.action}>
                      <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
                        <span style={{ color: q.red ? "#f87171" : "#F5A623" }}>{q.icon}</span>
                        <span style={{ fontSize:"13px", fontWeight:600, color: q.red ? "#f87171" : "rgba(255,255,255,.8)" }}>{q.label}</span>
                      </div>
                      <ChevronRight size={14} color="rgba(255,255,255,.3)"/>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── ACTIVITY TAB ── */}
          {tab === "activity" && (
            <div style={{ animation:"fadeUp .4s ease both" }}>
              <div className="p-card">
                <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"20px" }}>
                  <Clock size={15} color="#F5A623"/>
                  <h3 style={{ fontSize:"15px", fontWeight:800, color:"#fff", fontFamily:"Manrope,sans-serif" }}>All Activity</h3>
                  <span style={{ background:"rgba(245,166,35,.12)", color:"#F5A623", borderRadius:"100px", padding:"2px 10px", fontSize:"11px", fontWeight:700, fontFamily:"Manrope,sans-serif" }}>{ACTIVITY.length}</span>
                </div>
                {ACTIVITY.map((a,i) => (
                  <div key={i} className="activity-item" style={{ animation:`fadeUp .4s ease ${i*.07}s both` }}>
                    <div style={{ width:"40px", height:"40px", borderRadius:"12px", background:a.bg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, color:a.color }}>
                      {a.icon}
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <p style={{ fontSize:"14px", fontWeight:700, color:"#fff", fontFamily:"Manrope,sans-serif", marginBottom:"3px" }}>{a.title}</p>
                      <p style={{ fontSize:"12px", color:"rgba(255,255,255,.45)" }}>{a.sub}</p>
                      <p style={{ fontSize:"11px", color:"rgba(255,255,255,.3)", marginTop:"2px" }}>{a.time}</p>
                    </div>
                    <span style={{
                      fontSize:"11px", fontWeight:700, fontFamily:"Manrope,sans-serif",
                      padding:"3px 10px", borderRadius:"100px", flexShrink:0,
                      background: a.status==="completed" ? "rgba(34,197,94,.12)" : a.status==="pending" ? "rgba(245,166,35,.12)" : "rgba(239,68,68,.12)",
                      color: a.status==="completed" ? "#4ade80" : a.status==="pending" ? "#F5A623" : "#f87171",
                    }}>
                      {a.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── SETTINGS TAB ── */}
          {tab === "settings" && (
            <div style={{ display:"flex", gap:"24px", flexWrap:"wrap", animation:"fadeUp .4s ease both" }}>

              {/* Notifications */}
              <div style={{ flex:"1 1 300px" }}>
                <div className="p-card" style={{ marginBottom:"20px" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"18px" }}>
                    <Bell size={15} color="#F5A623"/>
                    <h3 style={{ fontSize:"14px", fontWeight:800, color:"#fff", fontFamily:"Manrope,sans-serif" }}>Notifications</h3>
                  </div>
                  {[
                    { key:"orders",        label:"Order Updates",        sub:"Get notified when your order is ready" },
                    { key:"announcements", label:"Announcements",         sub:"Campus news and important updates" },
                    { key:"reminders",     label:"Pickup Reminders",      sub:"Reminder before your order pickup time" },
                    { key:"promotions",    label:"Promotions",            sub:"Special offers from campus canteens" },
                  ].map(n => (
                    <div key={n.key} className="setting-row">
                      <div style={{ flex:1 }}>
                        <p style={{ fontSize:"13px", fontWeight:700, color:"#fff", fontFamily:"Manrope,sans-serif", marginBottom:"2px" }}>{n.label}</p>
                        <p style={{ fontSize:"12px", color:"rgba(255,255,255,.4)" }}>{n.sub}</p>
                      </div>
                      <button className={`toggle ${notifs[n.key] ? "on" : "off"}`}
                        onClick={() => setNotifs(p => ({...p, [n.key]:!p[n.key]}))}/>
                    </div>
                  ))}
                </div>
              </div>

              {/* Security */}
              <div style={{ flex:"1 1 300px" }}>
                <div className="p-card" style={{ marginBottom:"20px" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"18px" }}>
                    <Shield size={15} color="#F5A623"/>
                    <h3 style={{ fontSize:"14px", fontWeight:800, color:"#fff", fontFamily:"Manrope,sans-serif" }}>Security</h3>
                  </div>
                  {[
                    { icon:<Lock size={14}/>,  label:"Change Password",   sub:"Update your account password",          action:() => setShowPwModal(true) },
                    { icon:<Shield size={14}/>,label:"Two-Factor Auth",    sub:"Add extra security to your account",    action:() => {} },
                    { icon:<User size={14}/>,  label:"Active Sessions",    sub:"View and manage active login sessions", action:() => {} },
                  ].map((s,i) => (
                    <div key={i} className="setting-row" onClick={s.action}>
                      <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
                        <div style={{ width:"32px", height:"32px", borderRadius:"9px", background:"rgba(245,166,35,.1)", display:"flex", alignItems:"center", justifyContent:"center", color:"#F5A623" }}>
                          {s.icon}
                        </div>
                        <div>
                          <p style={{ fontSize:"13px", fontWeight:700, color:"#fff", fontFamily:"Manrope,sans-serif", marginBottom:"1px" }}>{s.label}</p>
                          <p style={{ fontSize:"11px", color:"rgba(255,255,255,.4)" }}>{s.sub}</p>
                        </div>
                      </div>
                      <ChevronRight size={14} color="rgba(255,255,255,.3)"/>
                    </div>
                  ))}
                </div>

                {/* Danger zone */}
                <div className="p-card" style={{ border:"1.5px solid rgba(239,68,68,.15)" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"14px" }}>
                    <AlertTriangle size={15} color="#f87171"/>
                    <h3 style={{ fontSize:"14px", fontWeight:800, color:"#f87171", fontFamily:"Manrope,sans-serif" }}>Danger Zone</h3>
                  </div>
                  <button style={{
                    width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between",
                    background:"rgba(239,68,68,.07)", border:"1px solid rgba(239,68,68,.2)",
                    borderRadius:"10px", padding:"12px 14px", cursor:"pointer", transition:"all .22s"
                  }}
                    onMouseOver={e => { e.currentTarget.style.background="rgba(239,68,68,.14)"; e.currentTarget.style.borderColor="rgba(239,68,68,.4)"; }}
                    onMouseOut={e =>  { e.currentTarget.style.background="rgba(239,68,68,.07)"; e.currentTarget.style.borderColor="rgba(239,68,68,.2)"; }}
                    onClick={() => navigate("/login")}
                  >
                    <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
                      <LogOut size={15} color="#f87171"/>
                      <div style={{ textAlign:"left" }}>
                        <p style={{ fontSize:"13px", fontWeight:700, color:"#f87171", fontFamily:"Manrope,sans-serif" }}>Sign Out</p>
                        <p style={{ fontSize:"11px", color:"rgba(248,113,113,.6)" }}>Sign out from your account</p>
                      </div>
                    </div>
                    <ChevronRight size={14} color="#f87171"/>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {showPwModal && <ChangePasswordModal onClose={() => setShowPwModal(false)}/>}
      </div>
    </>
  );
}