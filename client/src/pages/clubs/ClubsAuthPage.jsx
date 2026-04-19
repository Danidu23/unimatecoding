import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, GraduationCap } from "lucide-react";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
  *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
  html, body, #root { width:100%; min-height:100vh; }
  body { font-family:'Inter',system-ui,sans-serif; background:#0A0A0A; color:#fff; }
  button { font-family:inherit; cursor:pointer; border:none; }
  a { text-decoration:none; }

  @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  @keyframes glow { 0%,100%{opacity:.5} 50%{opacity:1} }
  @keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-6px)} 75%{transform:translateX(6px)} }

  .ca-wrap { min-height:100vh; display:flex; align-items:stretch; background:#0A0A0A; }
  .ca-left {
    flex:1; display:flex; flex-direction:column; justify-content:center; align-items:center;
    padding:clamp(32px,6vw,64px); position:relative; overflow:hidden;
    background:linear-gradient(145deg,#0A0A0A 0%,#111 50%,#0f0f0f 100%);
  }
  .ca-right {
    width:clamp(340px,44%,500px); background:#111; border-left:1px solid rgba(255,215,0,.12);
    display:flex; flex-direction:column; justify-content:center;
    padding:clamp(32px,5vw,64px) clamp(28px,5vw,52px); overflow-y:auto;
  }
  .ca-input {
    width:100%; background:rgba(255,255,255,.06); border:1.5px solid rgba(255,255,255,.1);
    border-radius:10px; padding:12px 14px 12px 42px; color:#fff; font-size:14px;
    font-family:'Inter',sans-serif; outline:none; transition:border-color .22s, background .22s;
  }
  .ca-input:focus { border-color:rgba(255,215,0,.6); background:rgba(255,215,0,.04); }
  .ca-input.err { border-color:rgba(239,68,68,.6); animation:shake .3s ease; }
  .ca-input::placeholder { color:rgba(255,255,255,.3); }
  .ca-btn {
    width:100%; display:flex; align-items:center; justify-content:center; gap:8px;
    background:#FFD700; color:#0A0A0A; border:none; border-radius:10px;
    padding:14px; font-size:15px; font-weight:700; font-family:'Inter',sans-serif;
    cursor:pointer; transition:transform .2s, box-shadow .2s, background .2s;
    box-shadow:0 4px 20px rgba(255,215,0,.35); margin-top:8px;
  }
  .ca-btn:hover { transform:translateY(-2px); box-shadow:0 8px 28px rgba(255,215,0,.5); background:#ffe629; }
  .ca-btn:disabled { opacity:.5; cursor:not-allowed; transform:none; }
  .ca-link-btn {
    width:100%; display:flex; align-items:center; justify-content:center;
    background:rgba(255,255,255,.05); border:1.5px solid rgba(255,255,255,.12);
    border-radius:10px; padding:13px; font-size:14px; font-weight:600;
    color:rgba(255,255,255,.8); cursor:pointer; transition:all .22s;
  }
  .ca-link-btn:hover { border-color:rgba(255,215,0,.4); color:#FFD700; background:rgba(255,215,0,.06); }
  .ca-err { display:flex; align-items:center; gap:8px; background:rgba(239,68,68,.08); border:1px solid rgba(239,68,68,.25); border-radius:9px; padding:10px 14px; margin-bottom:14px; font-size:13px; color:#f87171; }
  .ca-field { position:relative; margin-bottom:14px; }
  .ca-field-icon { position:absolute; left:13px; top:50%; transform:translateY(-50%); color:rgba(255,255,255,.35); display:flex; pointer-events:none; }
  .ca-label { font-size:11px; font-weight:700; color:rgba(255,255,255,.5); letter-spacing:.6px; text-transform:uppercase; display:flex; align-items:center; gap:5px; margin-bottom:6px; }
  .ca-divider { display:flex; align-items:center; gap:10px; margin:18px 0; }
  .ca-div-line { flex:1; height:1px; background:rgba(255,255,255,.08); }
  @media(max-width:768px){
    .ca-wrap{flex-direction:column;}
    .ca-left{min-height:200px;flex:none;}
    .ca-right{width:100%;border-left:none;border-top:1px solid rgba(255,215,0,.12);}
  }
`;

export default function ClubsAuthPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user) {
      try {
        const parsedUser = JSON.parse(user);
        if (parsedUser?.role === "admin") navigate("/clubs/admin", { replace: true });
        else navigate("/clubs", { replace: true });
        return;
      } catch {
        localStorage.removeItem("user");
      }
    }

    navigate("/login", { replace: true, state: { from: "/clubs" } });
  }, [navigate]);

  return (
    <>
      <style>{CSS}</style>
      <div className="ca-wrap">
        <div className="ca-left">
          <div style={{ position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)", width: "500px", height: "300px", background: "radial-gradient(ellipse,rgba(255,215,0,.08) 0%,transparent 70%)", animation: "glow 5s ease-in-out infinite", pointerEvents: "none" }} />
          <div style={{ position: "relative", textAlign: "center", maxWidth: "400px", animation: "fadeUp .6s ease both" }}>
            <div style={{ width: "60px", height: "60px", background: "#FFD700", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", boxShadow: "0 6px 30px rgba(255,215,0,.4)" }}>
              <GraduationCap size={30} color="#0A0A0A" />
            </div>
            <h1 style={{ fontSize: "clamp(28px,4vw,40px)", fontWeight: 900, color: "#fff", letterSpacing: "-1px", lineHeight: 1.1, marginBottom: "14px" }}>
              Clubs &<br />
              <span style={{ color: "#FFD700" }}>Societies</span>
            </h1>
            <p style={{ fontSize: "15px", color: "rgba(255,255,255,.5)", lineHeight: 1.75, marginBottom: "20px" }}>
              Clubs is now part of the main UniMate student experience.
            </p>
          </div>
        </div>

        <div className="ca-right">
          <div style={{ animation: "fadeUp .5s ease both" }}>
            <div style={{ marginBottom: "28px" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(255,215,0,.1)", border: "1px solid rgba(255,215,0,.25)", borderRadius: "100px", padding: "4px 12px", marginBottom: "14px" }}>
                <span style={{ fontSize: "11px", fontWeight: 700, color: "#FFD700", letterSpacing: ".5px" }}>SLIIT CAMPUS — UniMate</span>
              </div>
              <h2 style={{ fontSize: "24px", fontWeight: 800, color: "#fff", letterSpacing: "-0.5px", marginBottom: "8px" }}>
                Use your UniMate login
              </h2>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,.4)", lineHeight: 1.7 }}>
                Clubs no longer has a separate login or registration flow. You will be redirected to the main login page if you are not signed in.
              </p>
            </div>

            <div className="ca-err" style={{ marginBottom: "18px" }}>
              <AlertCircle size={15} style={{ flexShrink: 0 }} />
              Continue with your main UniMate account to access clubs.
            </div>

            <button
              type="button"
              className="ca-btn"
              onClick={() => navigate("/login", { state: { from: "/clubs" } })}
            >
              Go to UniMate Login
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
