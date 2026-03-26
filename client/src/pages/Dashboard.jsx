import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight, Play, Clock, LayoutGrid, ShieldCheck,
  LogIn, LayoutList, Eye, Star, ChevronLeft, ChevronRight,
  Calendar, User, MapPin, Phone, Mail,
  Facebook, Twitter, Instagram, Send, BellRing
} from "lucide-react";
import unimateLogo from "../assets/unimatelogo.png";
import AppHeader from "../components/AppHeader";

/* ── Scroll-reveal hook ───────────────────────────────────────────────────── */
function useInView(threshold = 0.12) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

/* ── Global CSS ───────────────────────────────────────────────────────────── */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800;900&family=DM+Sans:ital,wght@0,400;0,500;0,600;1,400&display=swap');

  *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
  html, body, #root {
    width:100%; max-width:100%; overflow-x:hidden;
    scroll-behavior:smooth;
  }
  body { font-family:'DM Sans',system-ui,sans-serif; background:#07091a; }
  a { text-decoration:none; }
  button { font-family:inherit; cursor:pointer; border:none; }

  ::-webkit-scrollbar { width:5px; }
  ::-webkit-scrollbar-track { background:#07091a; }
  ::-webkit-scrollbar-thumb { background:#F5A623; border-radius:3px; }

  /* ── Keyframes ── */
  @keyframes fadeUp   { from{opacity:0;transform:translateY(36px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
  @keyframes float    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
  @keyframes glow     { 0%,100%{opacity:.45} 50%{opacity:1} }
  @keyframes shimmer  { 0%{background-position:200% center} 100%{background-position:-200% center} }
  @keyframes pulse    { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.15);opacity:.8} }
  @keyframes scrollBounce { 0%,100%{transform:translateY(0) translateX(-50%)} 50%{transform:translateY(8px) translateX(-50%)} }
  @keyframes slideDown { from{opacity:0;transform:translateY(-12px)} to{opacity:1;transform:translateY(0)} }

  .u-fadeUp { animation:fadeUp .75s cubic-bezier(.22,.68,0,1.2) both; }
  .u-fadeIn { animation:fadeIn .6s ease both; }

  /* ── Buttons ── */
  .btn-primary {
    display:inline-flex; align-items:center; gap:8px;
    background:#F5A623; color:#07091a; border:none; border-radius:10px;
    padding:14px 28px; font-size:15px; font-weight:800;
    font-family:'Manrope',sans-serif; cursor:pointer;
    transition:transform .22s, box-shadow .22s, background .22s;
    box-shadow:0 4px 24px rgba(245,166,35,.38);
    position:relative; overflow:hidden;
  }
  .btn-primary::after {
    content:''; position:absolute; inset:0;
    background:linear-gradient(110deg,transparent 30%,rgba(255,255,255,.28) 50%,transparent 70%);
    transform:translateX(-100%); transition:transform .55s;
  }
  .btn-primary:hover { transform:translateY(-3px); box-shadow:0 10px 36px rgba(245,166,35,.55); background:#f9ba3c; }
  .btn-primary:hover::after { transform:translateX(100%); }
  .btn-primary:active { transform:translateY(-1px); }

  .btn-ghost {
    display:inline-flex; align-items:center; gap:8px;
    background:rgba(255,255,255,.07); color:#fff;
    border:1px solid rgba(255,255,255,.16); border-radius:10px;
    padding:14px 28px; font-size:15px; font-weight:600;
    cursor:pointer; transition:all .25s;
  }
  .btn-ghost:hover { background:rgba(255,255,255,.13); border-color:rgba(255,255,255,.3); transform:translateY(-2px); }

  /* ── Cards ── */
  .feat-card {
    background:#fff; border-radius:20px; padding:36px 30px;
    text-align:left; box-shadow:0 2px 24px rgba(0,0,0,.07);
    border:1.5px solid transparent;
    transition:transform .3s cubic-bezier(.22,.68,0,1.2), box-shadow .3s, border-color .3s;
  }
  .feat-card:hover { transform:translateY(-7px); box-shadow:0 20px 56px rgba(245,166,35,.12); border-color:rgba(245,166,35,.3); }
  .feat-icon {
    width:54px; height:54px; background:rgba(245,166,35,.1);
    border-radius:14px; display:flex; align-items:center; justify-content:center;
    margin-bottom:20px; transition:background .3s, transform .3s;
  }
  .feat-card:hover .feat-icon { background:#F5A623; transform:rotate(-6deg) scale(1.1); }
  .feat-card:hover .feat-icon svg { color:#07091a !important; stroke:#07091a !important; }

  .svc-card { position:relative; border-radius:20px; overflow:hidden; cursor:pointer; }
  .svc-card img { width:100%; height:100%; object-fit:cover; display:block; transition:transform .55s cubic-bezier(.22,.68,0,1.2); }
  .svc-card:hover img { transform:scale(1.09); }
  .svc-overlay {
    position:absolute; inset:0;
    background:linear-gradient(to top,rgba(7,9,26,.95) 0%,rgba(7,9,26,.42) 55%,transparent 100%);
    transition:background .3s;
  }
  .svc-card:hover .svc-overlay { background:linear-gradient(to top,rgba(7,9,26,1) 0%,rgba(7,9,26,.58) 55%,rgba(7,9,26,.12) 100%); }
  .svc-content { position:absolute; bottom:0; left:0; right:0; padding:26px; transform:translateY(4px); transition:transform .3s; }
  .svc-card:hover .svc-content { transform:translateY(0); }
  .svc-btn {
    display:inline-flex; align-items:center; gap:6px;
    background:#F5A623; color:#07091a; border:none; border-radius:8px;
    padding:9px 18px; font-size:13px; font-weight:800;
    font-family:'Manrope',sans-serif; cursor:pointer;
    transition:transform .2s, box-shadow .2s;
  }
  .svc-btn:hover { transform:translateY(-2px); box-shadow:0 4px 16px rgba(245,166,35,.4); }

  .step-wrap { flex:1; display:flex; flex-direction:column; align-items:center; cursor:default; }
  .step-circle {
    width:82px; height:82px; border:2px solid #F5A623; border-radius:50%;
    background:#fff; display:flex; align-items:center; justify-content:center;
    margin-bottom:16px; box-shadow:0 4px 24px rgba(245,166,35,.18);
    transition:background .3s, transform .3s, box-shadow .3s;
  }
  .step-wrap:hover .step-circle { background:#F5A623; transform:scale(1.12) translateY(-4px); box-shadow:0 10px 36px rgba(245,166,35,.45); }
  .step-wrap:hover .step-circle svg { color:#07091a !important; }

  .order-card {
    background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.08);
    border-radius:20px; padding:26px; text-align:left;
    transition:border-color .3s, background .3s, transform .3s;
  }
  .order-card:hover { border-color:rgba(245,166,35,.45); background:rgba(245,166,35,.04); transform:translateY(-5px); }
  .view-btn {
    display:flex; align-items:center; gap:6px; justify-content:center; width:100%;
    background:none; border:1px solid rgba(245,166,35,.3); color:#F5A623;
    border-radius:10px; padding:10px 16px; font-size:13px; font-weight:600;
    cursor:pointer; transition:background .25s, border-color .25s, transform .2s;
  }
  .view-btn:hover { background:rgba(245,166,35,.12); border-color:#F5A623; transform:translateY(-1px); }

  .ann-card {
    background:#fff; border-radius:20px; padding:30px;
    text-align:left; box-shadow:0 2px 20px rgba(0,0,0,.07);
    display:flex; flex-direction:column; gap:13px;
    transition:transform .3s cubic-bezier(.22,.68,0,1.2), box-shadow .3s;
  }
  .ann-card:hover { transform:translateY(-7px); box-shadow:0 20px 56px rgba(0,0,0,.14); }
  .read-btn {
    display:inline-flex; align-items:center; gap:6px;
    background:none; border:none; color:#F5A623;
    font-size:13px; font-weight:700; font-family:'Manrope',sans-serif;
    cursor:pointer; padding:0; transition:gap .2s;
  }
  .read-btn:hover { gap:10px; }

  .ft-link { display:block; font-size:13px; color:rgba(255,255,255,.42); margin-bottom:10px; transition:color .2s, padding-left .2s; }
  .ft-link:hover { color:#F5A623; padding-left:5px; }
  .soc-btn {
    width:36px; height:36px; background:rgba(255,255,255,.07); border-radius:9px;
    display:flex; align-items:center; justify-content:center;
    color:rgba(255,255,255,.5); transition:background .25s, color .25s, transform .25s;
  }
  .soc-btn:hover { background:#F5A623; color:#07091a; transform:translateY(-3px); }

  .dot { height:8px; border-radius:4px; cursor:pointer; transition:all .35s; }
  .tNav {
    width:40px; height:40px; border-radius:50%; border:1px solid #ddd;
    background:#fff; cursor:pointer; display:flex; align-items:center; justify-content:center;
    box-shadow:0 2px 10px rgba(0,0,0,.08);
    transition:border-color .2s, transform .2s, box-shadow .2s;
  }
  .tNav:hover { border-color:#F5A623; transform:scale(1.1); box-shadow:0 4px 18px rgba(245,166,35,.2); }

  /* ── RESPONSIVE ── */
  @media (max-width: 768px) {
    .hero-btns { flex-direction:column; align-items:stretch !important; }
    .hero-btns button { width:100%; justify-content:center; }
    .services-grid { grid-template-columns:1fr !important; }
    .steps-row { flex-direction:column; gap:32px !important; align-items:center; }
    .steps-connector { display:none !important; }
    .footer-grid { grid-template-columns:1fr 1fr !important; }
    .feat-card { padding:28px 22px; }
    .svc-content { padding:18px; }
    .order-card { padding:20px; }
    .ann-card { padding:22px; }
  }
  @media (max-width: 480px) {
    .footer-grid { grid-template-columns:1fr !important; }
    .orders-grid { grid-template-columns:1fr !important; }
  }

  .dashboard-shell{
    width:100%;
    max-width:100%;
    overflow-x:hidden;
    padding-top:66px;
  }

  @media (max-width: 900px) {
    .dashboard-shell{
      padding-top:66px;
    }
  }

`;



/* ═══════════════════════════════════════════════════════════════════════════
   HERO
═══════════════════════════════════════════════════════════════════════════ */
function Hero() {
  return (
    <section style={{
      width:"100%", minHeight:"100vh",
      background:"linear-gradient(150deg,#07091a 0%,#0c1130 50%,#14193a 100%)",
      display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center",
      textAlign:"center", padding:"clamp(100px,14vw,130px) clamp(20px,6vw,24px) clamp(60px,10vw,100px)",
      position:"relative", overflow:"hidden"
    }}>
      {[
        {top:"18%",left:"50%",tx:"-50%",w:"760px",h:"380px",c:"rgba(245,166,35,.1)",dur:"4s",del:"0s"},
        {top:"65%",left:"12%",tx:"0",w:"320px",h:"320px",c:"rgba(245,166,35,.06)",dur:"6s",del:"2s"},
        {top:"35%",right:"8%",tx:"0",w:"280px",h:"280px",c:"rgba(80,100,255,.07)",dur:"5s",del:"1s"},
      ].map((o,i)=>(
        <div key={i} style={{position:"absolute",top:o.top,left:o.left,right:o.right,transform:`translateX(${o.tx})`,width:o.w,height:o.h,background:`radial-gradient(ellipse,${o.c} 0%,transparent 68%)`,animation:`glow ${o.dur} ease-in-out infinite ${o.del}`,pointerEvents:"none"}}/>
      ))}

      <div className="u-fadeIn" style={{display:"inline-flex",alignItems:"center",gap:"8px",background:"rgba(245,166,35,.11)",border:"1px solid rgba(245,166,35,.25)",borderRadius:"100px",padding:"6px 18px",marginBottom:"30px"}}>
        <div style={{width:"7px",height:"7px",borderRadius:"50%",background:"#F5A623",animation:"pulse 2s infinite"}}/>
        <span style={{fontSize:"12px",fontWeight:700,color:"#F5A623",fontFamily:"Manrope,sans-serif",letterSpacing:".6px"}}>SLIT Campus Platform — Now Live</span>
      </div>

      <h1 className="u-fadeUp" style={{fontSize:"clamp(36px,7.5vw,84px)",fontWeight:900,color:"#fff",lineHeight:1.04,marginBottom:"26px",letterSpacing:"-2.5px",fontFamily:"Manrope,sans-serif",animationDelay:".08s"}}>
        Welcome to{" "}
        <span style={{backgroundImage:"linear-gradient(90deg,#F5A623,#ffd166,#F5A623)",backgroundSize:"200% auto",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",animation:"shimmer 3.5s linear infinite"}}>Unimate</span>
      </h1>

      <p className="u-fadeUp" style={{fontSize:"clamp(15px,2.5vw,18px)",color:"rgba(255,255,255,.58)",maxWidth:"510px",lineHeight:1.8,marginBottom:"12px",animationDelay:".18s"}}>
        Your all-in-one campus platform. Order meals, browse catalogs, and track orders — all in one place.
      </p>
      <p className="u-fadeUp" style={{fontSize:"13px",color:"rgba(255,255,255,.3)",marginBottom:"52px",animationDelay:".26s"}}>
        Built exclusively for SLIT students to make campus life easier.
      </p>

      <div className="u-fadeUp hero-btns" style={{display:"flex",gap:"16px",flexWrap:"wrap",justifyContent:"center",animationDelay:".34s"}}>
        <button className="btn-primary" style={{fontSize:"15px",padding:"15px 32px"}}>Explore Services <ArrowRight size={16}/></button>
        <button className="btn-ghost"   style={{fontSize:"15px",padding:"15px 32px"}}><Play size={15} fill="white"/> How It Works</button>
      </div>

      <div style={{position:"absolute",bottom:"38px",left:"50%",display:"flex",flexDirection:"column",alignItems:"center",gap:"6px",animation:"scrollBounce 2.2s ease-in-out infinite",opacity:.38}}>
        <div style={{width:"1px",height:"44px",background:"linear-gradient(to bottom,transparent,#F5A623)"}}/>
        <span style={{fontSize:"9px",color:"#F5A623",fontWeight:800,letterSpacing:"3px",fontFamily:"Manrope,sans-serif"}}>SCROLL</span>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   WHY UNIMATE
═══════════════════════════════════════════════════════════════════════════ */
function WhyUnimate() {
  const [ref, inView] = useInView();
  const features = [
    {icon:<Clock size={26} color="#F5A623"/>,      title:"Save Time",               desc:"Skip queues and save valuable time. Order ahead, pick up when ready."},
    {icon:<LayoutGrid size={26} color="#F5A623"/>, title:"Everything in One Place", desc:"From canteen to stationery — all campus services in a single platform."},
    {icon:<ShieldCheck size={26} color="#F5A623"/>,title:"Secure & Reliable",       desc:"Built for SLIT students with security and reliability at its core."}
  ];
  return (
    <section ref={ref} style={{width:"100%",background:"#f5f2eb",padding:"clamp(60px,10vw,96px) clamp(20px,6vw,60px)",textAlign:"center"}}>
      <p style={{fontSize:"11px",color:"#bbb",marginBottom:"10px",letterSpacing:"2.5px",textTransform:"uppercase",fontFamily:"Manrope,sans-serif",fontWeight:800}}>We provide the best solution</p>
      <h2 style={{fontSize:"clamp(26px,4vw,44px)",fontWeight:900,color:"#07091a",marginBottom:"56px",letterSpacing:"-1px",fontFamily:"Manrope,sans-serif"}}>Why Unimate?</h2>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:"24px",maxWidth:"1100px",margin:"0 auto"}}>
        {features.map((f,i)=>(
          <div key={i} className="feat-card" style={inView?{animation:`fadeUp .72s cubic-bezier(.22,.68,0,1.2) ${i*.13}s both`}:{opacity:0}}>
            <div className="feat-icon">{f.icon}</div>
            <h3 style={{fontSize:"18px",fontWeight:800,color:"#07091a",marginBottom:"10px",fontFamily:"Manrope,sans-serif"}}>{f.title}</h3>
            <p style={{fontSize:"14px",color:"#777",lineHeight:1.78}}>{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   CORE SERVICES  — updated titles
═══════════════════════════════════════════════════════════════════════════ */
function CoreServices() {
  const navigate = useNavigate();
  const [ref, inView] = useInView();
  const services = [
    {
      title:"Smart Canteen Pre-Ordering",
      desc:"Pre-order your meals and save time at the canteen. Pick up when ready.",
      img:"https://images.unsplash.com/photo-1567521464027-f127ff144326?w=800&q=80",
      nav:"canteen"
    },
    {
      title:"Lost & Found",
      desc:"Report lost items or browse found items on campus. Reunite with your belongings fast.",
      img:"https://images.unsplash.com/photo-1586769852836-bc069f19e1b6?w=800&q=80",
      nav:null
    },
    {
      title:"Clubs",
      desc:"Discover and join student clubs, view upcoming events and stay connected with campus life.",
      img:"https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80",
      nav:null
    },
    {
      title:"Campus Facilities & Services Booking",
      desc:"Access gym, library, labs and all campus facilities through one unified platform.",
      img:"https://images.unsplash.com/photo-1541178735493-479c1a27ed24?w=800&q=80",
      nav:null
    }
  ];
  return (
    <section ref={ref} style={{width:"100%",background:"#0f1428",padding:"clamp(60px,10vw,96px) clamp(20px,6vw,60px)",textAlign:"center"}}>
      <p style={{fontSize:"11px",color:"#F5A623",marginBottom:"10px",letterSpacing:"2.5px",textTransform:"uppercase",fontFamily:"Manrope,sans-serif",fontWeight:800}}>Everything you need, all in one place</p>
      <h2 style={{fontSize:"clamp(26px,4vw,44px)",fontWeight:900,color:"#fff",marginBottom:"52px",letterSpacing:"-1px",fontFamily:"Manrope,sans-serif"}}>Core Services</h2>
      <div className="services-grid" style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:"20px",maxWidth:"1100px",margin:"0 auto"}}>
        {services.map((s,i)=>(
          <div key={i} className="svc-card" style={{
            height:"clamp(200px,30vw,265px)",
            ...(inView?{animation:`fadeUp .72s cubic-bezier(.22,.68,0,1.2) ${i*.11}s both`}:{opacity:0})
          }}
            onClick={()=> s.nav && navigate("/" + s.nav)}
          >
            <img src={s.img} alt={s.title}/>
            <div className="svc-overlay"/>
            <div className="svc-content">
              <h3 style={{fontSize:"clamp(14px,2.5vw,18px)",fontWeight:800,color:"#fff",marginBottom:"8px",fontFamily:"Manrope,sans-serif"}}>{s.title}</h3>
              <p style={{fontSize:"clamp(11px,1.8vw,13px)",color:"rgba(255,255,255,.62)",lineHeight:1.58,marginBottom:"14px"}}>{s.desc}</p>
              <button className="svc-btn" onClick={e=>{e.stopPropagation(); s.nav && navigate("/" + s.nav);}}>
                View Service <ArrowRight size={13}/>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   HOW IT WORKS
═══════════════════════════════════════════════════════════════════════════ */
function HowItWorks() {
  const [ref, inView] = useInView();
  const steps = [
    {icon:<LogIn size={26}/>,      num:"1", title:"Sign In",         desc:"Log in securely with your SLIT student credentials."},
    {icon:<LayoutList size={26}/>, num:"2", title:"Pick a Service",  desc:"Choose from canteen, lost & found, event booking or facilities."},
    {icon:<Send size={26}/>,       num:"3", title:"Submit or Book",  desc:"Pre-order food, report an item, or reserve a venue in seconds."},
    {icon:<BellRing size={26}/>,   num:"4", title:"Get Notified",    desc:"Receive real-time updates and alerts right on the platform."}
  ];
  return (
    <section ref={ref} style={{width:"100%",background:"#f5f2eb",padding:"clamp(60px,10vw,96px) clamp(20px,6vw,60px)",textAlign:"center"}}>
      <p style={{fontSize:"11px",color:"#bbb",marginBottom:"10px",letterSpacing:"2.5px",textTransform:"uppercase",fontFamily:"Manrope,sans-serif",fontWeight:800}}>Simple steps to use any service</p>
      <h2 style={{fontSize:"clamp(26px,4vw,44px)",fontWeight:900,color:"#07091a",marginBottom:"70px",letterSpacing:"-1px",fontFamily:"Manrope,sans-serif"}}>How It Works</h2>
      <div className="steps-row" style={{display:"flex",justifyContent:"center",maxWidth:"920px",margin:"0 auto",position:"relative",gap:0}}>
        <div className="steps-connector" style={{position:"absolute",top:"40px",left:"13%",right:"13%",height:"2px",background:"linear-gradient(90deg,transparent,rgba(245,166,35,.35),rgba(245,166,35,.35),transparent)",zIndex:0}}/>
        {steps.map((s,i)=>(
          <div key={i} className="step-wrap" style={{position:"relative",zIndex:1,...(inView?{animation:`fadeUp .72s cubic-bezier(.22,.68,0,1.2) ${i*.13}s both`}:{opacity:0})}}>
            <div className="step-circle">
              <span style={{color:"#F5A623",transition:"color .3s"}}>{s.icon}</span>
            </div>
            <div style={{fontSize:"11px",fontWeight:800,color:"#F5A623",marginBottom:"6px",fontFamily:"Manrope,sans-serif",letterSpacing:"1px"}}>STEP {s.num}</div>
            <h4 style={{fontSize:"clamp(14px,2vw,16px)",fontWeight:800,color:"#07091a",marginBottom:"8px",fontFamily:"Manrope,sans-serif"}}>{s.title}</h4>
            <p style={{fontSize:"13px",color:"#888",lineHeight:1.68,maxWidth:"128px"}}>{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ACTIVE ORDERS
═══════════════════════════════════════════════════════════════════════════ */
function ActiveOrders() {
  const [ref, inView] = useInView();
  const orders = [
    {type:"Canteen Order",     status:"Confirmed", sc:"#22c55e", sb:"rgba(34,197,94,.12)",  item:"Chicken Rice, Orange Juice",  price:"Rs. 450.00", time:"10 mins ago"},
    {type:"Printing Job (A4)", status:"Pending",   sc:"#F5A623", sb:"rgba(245,166,35,.12)", item:"12 pages, Double-sided",       price:"Rs. 125.00", time:"20 mins ago"},
    {type:"Sport Booking",     status:"Confirmed", sc:"#22c55e", sb:"rgba(34,197,94,.12)",  item:"Basketball Court – 2 hours",  price:"Rs. 300.00", time:"1 hour ago"}
  ];
  return (
    <section ref={ref} style={{width:"100%",background:"#07091a",padding:"clamp(60px,10vw,96px) clamp(20px,6vw,60px)",textAlign:"center"}}>
      <p style={{fontSize:"11px",color:"#F5A623",marginBottom:"10px",letterSpacing:"2.5px",textTransform:"uppercase",fontFamily:"Manrope,sans-serif",fontWeight:800}}>Your recent activity across all campus services</p>
      <h2 style={{fontSize:"clamp(26px,4vw,44px)",fontWeight:900,color:"#fff",marginBottom:"52px",letterSpacing:"-1px",fontFamily:"Manrope,sans-serif"}}>Recent Activity & Bookings</h2>
      <div className="orders-grid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(270px,1fr))",gap:"20px",maxWidth:"1100px",margin:"0 auto 44px"}}>
        {orders.map((o,i)=>(
          <div key={i} className="order-card" style={inView?{animation:`fadeUp .72s cubic-bezier(.22,.68,0,1.2) ${i*.13}s both`}:{opacity:0}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"14px"}}>
              <span style={{fontSize:"14px",fontWeight:800,color:"#fff",fontFamily:"Manrope,sans-serif"}}>{o.type}</span>
              <span style={{fontSize:"11px",fontWeight:700,color:o.sc,background:o.sb,padding:"4px 12px",borderRadius:"100px",fontFamily:"Manrope,sans-serif"}}>{o.status}</span>
            </div>
            <p style={{fontSize:"13px",color:"rgba(255,255,255,.48)",marginBottom:"18px",lineHeight:1.65}}>{o.item}</p>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"20px"}}>
              <span style={{fontSize:"19px",fontWeight:900,color:"#F5A623",fontFamily:"Manrope,sans-serif"}}>{o.price}</span>
              <div style={{display:"flex",alignItems:"center",gap:"4px",color:"rgba(255,255,255,.3)",fontSize:"12px"}}>
                <Clock size={12}/> {o.time}
              </div>
            </div>
            <button className="view-btn"><Eye size={14}/> View Details</button>
          </div>
        ))}
      </div>
      <button className="btn-primary" style={{fontSize:"15px",padding:"15px 40px"}}>View All Orders <ArrowRight size={16}/></button>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   TESTIMONIALS
═══════════════════════════════════════════════════════════════════════════ */
function Testimonials() {
  const [cur, setCur] = useState(0);
  const [fading, setFading] = useState(false);
  const reviews = [
    {text:'"Unimate has completely transformed my campus experience! No more waiting in long queues at the canteen. I can order my lunch between classes and pick it up when ready. Absolute game-changer!"', name:"Arua Silva",       course:"Computer Science"},
    {text:'"Booking the basketball court used to take forever. Now I do it in seconds on Unimate. The whole campus services experience has leveled up incredibly!"',                                         name:"Kamal Perera",     course:"Software Engineering"},
    {text:'"Printing submissions is so much easier now. I send files from my phone and collect them when ready. Unimate is a must for every SLIT student."',                                               name:"Nimasha Fernando", course:"IT Management"}
  ];
  const go = idx => {
    if (fading) return;
    setFading(true);
    setTimeout(()=>{ setCur(idx); setFading(false); }, 280);
  };
  return (
    <section style={{width:"100%",background:"#f5f2eb",padding:"clamp(60px,10vw,96px) clamp(20px,6vw,60px)",textAlign:"center"}}>
      <p style={{fontSize:"11px",color:"#bbb",marginBottom:"10px",letterSpacing:"2.5px",textTransform:"uppercase",fontFamily:"Manrope,sans-serif",fontWeight:800}}>Real feedback from our campus community</p>
      <h2 style={{fontSize:"clamp(26px,4vw,44px)",fontWeight:900,color:"#07091a",marginBottom:"52px",letterSpacing:"-1px",fontFamily:"Manrope,sans-serif"}}>What Students Say</h2>
      <div style={{maxWidth:"680px",margin:"0 auto",background:"#fff",borderRadius:"26px",padding:"clamp(28px,6vw,52px)",boxShadow:"0 10px 70px rgba(0,0,0,.1)",border:"1.5px solid rgba(245,166,35,.12)",transition:"opacity .28s",opacity:fading?0:1}}>
        <div style={{display:"flex",justifyContent:"center",gap:"4px",marginBottom:"28px"}}>
          {[...Array(5)].map((_,i)=><Star key={i} size={20} fill="#F5A623" color="#F5A623"/>)}
        </div>
        <p style={{fontSize:"clamp(14px,2.5vw,17px)",color:"#444",lineHeight:1.88,fontStyle:"italic",marginBottom:"38px",fontFamily:"DM Sans,sans-serif"}}>{reviews[cur].text}</p>
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:"14px"}}>
          <div style={{width:"46px",height:"46px",borderRadius:"50%",background:"#F5A623",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"19px",fontWeight:900,color:"#07091a",fontFamily:"Manrope,sans-serif"}}>{reviews[cur].name[0]}</div>
          <div style={{textAlign:"left"}}>
            <div style={{fontSize:"15px",fontWeight:800,color:"#07091a",fontFamily:"Manrope,sans-serif"}}>{reviews[cur].name}</div>
            <div style={{fontSize:"13px",color:"#aaa"}}>{reviews[cur].course}</div>
          </div>
        </div>
      </div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:"12px",marginTop:"36px"}}>
        <button className="tNav" onClick={()=>go((cur-1+reviews.length)%reviews.length)}><ChevronLeft size={17}/></button>
        {reviews.map((_,i)=>(
          <div key={i} className="dot" onClick={()=>go(i)} style={{width:i===cur?"28px":"8px",background:i===cur?"#F5A623":"#ccc"}}/>
        ))}
        <button className="tNav" onClick={()=>go((cur+1)%reviews.length)}><ChevronRight size={17}/></button>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ANNOUNCEMENTS
═══════════════════════════════════════════════════════════════════════════ */
function Announcements() {
  const [ref, inView] = useInView();
  const items = [
    {tag:"Exam",   tc:"#3b82f6", tb:"rgba(59,130,246,.1)",  title:"Exam Week Closing Support",      desc:"Extended canteen hours during your exams. Order online for quick pickup during exam week.",      date:"Jul 5, 2024", author:"Admin Support"},
    {tag:"New",    tc:"#22c55e", tb:"rgba(34,197,94,.1)",   title:"Now: Added 24 Basement Canteen", desc:"We partnered with the new Basement canteen for more food choices and faster service.",           date:"Jul 4, 2024", author:"Canteen Team"},
    {tag:"Update", tc:"#F5A623", tb:"rgba(245,166,35,.1)",  title:"Gym Booking Now Updated",        desc:"Track your gym sessions through Unimate. New equipment and extended hours available.",           date:"Jul 3, 2024", author:"Sports Council"}
  ];
  return (
    <section ref={ref} style={{width:"100%",background:"#eae6dd",padding:"clamp(60px,10vw,96px) clamp(20px,6vw,60px)",textAlign:"center"}}>
      <p style={{fontSize:"11px",color:"#bbb",marginBottom:"10px",letterSpacing:"2.5px",textTransform:"uppercase",fontFamily:"Manrope,sans-serif",fontWeight:800}}>Stay updated with the latest news</p>
      <h2 style={{fontSize:"clamp(26px,4vw,44px)",fontWeight:900,color:"#07091a",marginBottom:"52px",letterSpacing:"-1px",fontFamily:"Manrope,sans-serif"}}>Campus Announcements</h2>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:"24px",maxWidth:"1100px",margin:"0 auto"}}>
        {items.map((a,i)=>(
          <div key={i} className="ann-card" style={inView?{animation:`fadeUp .72s cubic-bezier(.22,.68,0,1.2) ${i*.13}s both`}:{opacity:0}}>
            <span style={{display:"inline-block",fontSize:"11px",fontWeight:800,color:a.tc,background:a.tb,padding:"4px 13px",borderRadius:"100px",alignSelf:"flex-start",fontFamily:"Manrope,sans-serif"}}>{a.tag}</span>
            <h3 style={{fontSize:"16px",fontWeight:800,color:"#07091a",fontFamily:"Manrope,sans-serif"}}>{a.title}</h3>
            <p style={{fontSize:"13px",color:"#777",lineHeight:1.78}}>{a.desc}</p>
            <div style={{display:"flex",gap:"16px",color:"#bbb",fontSize:"12px",flexWrap:"wrap"}}>
              <span style={{display:"flex",alignItems:"center",gap:"4px"}}><Calendar size={12}/> {a.date}</span>
              <span style={{display:"flex",alignItems:"center",gap:"4px"}}><User size={12}/> {a.author}</span>
            </div>
            <button className="read-btn">Read More <ArrowRight size={14}/></button>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   FOOTER
═══════════════════════════════════════════════════════════════════════════ */
function Footer() {
  return (
    <footer style={{width:"100%",background:"#04060f",padding:"clamp(40px,8vw,72px) clamp(20px,6vw,60px) 32px",borderTop:"1px solid rgba(255,255,255,.06)"}}>
      <div className="footer-grid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:"clamp(24px,4vw,48px)",maxWidth:"1200px",margin:"0 auto",paddingBottom:"clamp(32px,6vw,48px)",borderBottom:"1px solid rgba(255,255,255,.07)"}}>
        {/* Brand */}
        <div>
          <div style={{marginBottom:"16px"}}>
            <img src={unimateLogo} alt="Unimate" style={{height:"36px",width:"auto",objectFit:"contain"}}
              onError={e=>{
                e.target.style.display="none";
                e.target.nextSibling.style.display="flex";
              }}
            />
            <div style={{display:"none",alignItems:"center",gap:"8px"}}>
              <div style={{width:"32px",height:"32px",background:"#F5A623",borderRadius:"8px",display:"flex",alignItems:"center",justifyContent:"center"}}>
                <span style={{color:"#07091a",fontWeight:900,fontSize:"15px",fontFamily:"Manrope,sans-serif"}}>U</span>
              </div>
              <span style={{color:"#fff",fontWeight:900,fontSize:"18px",fontFamily:"Manrope,sans-serif"}}>Uni<span style={{color:"#F5A623"}}>mate</span></span>
            </div>
          </div>
          <p style={{fontSize:"13px",color:"rgba(255,255,255,.38)",lineHeight:1.88,marginBottom:"24px"}}>Your all-in-one campus platform. Making student life easier at SLIT.</p>
          <div style={{display:"flex",gap:"10px"}}>
            {[Facebook,Twitter,Instagram].map((Icon,i)=>(
              <a key={i} href="#" className="soc-btn"><Icon size={15}/></a>
            ))}
          </div>
        </div>
        {/* Quick Links */}
        <div>
          <h4 style={{fontSize:"12px",fontWeight:800,color:"rgba(255,255,255,.5)",marginBottom:"22px",fontFamily:"Manrope,sans-serif",letterSpacing:"1.5px",textTransform:"uppercase"}}>Quick Links</h4>
          {["Dashboard","Canteen","Lost & Found","Sports","Clubs","Orders"].map(l=><a key={l} href="#" className="ft-link">{l}</a>)}
        </div>
        {/* Support */}
        <div>
          <h4 style={{fontSize:"12px",fontWeight:800,color:"rgba(255,255,255,.5)",marginBottom:"22px",fontFamily:"Manrope,sans-serif",letterSpacing:"1.5px",textTransform:"uppercase"}}>Support</h4>
          {["Help Center","Contact Us","Privacy Policy","Terms of Service"].map(l=><a key={l} href="#" className="ft-link">{l}</a>)}
        </div>
        {/* Contact */}
        <div>
          <h4 style={{fontSize:"12px",fontWeight:800,color:"rgba(255,255,255,.5)",marginBottom:"22px",fontFamily:"Manrope,sans-serif",letterSpacing:"1.5px",textTransform:"uppercase"}}>Contact</h4>
          <div style={{display:"flex",flexDirection:"column",gap:"14px"}}>
            {[[MapPin,"SLIT, Maradana, Colombo 10"],[Phone,"+94 112 635 988"],[Mail,"support@unimate.lk"]].map(([Icon,text],i)=>(
              <div key={i} style={{display:"flex",gap:"10px",alignItems:"flex-start"}}>
                <Icon size={14} color="#F5A623" style={{marginTop:"2px",flexShrink:0}}/>
                <span style={{fontSize:"13px",color:"rgba(255,255,255,.38)",lineHeight:1.65}}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{maxWidth:"1200px",margin:"0 auto",paddingTop:"28px",display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:"10px"}}>
        <p style={{fontSize:"12px",color:"rgba(255,255,255,.2)"}}>© 2024 Unimate. All rights reserved.</p>
        <p style={{fontSize:"12px",color:"rgba(255,255,255,.2)"}}>Built exclusively for SLIT students</p>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ROOT EXPORT
═══════════════════════════════════════════════════════════════════════════ */
export default function Dashboard() {
  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <AppHeader />
      <div className="dashboard-shell">
        <Hero />
        <WhyUnimate />
        <CoreServices />
        <HowItWorks />
        <ActiveOrders />
        <Testimonials />
        <Announcements />
        <Footer />
      </div>
    </>
  );
}