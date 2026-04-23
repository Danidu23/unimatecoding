import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Search, PackagePlus, ListCheck, ClipboardList, Package, MapPin, Clock, ArrowRight, BellRing, ShieldCheck, BookOpenText, ScanSearch, Sparkles, MessageSquare } from 'lucide-react';
export default function Dashboard() {
  const navigate = useNavigate();
  const today = new Date().toLocaleDateString("en-US", { weekday:"long", month:"long", day:"numeric" });

  const QUICK_ACTIONS = [
    {
      title: "Report Lost Item",
      subtitle: "Log campus belongings like student cards, chargers, notebooks, and bags.",
      icon: <BookOpenText size={22} color="#F5A623"/>,
      link: "/report-lost",
      accent: "Student Support",
      cta: "Start Lost Report",
      img: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1400&q=80&auto=format&fit=crop"
    },
    {
      title: "Report Found Item",
      subtitle: "Share recovered items found in lecture halls, libraries, and campus common areas.",
      icon: <PackagePlus size={22} color="#F5A623"/>,
      link: "/report-found",
      accent: "Campus Return",
      cta: "Add Found Item",
      img: "https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?w=1400&q=80&auto=format&fit=crop"
    },
    {
      title: "Browse Items",
      subtitle: "Search by faculty, location, category, and the latest campus activity.",
      icon: <Search size={22} color="#F5A623"/>,
      link: "/browse",
      accent: "Campus Search",
      cta: "Browse Reports",
      img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1400&q=80&auto=format&fit=crop"
    },
    {
      title: "My Reports",
      subtitle: "Track your own reports, claim progress, and verification updates in one place.",
      icon: <ClipboardList size={22} color="#F5A623"/>,
      link: "/my-reports",
      accent: "Student Dashboard",
      cta: "Open My Reports",
      img: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1400&q=80&auto=format&fit=crop"
    }
  ];

  const BOTTOM_QUICK_ACTIONS = [
    { title: "Peer Messaging", subtitle: "Chat directly with finders or owners.", icon: <MessageSquare size={18} color="#F5A623" />, link: "/messages" },
    { title: "Lost Item Alerts", subtitle: "Get instant updates when similar items are found.", icon: <BellRing size={18} color="#F5A623" />, link: "/my-reports" },
    { title: "Verified Claims", subtitle: "Track validated claims and approval stages.", icon: <ShieldCheck size={18} color="#F5A623" />, link: "/my-reports" },
    { title: "Browse by Zones", subtitle: "Filter reports by faculty and hotspot locations.", icon: <MapPin size={18} color="#F5A623" />, link: "/browse" },
    { title: "Campus Handbook", subtitle: "See lost-and-found guidelines and best practices.", icon: <BookOpenText size={18} color="#F5A623" />, link: "/browse" },
    { title: "Fast Report Wizard", subtitle: "Jump into a streamlined reporting experience.", icon: <Sparkles size={18} color="#F5A623" />, link: "/report-lost" }
  ];

  const [recentItems, setRecentItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const [lostRes, foundRes] = await Promise.all([
          fetch('http://localhost:5000/api/items/lost'),
          fetch('http://localhost:5000/api/items/found')
        ]);
        const lostData = await lostRes.json();
        const foundData = await foundRes.json();
        
        let combined = [];
        if (lostData.success) {
          combined = [...combined, ...lostData.data.map(i => ({
            id: i._id,
            type: 'lost',
            title: i.itemName,
            location: i.lastSeenLocation,
            time: new Date(i.createdAt).toLocaleDateString(),
            status: i.status ? i.status.toLowerCase() : 'pending',
            img: i.image || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80'
          }))];
        }
        if (foundData.success) {
          combined = [...combined, ...foundData.data.map(i => ({
            id: i._id,
            type: 'found',
            title: i.itemName,
            location: i.locationFound,
            time: new Date(i.createdAt).toLocaleDateString(),
            status: i.status ? i.status.toLowerCase() : 'pending',
            img: i.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80'
          }))];
        }
        
        combined.sort((a,b) => new Date(b.time) - new Date(a.time));
        setRecentItems(combined.slice(0, 5));
      } catch (e) {
        console.error('API Fetch error:', e);
      }
    };
    fetchItems();
  }, []);

  return (
    <div style={{ width: "100%", minHeight: "calc(100vh - 66px)", background: "#07091a" }}>
      {/* ── Hero Banner ── */}
      <div style={{
        background: "linear-gradient(135deg,#07091a 0%,#0c1130 55%,#14193a 100%)",
        padding: "52px clamp(20px,6vw,60px) 48px",
        position: "relative", overflow: "hidden", borderBottom: "1px solid rgba(255,255,255,.06)"
      }}>
        {/* Ambient orb */}
        <div style={{ position: "absolute", top: "0%", left: "40%", width: "600px", height: "280px", background: "radial-gradient(ellipse,rgba(245,166,35,.09) 0%,transparent 68%)", animation: "glow 5s ease-in-out infinite", pointerEvents: "none" }} />
        {/* Left amber accent */}
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "4px", background: "linear-gradient(to bottom,#F5A623,rgba(245,166,35,.2))" }} />

        <div style={{ maxWidth: "1100px", margin: "0 auto", position: "relative" }}>
          {/* Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "24px", fontSize: "12px", color: "rgba(255,255,255,.35)", fontFamily: "Manrope,sans-serif" }}>
            <span style={{ cursor: "pointer", transition: "color .2s" }}
              onMouseOver={e => e.currentTarget.style.color = "rgba(255,255,255,.7)"}
              onMouseOut={e => e.currentTarget.style.color = "rgba(255,255,255,.35)"}
            >Home</span>
            <ChevronRight size={12} />
            <span style={{ color: "#F5A623", fontWeight: 600 }}>Lost & Found</span>
          </div>

          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "20px" }}>
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "7px", background: "rgba(245,166,35,.11)", border: "1px solid rgba(245,166,35,.25)", borderRadius: "100px", padding: "5px 16px", marginBottom: "18px" }}>
                <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#F5A623", animation: "pulse 2s infinite" }} />
                <span style={{ fontSize: "11px", fontWeight: 700, color: "#F5A623", fontFamily: "Manrope,sans-serif", letterSpacing: "0.8px", textTransform: "uppercase" }}>Campus Network</span>
              </div>
              <h1 style={{ fontSize: "clamp(28px,4.5vw,48px)", fontWeight: 900, color: "#fff", fontFamily: "Manrope,sans-serif", letterSpacing: "-1.2px", lineHeight: 1.08, marginBottom: "12px" }}>
                Lost & Found Space
              </h1>
              <p style={{ fontSize: "15px", color: "rgba(255,255,255,.55)", lineHeight: 1.7, maxWidth: "440px" }}>
                Help connect lost items with their rightful owners across the campus. Quick reporting, fast retrieval.
              </p>
            </div>

            {/* Date chip */}
            <div style={{ background: "rgba(245,166,35,.1)", border: "1px solid rgba(245,166,35,.22)", borderRadius: "14px", padding: "14px 20px", flexShrink: 0, textAlign: "right" }}>
              <div style={{ fontSize: "10px", color: "#F5A623", fontWeight: 800, fontFamily: "Manrope,sans-serif", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "5px" }}>Today</div>
              <div style={{ fontSize: "13px", color: "rgba(255,255,255,.85)", fontWeight: 700, fontFamily: "Manrope,sans-serif" }}>{today}</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats Strip ── */}
      <div style={{ background: "rgba(255,255,255,.03)", borderBottom: "1px solid rgba(255,255,255,.07)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 clamp(20px,6vw,60px)", display: "flex", overflowX: "auto" }}>
          {[
            { icon: <Package size={15} color="#F5A623" />, label: "124 Active Reports" },
            { icon: <ListCheck size={15} color="#F5A623" />, label: "45 Items Returned" },
            { icon: <Search size={15} color="#F5A623" />, label: "24 Items Found Today" },
          ].map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "14px 24px", borderRight: i < 2 ? "1px solid rgba(255,255,255,.07)" : "none", flexShrink: 0 }}>
              {s.icon}
              <span style={{ fontSize: "13px", color: "rgba(255,255,255,.65)", fontWeight: 600, whiteSpace: "nowrap" }}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Quick Actions Grid ── */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px clamp(20px,6vw,60px)", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 420px), 1fr))", gap: "32px" }}>
        {QUICK_ACTIONS.map((action, i) => (
          <div key={i} className="hero-action-card" style={{ animation: `fadeUp .45s cubic-bezier(.22,.68,0,1.2) ${i * 0.1}s both`, cursor: "pointer", display: "flex", flexDirection: "column" }} onClick={() => navigate(action.link)}>
            <div style={{ position: "relative", borderRadius: "16px", overflow: "hidden", height: "240px", border: "1px solid rgba(255,255,255,.08)", marginBottom: "20px", background: "rgba(0,0,0,0.2)" }}>
              <img src={action.img} alt={action.title} className="grid-item-img" style={{ height: "100%", width: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(7,9,26,.96) 6%, rgba(7,9,26,.18) 60%, rgba(7,9,26,.04) 100%)" }} />
              <div style={{ position: "absolute", left: "16px", top: "16px", display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(7,9,26,.62)", backdropFilter: "blur(10px)", border: "1px solid rgba(245,166,35,.28)", borderRadius: "100px", padding: "6px 14px" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#F5A623", boxShadow: "0 0 0 4px rgba(245,166,35,.12)" }} />
                <span style={{ fontSize: "12px", color: "#F5A623", fontWeight: 800, fontFamily: "Manrope,sans-serif", letterSpacing: "0.4px" }}>{action.accent}</span>
              </div>
              <div style={{ position: "absolute", left: "16px", bottom: "16px", right: "16px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
                <div style={{ color: "rgba(255,255,255,.78)", fontSize: "12px", fontWeight: 700, fontFamily: "Manrope,sans-serif", letterSpacing: "0.3px" }}>
                  Campus tools for students
                </div>
                <div style={{ width: "36px", height: "36px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, rgba(245,166,35,.95), rgba(249,186,60,.85))", color: "#07091a", boxShadow: "0 10px 24px rgba(245,166,35,.25)" }}>
                  <ArrowRight size={16} />
                </div>
              </div>
            </div>
            <h3 style={{ fontSize: "23px", fontWeight: 800, color: "#fff", fontFamily: "Manrope,sans-serif", margin: "0 0 10px 0" }}>{action.title}</h3>
            <p style={{ fontSize: "15px", color: "rgba(255,255,255,.55)", lineHeight: 1.6, marginBottom: "18px" }}>{action.subtitle}</p>
            <button className="btn-primary" style={{ marginTop: "auto", alignSelf: "flex-start", padding: "11px 18px", fontSize: "13px", borderRadius: "999px", boxShadow: "0 8px 24px rgba(245,166,35,.28)" }}>
              {action.cta} <ArrowRight size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* ── Recent Items (Card Rows) ── */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 clamp(20px,6vw,60px) 80px", display: "flex", flexDirection: "column", gap: "20px" }}>
        <div className="sec-head">
          <span style={{ display: "flex", alignItems: "center", gap: "7px", fontSize: "18px", fontWeight: 900, color: "#fff", fontFamily: "Manrope,sans-serif", whiteSpace: "nowrap" }}>
            <span style={{ color: "#F5A623", display: "flex" }}><Clock size={16}/></span>
            Recently Reported
          </span>
          <div className="sec-line" />
          <button className="btn-outline" style={{ padding: "8px 14px", fontSize: "12px" }} onClick={() => navigate('/browse')}>
            See All <ChevronRight size={14} />
          </button>
        </div>

        {recentItems.slice(0, 5).map((item, i) => (
          <div key={item.id} className="card-row" style={{ animation: `fadeUp .55s cubic-bezier(.22,.68,0,1.2) ${i * .13}s both` }} onClick={() => navigate(`/item/${item.id}`)}>
            <div style={{ width: "clamp(140px,26%,210px)", flexShrink: 0, overflow: "hidden", position: "relative" }}>
              <img src={item.img} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              <div style={{ position: "absolute", bottom: "12px", left: "12px", background: item.type === 'lost' ? "#ef4444" : "#22c55e", color: "#fff", borderRadius: "6px", padding: "3px 10px", fontSize: "11px", fontWeight: 800, fontFamily: "Manrope,sans-serif", textTransform: "uppercase" }}>
                {item.type}
              </div>
            </div>

            <div style={{ flex: 1, padding: "24px 26px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "8px", gap: "12px" }}>
                  <div>
                    <h3 style={{ fontSize: "20px", fontWeight: 900, color: "#fff", fontFamily: "Manrope,sans-serif", letterSpacing: "-0.5px", marginBottom: "4px" }}>{item.title}</h3>
                    <p style={{ fontSize: "13px", color: "rgba(255,255,255,.45)" }}>Reported {item.time}</p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "5px", background: item.status === "verified" ? "rgba(34,197,94,.12)" : "rgba(245,166,35,.12)", border: `1px solid ${item.status === "verified" ? "rgba(34,197,94,.3)" : "rgba(245,166,35,.3)"}`, borderRadius: "100px", padding: "5px 12px", flexShrink: 0 }}>
                    <span className={item.status === "verified" ? "dot-open" : "dot-closed"} style={{ background: item.status === "verified" ? "#22c55e" : "#F5A623"}} />
                    <span style={{ fontSize: "12px", fontWeight: 700, fontFamily: "Manrope,sans-serif", color: item.status === "verified" ? "#22c55e" : "#F5A623", textTransform: "capitalize" }}>
                      {item.status}
                    </span>
                  </div>
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "5px", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.09)", borderRadius: "8px", padding: "5px 10px" }}>
                    <MapPin size={12} color="#F5A623" />
                    <span style={{ fontSize: "12px", color: "rgba(255,255,255,.7)", fontWeight: 600 }}>{item.location}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: "18px", borderTop: "1px solid rgba(255,255,255,.07)", marginTop: "18px" }}>
                <button className="btn-outline" style={{ padding: "8px 16px", fontSize: "12px" }}>
                  View Details <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}

        <div style={{ marginTop: "12px", border: "1px solid rgba(245,166,35,.2)", background: "linear-gradient(140deg, rgba(245,166,35,.1), rgba(255,255,255,.03))", borderRadius: "20px", padding: "26px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "20px", flexWrap: "wrap", marginBottom: "18px" }}>
            <div>
              <h3 style={{ fontSize: "23px", color: "#fff", fontWeight: 900, fontFamily: "Manrope,sans-serif", letterSpacing: "-.5px", marginBottom: "6px" }}>More Quick Actions</h3>
              <p style={{ color: "rgba(255,255,255,.6)", fontSize: "14px", maxWidth: "560px", lineHeight: 1.6 }}>
                Fast access tools to report, track, and recover items efficiently while you scroll through the dashboard.
              </p>
            </div>
            <button className="btn-primary" style={{ padding: "10px 16px", fontSize: "13px" }} onClick={() => navigate('/report-lost')}>
              Start New Report <ArrowRight size={15} />
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "16px" }}>
            {BOTTOM_QUICK_ACTIONS.map((quick, i) => (
              <div key={quick.title} className="bottom-quick-card" style={{ 
                animation: `fadeUp .5s cubic-bezier(.22,.68,0,1.2) ${i * .08}s both`, 
                cursor: "pointer",
                display: "flex", 
                alignItems: "center", 
                gap: "18px", 
                background: "rgba(255,255,255,.02)", 
                border: "1px solid rgba(255,255,255,.06)", 
                borderRadius: "16px", 
                padding: "20px", 
                transition: "all 0.3s ease",
                position: "relative",
                overflow: "hidden"
              }} 
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,.05)'; e.currentTarget.style.borderColor = 'rgba(245,166,35,.3)' }} 
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,.02)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,.06)' }}
              onClick={() => navigate(quick.link)}>
                <div style={{ width: "48px", height: "48px", borderRadius: "14px", display: "flex", flexShrink: 0, alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, rgba(245,166,35,.2), rgba(245,166,35,.05))", border: "1px solid rgba(245,166,35,.2)" }}>
                  {quick.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: "16px", color: "#fff", fontWeight: 800, fontFamily: "Manrope,sans-serif", margin: "0 0 6px 0" }}>{quick.title}</h4>
                  <p style={{ fontSize: "13px", color: "rgba(255,255,255,.55)", lineHeight: 1.5, margin: 0 }}>{quick.subtitle}</p>
                </div>
                <ChevronRight size={18} color="rgba(255,255,255,.2)" style={{ flexShrink: 0, transition: "color 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.color = "#F5A623"} onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,.2)"} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
