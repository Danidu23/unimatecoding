import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Bell, User, ShoppingCart, ArrowLeft } from "lucide-react";
import unimateLogo from "../../assets/unimatelogo.png";
import LostFoundNotificationDropdown from './LostFoundNotificationDropdown';
import { MOCK_NOTIFICATIONS } from '../../data/lostfound/lostFoundAdvanced';

export default function LostFoundLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const unreadCount = MOCK_NOTIFICATIONS.filter((n) => n.unread).length;

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const cartCount = 0; // Mock empty cart for the bell

  return (
    <>
      <nav className={`c-nav${scrolled ? " scrolled" : ""}`}>
        {/* Logo + back */}
        <div className="header-brand-wrap">
          {location.pathname !== '/lost-found' && (
            <>
              <button className="btn-back" onClick={() => navigate(-1)}>
                <ArrowLeft size={13}/> Back
              </button>
              <div className="brand-divider" />
            </>
          )}
          <img src={unimateLogo || "https://upload.wikimedia.org/wikipedia/commons/4/41/Unimate_Logo.png"} alt="Unimate"
            className="brand-logo"
            onError={e => { e.target.style.display="none"; e.target.nextSibling.style.display="block"; }}
          />
          <span className="brand-fallback" style={{ display: !unimateLogo ? "block" : "none" }}>
            Uni<span style={{ color:"#F5A623" }}>mate</span>
          </span>
        </div>

        {/* Nav links */}
        <div className="desktop-nav" style={{ display:"flex", gap:"clamp(18px,3vw,32px)" }}>
          {["Dashboard","Canteen","Lost & Found","Messages","Sports","Clubs","Orders"].map((item,i) => {
             const pathMap = {
               'Dashboard': '/dashboard',
               'Canteen': '/canteen',
               'Lost & Found': '/lost-found',
               'Messages': '/lost-found/messages',
               'Sports': '/sports',
               'Clubs': '/clubs',
               'Orders': '/orders'
             };
             const path = pathMap[item];
             return (
              <a key={i} href={path} className={`nav-lnk${
                                        location.pathname === path ||
                                        (item === 'Lost & Found' && location.pathname.startsWith('/lost-found'))
                                          ? " active"
                                          : ""
                                      }`}
                onClick={e => { e.preventDefault(); navigate(path); }}>
                {item}
              </a>
            );
          })}
        </div>

        {/* Actions */}
        <div style={{ display:"flex", alignItems:"center", gap:"4px", position: "relative" }}>
          <button className="icon-btn" onClick={() => setShowNotifications((prev) => !prev)} style={{ position: 'relative' }}>
            <Bell size={19}/>
            {unreadCount > 0 ? <span className="badge">{unreadCount}</span> : null}
          </button>
          {showNotifications ? <LostFoundNotificationDropdown items={MOCK_NOTIFICATIONS} onClose={() => setShowNotifications(false)} /> : null}
          <button className="icon-btn" style={{ position:"relative" }}>
            <ShoppingCart size={19}/>
            {cartCount > 0 && <span className="badge">{cartCount}</span>}
          </button>
          <div style={{
            width:"38px", height:"38px", borderRadius:"50%", background:"#F5A623",
            display:"flex", alignItems:"center", justifyContent:"center",
            marginLeft:"8px", cursor:"pointer",
            transition:"transform .25s, box-shadow .25s",
            boxShadow:"0 2px 14px rgba(245,166,35,.4)"
          }}
            onClick={() => { setShowProfileMenu(p => !p); setShowNotifications(false); }}
            onMouseOver={e => { e.currentTarget.style.transform="scale(1.12)"; e.currentTarget.style.boxShadow="0 4px 22px rgba(245,166,35,.65)"; }}
            onMouseOut={e =>  { e.currentTarget.style.transform="scale(1)";    e.currentTarget.style.boxShadow="0 2px 14px rgba(245,166,35,.4)"; }}
          >
            <User size={18} color="#07091a"/>
          </div>
          {showProfileMenu && (
            <div style={{ position: "absolute", top: "54px", right: "0", background: "#101222", border: "1px solid rgba(255,255,255,.08)", borderRadius: "12px", padding: "8px", minWidth: "160px", boxShadow: "0 8px 32px rgba(0,0,0,.4)", zIndex: 100, display: "flex", flexDirection: "column", gap: "4px" }}>
              <button onClick={() => { setShowProfileMenu(false); navigate("/profile"); }} style={{ background: "transparent", border: "none", color: "#fff", padding: "10px 14px", textAlign: "left", fontSize: "13px", fontWeight: 600, fontFamily: "Manrope,sans-serif", borderRadius: "8px", cursor: "pointer", transition: "background .2s" }} onMouseOver={e => e.currentTarget.style.background="rgba(255,255,255,.05)"} onMouseOut={e => e.currentTarget.style.background="transparent"}>
                My Profile
              </button>
              <button onClick={() => { setShowProfileMenu(false); navigate("/lost-found/admin-login"); }} style={{ background: "transparent", border: "none", color: "#F5A623", padding: "10px 14px", textAlign: "left", fontSize: "13px", fontWeight: 800, fontFamily: "Manrope,sans-serif", borderRadius: "8px", cursor: "pointer", transition: "background .2s" }} onMouseOver={e => e.currentTarget.style.background="rgba(245,166,35,.1)"} onMouseOut={e => e.currentTarget.style.background="transparent"}>
                Admin Login
              </button>
            </div>
          )}
        </div>
      </nav>
      
      {/* Content wrapper below fixed navbar */}
      <div style={{ paddingTop: "66px", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Outlet />
      </div>
    </>
  );
}
