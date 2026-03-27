import { NavLink, useNavigate } from "react-router-dom";

const CSS = `
  .sh-wrap *{ box-sizing:border-box; }
  .sh-wrap a{ text-decoration:none; }
  .sh-wrap button{ border:none; background:none; cursor:pointer; font-family:inherit; }

  .sh-nav{
    position:fixed; top:0; left:0; right:0; z-index:500;
    display:flex; align-items:center; justify-content:space-between;
    height:66px;
    padding:0 clamp(16px,4vw,60px);
    background:rgba(5,8,24,.96);
    backdrop-filter:blur(14px);
    border-bottom:1px solid rgba(255,255,255,.06);
  }

  .sh-brand{
    color:#fff;
    font-weight:900;
    font-size:20px;
    font-family:'Manrope',sans-serif;
    letter-spacing:-.4px;
    min-width:110px;
  }

  .sh-links{
    display:flex; align-items:center; gap:34px;
  }

  .sh-link{
    position:relative;
    color:rgba(255,255,255,.62);
    font-size:14px;
    font-weight:600;
    font-family:'Manrope',sans-serif;
    transition:color .22s ease;
    white-space:nowrap;
    padding:2px 0;
  }

  .sh-link::after{
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

  .sh-link:hover{
    color:#fff;
  }
  .sh-link:hover::after{
    transform:scaleX(1);
  }

  .sh-link.active{
    color:#F5A623;
  }
  .sh-link.active::after{
    transform:scaleX(1);
  }

  .sh-actions{
    display:flex; align-items:center; gap:16px;
    min-width:110px; justify-content:flex-end;
  }

  .sh-signout{
    padding:10px 14px;
    border-radius:12px;
    color:#f87171;
    background:rgba(239,68,68,.10) !important;
    border:1px solid rgba(239,68,68,.22) !important;
    font-size:13px;
    font-weight:800;
    font-family:'Manrope',sans-serif;
    transition:all .2s ease;
  }
  .sh-signout:hover{
    background:rgba(239,68,68,.16) !important;
    transform:translateY(-1px);
  }

  @media (max-width: 980px){
    .sh-links{ gap:22px; }
  }

  @media (max-width: 900px){
    .sh-nav{ padding:0 16px; }
    .sh-links{ gap:16px; }
    .sh-actions{ min-width:auto; }
  }

  @media (max-width: 700px){
    .sh-nav{
      height:auto;
      min-height:66px;
      padding:12px 16px;
      flex-wrap:wrap;
      gap:12px;
    }
    .sh-brand{ min-width:auto; }
    .sh-links{
      order:3;
      width:100%;
      gap:18px;
      flex-wrap:wrap;
    }
    .sh-actions{
      margin-left:auto;
    }
  }
`;

export default function StaffHeader() {

  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="sh-wrap">
      <style>{CSS}</style>

      <header className="sh-nav">
        <div className="sh-brand">Staff Panel</div>

        <nav className="sh-links">
          <NavLink
            to="/staff"
            end
            className={({ isActive }) => `sh-link ${isActive ? "active" : ""}`}
          >
            Home
          </NavLink>

          <NavLink
            to="/staff/orders"
            className={({ isActive }) => `sh-link ${isActive ? "active" : ""}`}
          >
            Orders
          </NavLink>

          <NavLink
            to="/staff/menu"
            className={({ isActive }) => `sh-link ${isActive ? "active" : ""}`}
          >
            Menu
          </NavLink>
        </nav>

        <div className="sh-actions">
          <button
            type="button"
            onClick={handleSignOut}
            className="sh-signout"
          >
            Sign Out
          </button>
        </div>
      </header>
    </div>
  );
}