import { useEffect, useMemo, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  UtensilsCrossed,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
  X,
  TriangleAlert,
} from "lucide-react";
import unimateLogo from "../assets/unimatelogo.png";

const NAV_ITEMS = [
  { label: "Dashboard", path: "/staff", end: true, icon: LayoutDashboard },
  { label: "Orders", path: "/staff/orders", end: false, icon: ClipboardList },
  { label: "Menu Items", path: "/staff/menu", end: false, icon: UtensilsCrossed },
];

const CSS = `
  .sh-wrap *{ box-sizing:border-box; }
  .sh-wrap a{ text-decoration:none; }
  .sh-wrap button{ border:none; background:none; cursor:pointer; font-family:inherit; }

  .sh-mobilebar{
    display:none;
  }

  .sh-sidebar{
    position:fixed;
    top:0;
    left:0;
    bottom:0;
    width:76px;
    z-index:700;
    display:flex;
    flex-direction:column;
    padding:18px 12px;
    background:rgba(6,10,28,.94);
    backdrop-filter:blur(18px);
    border-right:1px solid rgba(255,255,255,.08);
    box-shadow:0 24px 60px rgba(0,0,0,.35);
    transition:width .28s ease, box-shadow .25s ease, background .25s ease;
    overflow:hidden;
  }

  .sh-sidebar.expanded{
    width:240px;
    box-shadow:0 28px 72px rgba(0,0,0,.42);
  }

  .sh-top{
    display:flex;
    align-items:center;
    justify-content:center;
    min-height:56px;
    margin-bottom:18px;
  }

  .sh-brand{
    width:100%;
    min-width:0;
    display:flex;
    align-items:center;
    gap:12px;
    overflow:hidden;
  }

  .sh-logo{
    width:44px;
    height:44px;
    border-radius:14px;
    object-fit:contain;
    flex:0 0 44px;
    display:block;
  }

  .sh-brand-fallback{
    width:44px;
    height:44px;
    border-radius:14px;
    flex:0 0 44px;
    display:none;
    align-items:center;
    justify-content:center;
    background:linear-gradient(135deg, rgba(245,166,35,.18), rgba(245,166,35,.06));
    border:1px solid rgba(245,166,35,.18);
    color:#F5A623;
    font-size:18px;
    font-weight:900;
    font-family:'Manrope',sans-serif;
  }

  .sh-brand-text{
    min-width:0;
    opacity:0;
    transform:translateX(-8px);
    transition:opacity .2s ease, transform .24s ease;
    white-space:nowrap;
    pointer-events:none;
    overflow:hidden;
  }

  .sh-sidebar.expanded .sh-brand-text{
    opacity:1;
    transform:translateX(0);
    pointer-events:auto;
  }

  .sh-sidebar:not(.expanded) .sh-brand{
    width:auto;
    justify-content:center;
    margin:0 auto;
  }

  .sh-sidebar:not(.expanded) .sh-brand-text{
    width:0;
    opacity:0;
    transform:translateX(-8px);
    pointer-events:none;
  }

  .sh-sidebar:not(.expanded) .sh-logo,
  .sh-sidebar:not(.expanded) .sh-brand-fallback{
    margin:0 auto;
  }

  .sh-title{
    color:#fff;
    font-size:18px;
    font-weight:900;
    letter-spacing:-.3px;
    line-height:1.05;
    font-family:'Manrope',sans-serif;
  }

  .sh-subtitle{
    margin-top:4px;
    color:rgba(255,255,255,.46);
    font-size:11px;
    font-weight:700;
    letter-spacing:.14em;
    text-transform:uppercase;
    font-family:'Manrope',sans-serif;
  }

  .sh-pin{
    width:36px;
    height:36px;
    border-radius:11px;
    display:flex;
    align-items:center;
    justify-content:center;
    color:rgba(255,255,255,.68);
    background:rgba(255,255,255,.05) !important;
    border:1px solid rgba(255,255,255,.08) !important;
    transition:all .2s ease;
    flex:0 0 36px;
    align-self:center;
  }

  .sh-pin:hover{
    color:#fff;
    background:rgba(255,255,255,.08) !important;
  }

  .sh-divider{
    height:1px;
    margin:0 2px 18px;
    background:linear-gradient(90deg, rgba(255,255,255,.08), rgba(255,255,255,.02));
  }

  .sh-nav{
    display:flex;
    flex-direction:column;
    gap:10px;
  }

  .sh-link{
    position:relative;
    display:flex;
    align-items:center;
    gap:14px;
    min-height:54px;
    padding:0 12px;
    border-radius:18px;
    color:rgba(255,255,255,.62);
    transition:all .22s ease;
    overflow:hidden;
  }

  .sh-link:hover{
    color:#fff;
    background:rgba(255,255,255,.06);
  }

  .sh-link.active{
    color:#F5A623;
    background:linear-gradient(135deg, rgba(245,166,35,.14), rgba(255,255,255,.04));
    box-shadow:0 10px 28px rgba(245,166,35,.10);
  }

  .sh-link-icon{
    width:28px;
    height:28px;
    flex:0 0 28px;
    display:flex;
    align-items:center;
    justify-content:center;
  }

  .sh-link-label{
    font-size:14px;
    font-weight:800;
    font-family:'Manrope',sans-serif;
    white-space:nowrap;
    opacity:0;
    transform:translateX(-8px);
    transition:opacity .18s ease, transform .22s ease;
    pointer-events:none;
  }

  .sh-sidebar.expanded .sh-link-label{
    opacity:1;
    transform:translateX(0);
    pointer-events:auto;
  }

  .sh-link-tip{
    position:absolute;
    left:calc(100% + 10px);
    top:50%;
    transform:translateY(-50%);
    padding:8px 10px;
    border-radius:10px;
    color:#fff;
    background:rgba(7,10,24,.96);
    border:1px solid rgba(255,255,255,.08);
    box-shadow:0 18px 40px rgba(0,0,0,.3);
    font-size:12px;
    font-weight:700;
    font-family:'Manrope',sans-serif;
    white-space:nowrap;
    opacity:0;
    pointer-events:none;
    transition:opacity .18s ease;
  }

  .sh-sidebar:not(.expanded) .sh-link:hover .sh-link-tip,
  .sh-sidebar:not(.expanded) .sh-logout:hover .sh-link-tip{
    opacity:1;
  }

  .sh-bottom{
    margin-top:auto;
    padding-top:18px;
  }

  .sh-bottom-divider{
    height:1px;
    margin:0 2px 18px;
    background:linear-gradient(90deg, rgba(255,255,255,.08), rgba(255,255,255,.02));
  }

  .sh-bottom-actions{
    display:flex;
    align-items:center;
    gap:10px;
  }


  @media (min-width: 901px){
    .sh-sidebar:not(.expanded) .sh-bottom-actions .sh-pin{
      display:none;
    }
  }

  .sh-sidebar.expanded .sh-logout{
    flex:1;
  }

  .sh-logout{
    position:relative;
    width:100%;
    min-height:54px;
    border-radius:18px;
    display:flex;
    align-items:center;
    gap:14px;
    padding:0 12px;
    color:#fda4af;
    background:rgba(239,68,68,.10) !important;
    border:1px solid rgba(239,68,68,.18) !important;
    transition:all .22s ease;
    overflow:hidden;
  }

  .sh-logout:hover{
    color:#fff;
    background:rgba(239,68,68,.16) !important;
    box-shadow:0 12px 28px rgba(239,68,68,.18);
  }

  .sh-overlay{
    position:fixed;
    inset:0;
    z-index:740;
    background:rgba(4,7,20,.48);
    backdrop-filter:blur(4px);
    display:none;
  }

  .sh-modal-overlay{
    position:fixed;
    inset:0;
    z-index:980;
    background:rgba(3,6,18,.62);
    backdrop-filter:blur(6px);
    display:flex;
    align-items:center;
    justify-content:center;
    padding:20px;
  }

  .sh-modal{
    width:min(100%, 420px);
    border-radius:24px;
    padding:22px;
    background:linear-gradient(180deg, rgba(13,18,42,.98), rgba(7,11,28,.98));
    border:1px solid rgba(255,255,255,.08);
    box-shadow:0 26px 70px rgba(0,0,0,.42);
  }

  .sh-modal-icon{
    width:54px;
    height:54px;
    border-radius:18px;
    display:flex;
    align-items:center;
    justify-content:center;
    background:rgba(239,68,68,.12);
    border:1px solid rgba(239,68,68,.16);
    color:#f87171;
    margin-bottom:16px;
  }

  .sh-modal-title{
    color:#fff;
    font-size:22px;
    font-weight:900;
    font-family:'Manrope',sans-serif;
    letter-spacing:-.4px;
    margin-bottom:8px;
  }

  .sh-modal-text{
    color:rgba(255,255,255,.58);
    font-size:14px;
    line-height:1.7;
    margin-bottom:20px;
    font-family:'Manrope',sans-serif;
  }

  .sh-modal-actions{
    display:flex;
    gap:12px;
  }

  .sh-modal-btn{
    flex:1;
    height:46px;
    border-radius:14px;
    font-size:14px;
    font-weight:800;
    font-family:'Manrope',sans-serif;
    transition:all .2s ease;
  }

  .sh-modal-btn.cancel{
    color:rgba(255,255,255,.76);
    background:rgba(255,255,255,.06) !important;
    border:1px solid rgba(255,255,255,.10) !important;
  }

  .sh-modal-btn.cancel:hover{
    background:rgba(255,255,255,.10) !important;
    color:#fff;
  }

  .sh-modal-btn.logout{
    color:#fff;
    background:#ef4444 !important;
    border:1px solid rgba(239,68,68,.4) !important;
    box-shadow:0 10px 24px rgba(239,68,68,.26);
  }

  .sh-modal-btn.logout:hover{
    transform:translateY(-1px);
    background:#dc2626 !important;
  }

  @media (max-width: 900px){
    .sh-mobilebar{
      position:fixed;
      top:0;
      left:0;
      right:0;
      z-index:720;
      height:66px;
      display:flex;
      align-items:center;
      justify-content:space-between;
      padding:0 16px;
      background:rgba(6,10,28,.94);
      backdrop-filter:blur(18px);
      border-bottom:1px solid rgba(255,255,255,.08);
    }

    .sh-mobilebrand{
      display:flex;
      align-items:center;
      gap:10px;
      min-width:0;
    }

    .sh-mobilelogo{
      width:38px;
      height:38px;
      border-radius:12px;
      object-fit:contain;
      background:rgba(255,255,255,.06);
      border:1px solid rgba(255,255,255,.08);
      padding:5px;
      flex:0 0 38px;
    }

    .sh-mobiletitle{
      color:#fff;
      font-size:17px;
      font-weight:900;
      font-family:'Manrope',sans-serif;
      letter-spacing:-.3px;
    }

    .sh-mobilemenu{
      width:42px;
      height:42px;
      border-radius:12px;
      display:flex;
      align-items:center;
      justify-content:center;
      color:#fff;
      background:rgba(255,255,255,.06) !important;
      border:1px solid rgba(255,255,255,.08) !important;
    }

    .sh-sidebar{
      top:0;
      width:230px;
      z-index:760;
      transform:translateX(-110%);
      transition:transform .26s ease;
      padding-top:18px;
    }

    .sh-sidebar.expanded,
    .sh-sidebar.mobile-open{
      width:230px;
    }

    .sh-sidebar.mobile-open{
      transform:translateX(0);
    }

    .sh-sidebar .sh-brand-text,
    .sh-sidebar .sh-link-label{
      opacity:1;
      transform:translateX(0);
      pointer-events:auto;
    }

    .sh-link-tip{ display:none; }
    .sh-overlay.show{ display:block; }
    .sh-overlay{
      background:rgba(4,7,20,.28);
      backdrop-filter:none;
    }
  }
`;

