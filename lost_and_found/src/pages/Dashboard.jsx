import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Search, PackageSearch, PackagePlus, ListCheck, ClipboardList, Package, MapPin, Clock } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const today = new Date().toLocaleDateString("en-US", { weekday:"long", month:"long", day:"numeric" });

  const QUICK_ACTIONS = [
    { title: "Report Lost Item", subtitle: "Did you lose something? Let us know.", icon: <PackageSearch size={22} color="#F5A623"/>, link: "/report-lost" },
    { title: "Report Found Item", subtitle: "Found an item? Help return it.", icon: <PackagePlus size={22} color="#F5A623"/>, link: "/report-found" },
    { title: "Browse Items", subtitle: "Search through reported items.", icon: <Search size={22} color="#F5A623"/>, link: "/browse" },
    { title: "My Reports", subtitle: "Check the status of your claims.", icon: <ClipboardList size={22} color="#F5A623"/>, link: "/my-reports" }
  ];

  const RECENT_ITEMS = [
    { id: 1, type: 'lost', title: 'MacBook Air M1', location: 'New building library', time: '2 hours ago', status: 'pending', img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80' },
    { id: 2, type: 'found', title: 'Casio Watch', location: 'Sport Complex', time: '5 hours ago', status: 'verified', img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80' },
  ];

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
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px clamp(20px,6vw,60px)", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px" }}>
        {QUICK_ACTIONS.map((action, i) => (
          <div key={i} className="grid-item" style={{ animation: `fadeUp .4s cubic-bezier(.22,.68,0,1.2) ${i * 0.1}s both`, cursor: "pointer" }} onClick={() => navigate(action.link)}>
            <div style={{ width: "46px", height: "46px", borderRadius: "12px", background: "rgba(245,166,35,.12)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "8px" }}>
              {action.icon}
            </div>
            <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#fff", fontFamily: "Manrope,sans-serif", margin: 0 }}>{action.title}</h3>
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,.45)", lineHeight: 1.6 }}>{action.subtitle}</p>
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
        </div>

        {RECENT_ITEMS.map((item, i) => (
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
      </div>
    </div>
  );
}
