import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Bell, User, ShoppingCart, ArrowLeft } from "lucide-react";
import unimateLogo from "/unimatelogo.png";
import { jsxDEV as _jsxDEV, Fragment as _Fragment } from "react/jsx-dev-runtime";

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

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
        <div style={{ display:"flex", alignItems:"center", gap:"14px" }}>
          {location.pathname !== '/' && (
            <>
              <button className="btn-back" onClick={() => navigate(-1)}>
                <ArrowLeft size={14}/> Back
              </button>
              <div style={{ width:"1px", height:"22px", background:"rgba(255,255,255,.12)" }}/>
            </>
          )}
          <img src={unimateLogo || "https://upload.wikimedia.org/wikipedia/commons/4/41/Unimate_Logo.png"} alt="Unimate"
            style={{ height:"36px", width:"auto", objectFit:"contain" }}
            onError={e => { e.target.style.display="none"; e.target.nextSibling.style.display="block"; }}
          />
          <span style={{ display: !unimateLogo ? "block" : "none", fontWeight:900, fontSize:"20px", fontFamily:"Manrope,sans-serif", color:"#fff", letterSpacing:"-0.4px" }}>
            Uni<span style={{ color:"#F5A623" }}>mate</span>
          </span>
        </div>

        {/* Nav links */}
        <div className="desktop-nav" style={{ display:"flex", gap:"clamp(18px,3vw,32px)" }}>
          {["Dashboard","Canteen","Lost & Found","Sports","Clubs","Orders"].map((item,i) => {
             const pathMap = {
               'Dashboard': '/dashboard',
               'Canteen': '/canteen',
               'Lost & Found': '/',
               'Sports': '/sports',
               'Clubs': '/clubs',
               'Orders': '/orders'
             };
             const path = pathMap[item];
             return (
              <a key={i} href={path} className={`nav-lnk${item==="Lost & Found"?" active":""}`}
                onClick={e => { e.preventDefault(); navigate(path); }}>
                {item}
              </a>
            );
          })}
        </div>

        {/* Actions */}
        <div style={{ display:"flex", alignItems:"center", gap:"4px" }}>
          <button className="icon-btn"><Bell size={19}/></button>
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
            onClick={() => navigate("/profile")}
            onMouseOver={e => { e.currentTarget.style.transform="scale(1.12)"; e.currentTarget.style.boxShadow="0 4px 22px rgba(245,166,35,.65)"; }}
            onMouseOut={e =>  { e.currentTarget.style.transform="scale(1)";    e.currentTarget.style.boxShadow="0 2px 14px rgba(245,166,35,.4)"; }}
          >
            <User size={18} color="#07091a"/>
          </div>
        </div>
      </nav>
      
      {/* Content wrapper below fixed navbar */}
      <div style={{ paddingTop: "66px", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Outlet />
      </div>
    </>
  );
}