export default function StaffHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const [hovered, setHovered] = useState(false);
  const [pinned, setPinned] = useState(() => {
    return localStorage.getItem("staff_sidebar_pinned") === "true";
  });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window === "undefined") return true;
    return window.innerWidth > 900;
  });

  useEffect(() => {
    localStorage.setItem("staff_sidebar_pinned", String(pinned));
  }, [pinned]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const mediaQuery = window.matchMedia("(min-width: 901px)");
    const updateViewportMode = (event) => {
      setIsDesktop(event.matches);
      if (event.matches) {
        setMobileOpen(false);
      }
    };

    setIsDesktop(mediaQuery.matches);

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", updateViewportMode);
      return () => mediaQuery.removeEventListener("change", updateViewportMode);
    }

    mediaQuery.addListener(updateViewportMode);
    return () => mediaQuery.removeListener(updateViewportMode);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("staff-sidebar-pinned", pinned);
    return () => {
      document.body.classList.remove("staff-sidebar-pinned");
    };
  }, [pinned]);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const expanded = useMemo(
    () => pinned || (isDesktop && hovered) || mobileOpen,
    [pinned, isDesktop, hovered, mobileOpen]
  );
  const layoutExpanded = pinned;

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleNavClick = () => {
    if (!isDesktop && mobileOpen) {
      setMobileOpen(false);
    }
  };

  const asideClass = [
    "sh-sidebar",
    expanded ? "expanded" : "",
    mobileOpen ? "mobile-open" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="sh-wrap">
      <style>{CSS}</style>

      <div className="sh-mobilebar">
        <div className="sh-mobilebrand">
          <img
            src={unimateLogo}
            alt="Unimate"
            className="sh-mobilelogo"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
          <div className="sh-mobiletitle">Unimate</div>
        </div>

        <button
          type="button"
          className="sh-mobilemenu"
          onClick={() => {
            setHovered(false);
            setMobileOpen((prev) => !prev);
          }}
          aria-label={mobileOpen ? "Close staff menu" : "Open staff menu"}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <div
        className={`sh-overlay ${mobileOpen ? "show" : ""}`}
        onClick={() => setMobileOpen(false)}
      />

      <aside
        className={asideClass}
        data-layout-expanded={layoutExpanded ? "true" : "false"}
        onMouseEnter={() => {
          if (isDesktop) setHovered(true);
        }}
        onMouseLeave={() => {
          if (isDesktop) setHovered(false);
        }}
      >
        <div className="sh-top">
          <div className="sh-brand">
            <img
              src={unimateLogo}
              alt="Unimate"
              className="sh-logo"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                const fallback = e.currentTarget.nextSibling;
                if (fallback) fallback.style.display = "flex";
              }}
            />
            <div className="sh-brand-fallback">U</div>

            <div className="sh-brand-text">
              <div className="sh-title">Unimate</div>
              <div className="sh-subtitle">Staff Panel</div>
            </div>
          </div>
        </div>

        <div className="sh-divider" />

        <nav className="sh-nav">
          {NAV_ITEMS.map(({ label, path, end, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              end={end}
              className={({ isActive }) => `sh-link ${isActive ? "active" : ""}`}
              onClick={handleNavClick}
            >
              <span className="sh-link-icon">
                <Icon size={20} strokeWidth={2.1} />
              </span>
              <span className="sh-link-label">{label}</span>
              <span className="sh-link-tip">{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sh-bottom">
          <div className="sh-bottom-divider" />
          <div className="sh-bottom-actions">
            <button
              type="button"
              className="sh-logout"
              onClick={() => setConfirmOpen(true)}
            >
              <span className="sh-link-icon">
                <LogOut size={20} strokeWidth={2.1} />
              </span>
              <span className="sh-link-label">Logout</span>
              <span className="sh-link-tip">Logout</span>
            </button>

            <button
              type="button"
              className="sh-pin"
              onClick={() => setPinned((prev) => !prev)}
              aria-label={pinned ? "Unpin sidebar" : "Pin sidebar"}
              title={pinned ? "Unpin sidebar" : "Pin sidebar"}
            >
              {pinned ? <PanelLeftClose size={16} /> : <PanelLeftOpen size={16} />}
            </button>
          </div>
        </div>
      </aside>

      {confirmOpen && (
        <div className="sh-modal-overlay" onClick={() => setConfirmOpen(false)}>
          <div className="sh-modal" onClick={(e) => e.stopPropagation()}>
            <div className="sh-modal-icon">
              <TriangleAlert size={24} />
            </div>

            <div className="sh-modal-title">Log out?</div>
            <div className="sh-modal-text">
              Are you sure you want to sign out of the staff panel?
            </div>

            <div className="sh-modal-actions">
              <button
                type="button"
                className="sh-modal-btn cancel"
                onClick={() => setConfirmOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="sh-modal-btn logout"
                onClick={handleSignOut}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}