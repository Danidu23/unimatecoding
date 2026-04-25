import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  UtensilsCrossed, MapPin, Zap, Heart,
  Users, ArrowRight, Clock, Star, TrendingUp, Shield
} from "lucide-react";
import AppHeader from "../components/AppHeader";

/* ── Intersection observer hook ─────────────────────────────────── */
function useInView(threshold = 0.1) {
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

/* ── Animated counter ────────────────────────────────────────────── */
function Counter({ to, suffix = "", duration = 1600 }) {
  const [val, setVal] = useState(0);
  const [ref, inView] = useInView(0.3);
  useEffect(() => {
    if (!inView) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setVal(Math.floor(p * to));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, to, duration]);
  return <span ref={ref}>{val}{suffix}</span>;
}

/* ── Page CSS ────────────────────────────────────────────────────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@200;400;600;800;900&display=swap');

  .sp-root {
    width: 100%;
    overflow-x: hidden;
    background: #07091a;
    color: #fff;
    font-family: 'Manrope', system-ui, sans-serif;
  }

  /* ── ambient background orbs ── */
  .sp-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(90px);
    pointer-events: none;
    z-index: 0;
  }

  /* ── HERO ── */
  .sp-hero {
    position: relative;
    min-height: 72vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 130px 24px 90px;
    overflow: hidden;
  }

  .sp-hero-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px 18px;
    border-radius: 999px;
    border: 1px solid rgba(245,166,35,0.30);
    background: rgba(245,166,35,0.07);
    color: #F5A623;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: .08em;
    text-transform: uppercase;
    margin-bottom: 28px;
    position: relative;
    z-index: 1;
  }

  .sp-hero-eyebrow-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #F5A623;
    animation: sp-pulse 2s infinite;
  }

  @keyframes sp-pulse {
    0%,100% { opacity: 1; transform: scale(1); }
    50%      { opacity: .4; transform: scale(.7); }
  }

  .sp-hero h1 {
    font-family: 'Manrope', sans-serif;
    font-size: clamp(48px, 8vw, 96px);
    font-weight: 900;
    line-height: 1.0;
    color: #fff;
    position: relative;
    z-index: 1;
    margin: 0 0 22px;
  }

  .sp-hero h1 .sp-grad {
    background: linear-gradient(135deg, #F5A623 0%, #FFD580 55%, #F5A623 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .sp-hero-sub {
    max-width: 480px;
    color: rgba(255,255,255,0.55);
    font-size: 17px;
    line-height: 1.7;
    position: relative;
    z-index: 1;
    margin: 0 auto 40px;
  }

  .sp-hero-cta {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 14px 32px;
    border-radius: 12px;
    background: #F5A623;
    color: #07091a;
    font-weight: 800;
    font-size: 15px;
    border: none;
    cursor: pointer;
    position: relative;
    z-index: 1;
    transition: transform .2s, box-shadow .2s;
  }

  .sp-hero-cta:hover {
    transform: translateY(-3px);
    box-shadow: 0 14px 36px rgba(245,166,35,.4);
  }

  /* ── STAT STRIP ── */
  .sp-stats {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0;
    max-width: 960px;
    margin: 0 auto;
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 20px;
    background: rgba(255,255,255,0.025);
    backdrop-filter: blur(12px);
    overflow: hidden;
  }

  .sp-stat-item {
    flex: 1 1 160px;
    padding: 32px 20px;
    text-align: center;
    border-right: 1px solid rgba(255,255,255,0.07);
  }

  .sp-stat-item:last-child { border-right: none; }

  .sp-stat-num {
    font-family: 'Manrope', sans-serif;
    font-size: 36px;
    font-weight: 900;
    color: #F5A623;
    line-height: 1;
    margin-bottom: 6px;
  }

  .sp-stat-label {
    font-size: 13px;
    color: rgba(255,255,255,0.45);
    font-weight: 500;
  }

  /* ── SECTION LABEL ── */
  .sp-section-label {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: .12em;
    text-transform: uppercase;
    color: #F5A623;
    margin-bottom: 16px;
  }

  .sp-section-label::before {
    content: '';
    flex: 0 0 30px;
    height: 1px;
    background: #F5A623;
  }

  /* ── HIGHLIGHTS ROW ── */
  .sp-highlights {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
  }

  .sp-highlight-card {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 20px 22px;
    border-radius: 16px;
    border: 1px solid rgba(255,255,255,0.06);
    background: rgba(255,255,255,0.025);
    transition: border-color .3s, background .3s;
  }

  .sp-highlight-card:hover {
    border-color: rgba(245,166,35,0.25);
    background: rgba(245,166,35,0.05);
  }

  .sp-highlight-icon-wrap {
    width: 44px; height: 44px;
    border-radius: 12px;
    background: rgba(245,166,35,0.12);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    color: #F5A623;
  }

  /* ── SERVICE CARDS GRID ── */
  .sp-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(310px, 1fr));
    gap: 24px;
  }

  .sp-card {
    position: relative;
    border-radius: 22px;
    padding: 32px 28px;
    border: 1px solid rgba(255,255,255,0.07);
    background: rgba(255,255,255,0.03);
    cursor: pointer;
    overflow: hidden;
    transition: transform .35s cubic-bezier(.22,.9,.36,1),
                border-color .35s, box-shadow .35s;
  }

  .sp-card::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 22px;
    background: radial-gradient(ellipse at 20% 20%, rgba(245,166,35,0.1) 0%, transparent 65%);
    opacity: 0;
    transition: opacity .35s;
  }

  .sp-card:hover::before { opacity: 1; }

  .sp-card:hover {
    transform: translateY(-10px);
    border-color: rgba(245,166,35,0.30);
    box-shadow: 0 28px 60px rgba(245,166,35,0.10);
  }

  /* big faint number in bg */
  .sp-card-num {
    position: absolute;
    top: 16px;
    right: 20px;
    font-family: 'Manrope', sans-serif;
    font-size: 64px;
    font-weight: 900;
    color: rgba(245,166,35,0.06);
    line-height: 1;
    pointer-events: none;
    user-select: none;
    transition: color .35s;
  }

  .sp-card:hover .sp-card-num { color: rgba(245,166,35,0.12); }

  .sp-card-icon {
    width: 60px; height: 60px;
    border-radius: 16px;
    background: rgba(245,166,35,0.10);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
    transition: background .35s, transform .35s;
    position: relative;
    z-index: 1;
  }

  .sp-card:hover .sp-card-icon {
    background: #F5A623;
    transform: rotate(-6deg) scale(1.08);
  }

  .sp-card:hover .sp-card-icon svg { color: #07091a !important; }

  .sp-card-title {
    font-family: 'Manrope', sans-serif;
    font-size: 18px;
    font-weight: 800;
    color: #fff;
    margin-bottom: 8px;
    position: relative;
    z-index: 1;
  }

  .sp-card-desc {
    font-size: 14px;
    color: rgba(255,255,255,0.50);
    line-height: 1.65;
    margin-bottom: 18px;
    position: relative;
    z-index: 1;
  }

  /* feature pills */
  .sp-pills {
    display: flex;
    flex-wrap: wrap;
    gap: 7px;
    margin-bottom: 24px;
    position: relative;
    z-index: 1;
  }

  .sp-pill {
    padding: 4px 12px;
    border-radius: 999px;
    background: rgba(245,166,35,0.08);
    border: 1px solid rgba(245,166,35,0.15);
    color: rgba(255,255,255,0.60);
    font-size: 12px;
    font-weight: 500;
  }

  .sp-card-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 11px 20px;
    border-radius: 10px;
    background: transparent;
    border: 1px solid rgba(245,166,35,0.30);
    color: #F5A623;
    font-weight: 700;
    font-size: 13px;
    cursor: pointer;
    position: relative;
    z-index: 1;
    transition: background .25s, border-color .25s, transform .25s;
  }

  .sp-card:hover .sp-card-btn {
    background: #F5A623;
    border-color: #F5A623;
    color: #07091a;
    transform: translateX(4px);
  }

  /* ── DIVIDER LINE ── */
  .sp-divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(245,166,35,0.20), transparent);
    margin: 0;
    border: none;
  }

  /* ── BOTTOM BANNER ── */
  .sp-banner {
    position: relative;
    border-radius: 24px;
    overflow: hidden;
    padding: 60px 40px;
    text-align: center;
    background: rgba(245,166,35,0.06);
    border: 1px solid rgba(245,166,35,0.15);
  }

  .sp-banner h2 {
    font-family: 'Manrope', sans-serif;
    font-size: clamp(28px,4vw,46px);
    font-weight: 900;
    color: #fff;
    margin-bottom: 12px;
  }

  .sp-banner p {
    color: rgba(255,255,255,0.50);
    max-width: 380px;
    margin: 0 auto 32px;
    font-size: 15px;
    line-height: 1.6;
  }

  /* ── FADE-UP ANIMATION ── */
  .sp-fade { opacity: 0; transform: translateY(28px); }
  .sp-fade.sp-in { opacity: 1; transform: translateY(0); transition: opacity .7s ease, transform .7s ease; }
