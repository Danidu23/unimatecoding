import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  UtensilsCrossed, MapPin, Zap, Users, Heart,
  ArrowRight, Clock, Star, TrendingUp, Shield
} from "lucide-react";
import AppHeader from "../components/AppHeader";

/* ── Scroll reveal hook ───────────────────────────────────────────── */
function useInView(threshold = 0.12) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setInView(true);
    }, { threshold });

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, inView];
}

/* ── Scoped CSS (SAFE - no global leakage) ───────────────────────────── */
const SERVICES_PAGE_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800;900&family=DM+Sans:wght@400;500;600&display=swap');

  .services-page-root {
    width: 100%;
    overflow-x: hidden;
    background: #07091a;
    font-family: 'DM Sans', system-ui, sans-serif;
  }

  .services-hero {
    width: 100%;
    min-height: 70vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 120px 20px 80px;
  }

  .services-hero h1 {
    font-size: clamp(40px,7vw,80px);
    font-weight: 900;
    color: #fff;
  }

  .services-hero p {
    margin-top: 14px;
    max-width: 520px;
    color: rgba(255,255,255,0.6);
  }

  .services-highlight-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit,minmax(220px,1fr));
    gap: 24px;
    max-width: 1100px;
    margin: 0 auto;
    padding: 20px;
  }

  .services-highlight-card {
    text-align: center;
    color: #fff;
    transition: all .6s ease;
  }

  .services-highlight-icon {
    color: #F5A623;
    margin-bottom: 6px;
  }

  .services-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit,minmax(300px,1fr));
    gap: 28px;
  }

  /* ── your original class kept, just improved ── */
  .service-card {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 20px;
    padding: 30px;
    cursor: pointer;
    transition: all .3s ease;
    backdrop-filter: blur(10px);
  }

  .service-card:hover {
    transform: translateY(-10px);
    border-color: rgba(245,166,35,0.35);
    box-shadow: 0 20px 50px rgba(245,166,35,0.12);
  }

  .service-icon {
    width: 64px;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(245,166,35,0.12);
    border-radius: 16px;
    margin-bottom: 18px;
    transition: all .3s ease;
  }

  .service-card:hover .service-icon {
    background: #F5A623;
    transform: rotate(-6deg) scale(1.1);
  }

  .service-card:hover .service-icon svg {
    color: #07091a !important;
  }

  .cta-btn {
    margin-top: 18px;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 12px 22px;
    border-radius: 10px;
    border: none;
    cursor: pointer;
    background: #F5A623;
    color: #07091a;
    font-weight: 800;
    transition: all .25s ease;
  }

  .cta-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 30px rgba(245,166,35,0.35);
  }
`;

function ServicesPage() {
  const navigate = useNavigate();
  const [ref, inView] = useInView();

  /* ── REMOVED: Printing + Stationery already asked ── */
  const services = [
    {
      icon: <UtensilsCrossed size={30} color="#F5A623" />,
      title: "Smart Canteen Pre-Ordering",
      desc: "Pre-order meals and skip queues with real-time tracking.",
      features: ["Menu browsing", "Pre-order meals", "Live tracking", "Digital payments"],
      route: "/canteen"
    },
    {
      icon: <MapPin size={30} color="#F5A623" />,
      title: "Lost & Found",
      desc: "Report and recover lost items across campus easily.",
      features: ["Report items", "Browse finds", "Direct chat", "Tracking system"],
      route: "/lost-found/browse"
    },
    {
      icon: <Zap size={30} color="#F5A623" />,
      title: "Sports Facility Booking",
      desc: "Book courts instantly with live availability.",
      features: ["Check availability", "Book slots", "Manage bookings", "Instant updates"],
      route: "/sports/browse"
    },
    {
      icon: <Heart size={30} color="#F5A623" />,
      title: "Stationery Shop",
      desc: "Order essentials quickly from campus store partners.",
      features: ["Wide products", "Student pricing", "Fast pickup", "Easy ordering"],
      route: "/stationery"
    },
    {
      icon: <Users size={30} color="#F5A623" />,
      title: "Community Board",
      desc: "Connect with students and share campus updates.",
      features: ["Posts", "Events", "Peer chat", "Campus news"],
      route: "/community"
    }
  ];

  const highlights = [
    { icon: <Clock size={26} />, title: "Time-Saving", desc: "No queues, no stress" },
    { icon: <Shield size={26} />, title: "Secure", desc: "Safe student platform" },
    { icon: <TrendingUp size={26} />, title: "Growing", desc: "New features added" },
    { icon: <Star size={26} />, title: "Trusted", desc: "10k+ students" }
  ];

  return (
    <>
      <style>{SERVICES_PAGE_CSS}</style>

      <div className="services-page-root">
        <AppHeader />

        {/* HERO */}
        <section className="services-hero">
          <h1>
            Explore <span style={{ color: "#F5A623" }}>Services</span>
          </h1>
          <p>Everything you need to simplify campus life in one place.</p>
        </section>

        {/* HIGHLIGHTS */}
        <section ref={ref} className="services-highlight-grid">
          {highlights.map((h, i) => (
            <div
              key={i}
              className="services-highlight-card"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(20px)",
                transition: `all .6s ease ${i * 0.1}s`
              }}
            >
              <div className="services-highlight-icon">{h.icon}</div>
              <h3>{h.title}</h3>
              <p style={{ fontSize: 13, opacity: 0.6 }}>{h.desc}</p>
            </div>
          ))}
        </section>

        {/* SERVICES */}
        <section style={{ padding: "80px 20px 120px", maxWidth: 1200, margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", color: "#fff", fontSize: 36, marginBottom: 50 }}>
            What We Offer
          </h2>

          <div className="services-grid">
            {services.map((s, i) => (
              <div
                key={i}
                className="service-card"
                ref={ref}
                onClick={() => navigate(s.route)}
                style={{
                  opacity: inView ? 1 : 0,
                  transform: inView ? "translateY(0)" : "translateY(25px)",
                  transition: `all .6s ease ${i * 0.1}s`
                }}
              >
                <div className="service-icon">{s.icon}</div>

                <h3 style={{ color: "#fff", fontSize: 18, fontWeight: 800 }}>
                  {s.title}
                </h3>

                <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, marginTop: 8 }}>
                  {s.desc}
                </p>

                <ul style={{ marginTop: 12, color: "rgba(255,255,255,0.5)", fontSize: 13 }}>
                  {s.features.map((f, idx) => (
                    <li key={idx}>✓ {f}</li>
                  ))}
                </ul>

                <button className="cta-btn">
                  Open <ArrowRight size={14} />
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

export default ServicesPage;