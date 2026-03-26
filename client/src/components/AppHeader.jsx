import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Bell, Menu, X, User } from "lucide-react";
import unimateLogo from "../assets/unimatelogo.png";

const NAV_ITEMS = [
  { label: "Dashboard", path: "/dashboard", enabled: true },
  { label: "Canteen", path: "/canteen", enabled: true },
  { label: "Lost & Found", enabled: false },
  { label: "Sports", enabled: false },
  { label: "Clubs", enabled: false },
  { label: "Orders", enabled: false },
];

const CSS = `
  .uh-wrap *{ box-sizing:border-box; }
  .uh-wrap a{ text-decoration:none; }
  .uh-wrap button{ border:none; background:none; cursor:pointer; font-family:inherit; }

  .uh-nav{
    position:fixed; top:0; left:0; right:0; z-index:500;
    display:flex; align-items:center; justify-content:space-between;
    height:66px;
    padding:0 clamp(16px,4vw,60px);
    background:rgba(5,8,24,.96);
    backdrop-filter:blur(14px);
    border-bottom:1px solid rgba(255,255,255,.06);
  }

  .uh-logo{
    display:flex; align-items:center;
    min-width:110px;
  }
  .uh-logo img{
    height:42px; width:auto; object-fit:contain;
  }
  .uh-logo-fallback{
    display:none; align-items:center; gap:10px;
  }
  .uh-logo-badge{
    width:34px; height:34px; border-radius:10px;
    background:#F5A623;
    display:flex; align-items:center; justify-content:center;
    color:#07091a; font-weight:900; font-family:'Manrope',sans-serif;
  }
  .uh-logo-text{
    color:#fff; font-weight:900; font-size:20px; font-family:'Manrope',sans-serif;
  }

  .uh-links{
    display:flex; align-items:center; gap:34px;
  }

  .uh-link{
    position:relative;
    color:rgba(255,255,255,.62);
    font-size:14px;
    font-weight:600;
    font-family:'Manrope',sans-serif;
    transition:color .22s ease;
    white-space:nowrap;
    padding:2px 0;
  }

  .uh-link::after{
    content:"";
    position:absolute;
    left:0; right:0; bottom:-3px;
    height:2px;
    border-radius:2px;
    background:#F5A623;
    transform:scaleX(0);
    transform-origin:left;
    transition:transform .22s ease;
  }

  .uh-link:hover{
    color:#fff;
  }
  .uh-link:hover::after{
    transform:scaleX(1);
  }

  .uh-link.active{
    color:#F5A623;
  }
  .uh-link.active::after{
    transform:scaleX(1);
  }

  .uh-actions{
    display:flex; align-items:center; gap:18px;
    min-width:110px; justify-content:flex-end;
  }

  .uh-bell{
    display:flex; align-items:center; justify-content:center;
    color:rgba(255,255,255,.72);
    transition:color .2s ease;
  }
  .uh-bell:hover{
    color:#fff;
  }

  .uh-profile{
    width:44px; height:44px;
    border-radius:999px;
    display:flex; align-items:center; justify-content:center;
    background:#F5A623;
    color:#07091a;
    box-shadow:0 8px 18px rgba(245,166,35,.22);
    transition:transform .2s ease, box-shadow .2s ease;
  }
  .uh-profile:hover{
    transform:translateY(-1px);
    box-shadow:0 10px 22px rgba(245,166,35,.28);
  }

  .uh-mobile-toggle{
    display:none;
    width:38px; height:38px;
    border-radius:10px;
    align-items:center; justify-content:center;
    background:rgba(255,255,255,.05);
    color:#fff;
  }

  .uh-mobile-panel{
    position:fixed;
    top:66px; left:0; right:0;
    z-index:499;
    display:none;
    background:rgba(6,9,26,.98);
    backdrop-filter:blur(14px);
    border-bottom:1px solid rgba(255,255,255,.06);
    padding:14px 16px 18px;
  }
  .uh-mobile-panel.open{
    display:block;
  }

  .uh-mobile-links{
    display:flex; flex-direction:column; gap:6px;
  }

  .uh-mobile-link{
    padding:12px 14px;
    border-radius:14px;
    color:rgba(255,255,255,.72);
    font-weight:700;
    font-family:'Manrope',sans-serif;
    transition:all .2s ease;
  }

  .uh-mobile-link.active{
    background:rgba(245,166,35,.10);
    color:#F5A623;
    border:1px solid rgba(245,166,35,.18);
  }

  @media (max-width: 980px){
    .uh-links{
      gap:22px;
    }
  }

  @media (max-width: 900px){
    .uh-nav{
      padding:0 16px;
    }
    .uh-links{
      display:none;
    }
    .uh-mobile-toggle{
      display:flex;
    }
    .uh-actions{
      gap:12px;
      min-width:auto;
    }
    .uh-link-disabled{
    opacity:.55;
    cursor:default;
    pointer-events:none;
    }
    .uh-mobile-link-disabled{
    opacity:.55;
    cursor:default;
    pointer-events:none;
    }
  }
`;

export default function AppHeader() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const isProfilePage = location.pathname === "/profile";

  return (
    <div className="uh-wrap">
      <style>{CSS}</style>

      <header className="uh-nav">
        <Link to="/dashboard" className="uh-logo" aria-label="Unimate">
          <img
            src={unimateLogo}
            alt="Unimate"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              if (e.currentTarget.nextSibling) {
                e.currentTarget.nextSibling.style.display = "flex";
              }
            }}
          />
          <div className="uh-logo-fallback">
            <div className="uh-logo-badge">U</div>
            <div className="uh-logo-text">
              Uni<span style={{ color: "#F5A623" }}>mate</span>
            </div>
          </div>
        </Link>

        <nav className="uh-links">
            {NAV_ITEMS.map((item) =>
                item.enabled ? (
                <NavLink
                    key={item.label}
                    to={item.path}
                    className={({ isActive }) => `uh-link ${isActive ? "active" : ""}`}
                >
                    {item.label}
                </NavLink>
                ) : (
                <span key={item.label} className="uh-link uh-link-disabled">
                    {item.label}
                </span>
                )
            )}
        </nav>

        <div className="uh-actions">
          <button type="button" className="uh-bell" aria-label="Notifications">
            <Bell size={18} />
          </button>

          <Link
            to="/profile"
            className="uh-profile"
            aria-label="Profile"
            title="Profile"
            style={isProfilePage ? { outline: "2px solid rgba(255,255,255,.18)" } : undefined}
          >
            <User size={18} />
          </Link>

          <button
            type="button"
            className="uh-mobile-toggle"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      <div className={`uh-mobile-panel ${mobileOpen ? "open" : ""}`}>
        <nav className="uh-mobile-links">
            {NAV_ITEMS.map((item) =>
            item.enabled ? (
                <NavLink
                    key={item.label}
                    to={item.path}
                    className={({ isActive }) => `uh-mobile-link ${isActive ? "active" : ""}`}
                >
                {item.label}
                </NavLink>
            ) : (
                <span key={item.label} className="uh-mobile-link uh-mobile-link-disabled">
                    {item.label}
                </span>
            )
            )}
        </nav>
      </div>
    </div>
  );
}