`;

/* ── Data ──────────────────────────────────────────────────────────── */
const SERVICES = [
  {
    icon: <UtensilsCrossed size={28} color="#F5A623" />,
    title: "Smart Canteen Pre-Ordering",
    desc: "Skip the queues. Browse the menu, pre-order, and track your meal in real time — all from your phone.",
    features: ["Menu browsing", "Pre-order meals", "Live tracking", "Digital payments"],
    route: "/canteen"
  },
  {
    icon: <MapPin size={28} color="#F5A623" />,
    title: "Lost & Found",
    desc: "Misplaced something? Report it instantly or browse found items and connect with the finder directly.",
    features: ["Report items", "Browse finds", "Direct chat", "Tracking system"],
    route: "/lost-found/browse"
  },
  {
    icon: <Zap size={28} color="#F5A623" />,
    title: "Sports Facility Booking",
    desc: "Live court availability. Instant reservations. Zero phone calls.",
    features: ["Check availability", "Book slots", "Manage bookings", "Instant updates"],
    route: "/sports/browse"
  },
  {
    icon: <Heart size={28} color="#F5A623" />,
    title: "Stationery Shop",
    desc: "Order campus essentials at student prices with lightning-fast pickup from store partners.",
    features: ["Wide products", "Student pricing", "Fast pickup", "Easy ordering"],
    route: "/stationery"
  },
  {
    icon: <Users size={28} color="#F5A623" />,
    title: "Community Board",
    desc: "Your campus social hub. Share updates, discover events, and connect with fellow students.",
    features: ["Posts & events", "Peer chat", "Campus news", "Clubs & groups"],
    route: "/community"
  }
];

const HIGHLIGHTS = [
  { icon: <Clock size={20} />, title: "Time-Saving", desc: "No queues, no stress" },
  { icon: <Shield size={20} />, title: "Secure Platform", desc: "Safe for all students" },
  { icon: <TrendingUp size={20} />, title: "Always Growing", desc: "New features weekly" },
  { icon: <Star size={20} />, title: "Highly Trusted", desc: "10 000+ active users" }
];

const STATS = [
  { to: 10, suffix: "k+", label: "Active Students" },
  { to: 5, suffix: " Services", label: "Campus Solutions" },
  { to: 98, suffix: "%", label: "Satisfaction Rate" },
  { to: 3, suffix: "min", label: "Avg. Save Time / Visit" }
];

/* ── FadeUp wrapper ─────────────────────────────────────────────── */
function FadeUp({ delay = 0, children }) {
  const [ref, inView] = useInView(0.08);
  return (
    <div
      ref={ref}
      className={`sp-fade ${inView ? "sp-in" : ""}`}
      style={{ transitionDelay: inView ? `${delay}s` : "0s" }}
    >
      {children}
    </div>
  );
}

/* ── Component ──────────────────────────────────────────────────── */
export default function ServicesPage() {
  const navigate = useNavigate();

  return (
    <>
      <style>{CSS}</style>
      <div className="sp-root">
        <AppHeader />

        {/* ── HERO ───────────────────────────────────────────────── */}
        <section className="sp-hero">
          {/* ambient orbs */}
          <div className="sp-orb" style={{ width:600, height:600, top:-200, left:-180, background:"rgba(245,166,35,0.07)" }} />
          <div className="sp-orb" style={{ width:400, height:400, bottom:-100, right:-100, background:"rgba(245,166,35,0.05)" }} />

          <div className="sp-hero-eyebrow">
            <span className="sp-hero-eyebrow-dot" />
            Campus Life, Simplified
          </div>

          <h1>
            One App.<br />
            <span className="sp-grad">Endless&nbsp;Services.</span>
          </h1>

          <p className="sp-hero-sub">
            Everything you need to thrive on campus — food, sports, lost items, stationery, and community — in a single seamless platform.
          </p>

          <button className="sp-hero-cta" onClick={() => document.getElementById("sp-services-section")?.scrollIntoView({ behavior:"smooth" })}>
            Explore All Services <ArrowRight size={16} />
          </button>
        </section>

        {/* ── STATS ─────────────────────────────────────────────── */}
        <div style={{ padding: "0 24px 80px", maxWidth: 1100, margin: "0 auto" }}>
          <FadeUp>
            <div className="sp-stats">
              {STATS.map((s, i) => (
                <div className="sp-stat-item" key={i}>
                  <div className="sp-stat-num">
                    <Counter to={s.to} suffix={s.suffix} />
                  </div>
                  <div className="sp-stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>

        <hr className="sp-divider" />

        {/* ── HIGHLIGHTS ────────────────────────────────────────── */}
        <section style={{ padding: "80px 24px", maxWidth: 1100, margin: "0 auto" }}>
          <FadeUp>
            <div className="sp-section-label">Why UniHub</div>
          </FadeUp>
          <FadeUp delay={0.05}>
            <h2 style={{ fontFamily:"'Manrope',sans-serif", fontWeight:800, fontSize:"clamp(26px,4vw,40px)", marginBottom:40 }}>
              Built for students,<br />by students.
            </h2>
          </FadeUp>

          <div className="sp-highlights">
            {HIGHLIGHTS.map((h, i) => (
              <FadeUp key={i} delay={i * 0.07}>
                <div className="sp-highlight-card">
                  <div className="sp-highlight-icon-wrap">{h.icon}</div>
                  <div>
                    <div style={{ fontWeight:700, fontSize:14, marginBottom:3 }}>{h.title}</div>
                    <div style={{ fontSize:13, color:"rgba(255,255,255,0.45)" }}>{h.desc}</div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </section>

        <hr className="sp-divider" />

        {/* ── SERVICES GRID ─────────────────────────────────────── */}
        <section id="sp-services-section" style={{ padding: "80px 24px 60px", maxWidth: 1100, margin: "0 auto" }}>
          <FadeUp>
            <div className="sp-section-label">Our Services</div>
          </FadeUp>
          <FadeUp delay={0.05}>
            <h2 style={{ fontFamily:"'Manrope',sans-serif", fontWeight:800, fontSize:"clamp(26px,4vw,40px)", marginBottom:48 }}>
              What we offer
            </h2>
          </FadeUp>

          <div className="sp-grid">
            {SERVICES.map((s, i) => (
              <FadeUp key={i} delay={i * 0.08}>
                <div className="sp-card" onClick={() => navigate(s.route)}>
                  <div className="sp-card-num">0{i + 1}</div>
                  <div className="sp-card-icon">{s.icon}</div>
                  <div className="sp-card-title">{s.title}</div>
                  <p className="sp-card-desc">{s.desc}</p>
                  <div className="sp-pills">
                    {s.features.map((f, fi) => (
                      <span className="sp-pill" key={fi}>{f}</span>
                    ))}
                  </div>
                  <button className="sp-card-btn">
                    Open service <ArrowRight size={13} />
                  </button>
                </div>
              </FadeUp>
            ))}
          </div>
        </section>

        {/* ── BOTTOM BANNER ─────────────────────────────────────── */}
        <section style={{ padding: "0 24px 100px", maxWidth: 1100, margin: "0 auto" }}>
          <FadeUp>
            <div className="sp-banner">
              <div className="sp-orb" style={{ width:300, height:300, top:-60, left:"30%", background:"rgba(245,166,35,0.06)" }} />
              <h2>Ready to simplify your campus life?</h2>
              <p>Join thousands of students already saving time every day on campus.</p>
              <button className="sp-hero-cta" onClick={() => navigate("/")}>
                Get Started <ArrowRight size={16} />
              </button>
            </div>
          </FadeUp>
        </section>
      </div>
    </>
  );
}