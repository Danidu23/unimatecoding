import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react";
import api from "../api/axios";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800;900&family=DM+Sans:wght@400;500;700&display=swap');

  *{box-sizing:border-box}
  body{margin:0}
  .rp-wrap{
    min-height:100vh;
    background:linear-gradient(180deg,#07091a 0%,#0a1028 100%);
    display:flex;
    align-items:center;
    justify-content:center;
    padding:24px;
    color:#fff;
    font-family:'DM Sans',sans-serif;
  }
  .rp-card{
    width:min(460px,100%);
    background:rgba(255,255,255,.04);
    border:1px solid rgba(255,255,255,.08);
    border-radius:28px;
    padding:28px;
    box-shadow:0 18px 45px rgba(0,0,0,.28);
    backdrop-filter:blur(16px);
  }
  .rp-title{
    font-family:'Manrope',sans-serif;
    font-size:30px;
    font-weight:900;
    letter-spacing:-.8px;
    margin-bottom:8px;
  }
  .rp-sub{
    color:rgba(255,255,255,.55);
    line-height:1.7;
    font-size:14px;
    margin-bottom:20px;
  }
  .rp-label{
    display:block;
    font-size:12px;
    font-weight:800;
    letter-spacing:.5px;
    text-transform:uppercase;
    color:rgba(255,255,255,.5);
    margin-bottom:8px;
    font-family:'Manrope',sans-serif;
  }
  .rp-input-wrap{
    position:relative;
    margin-bottom:16px;
  }
  .rp-icon{
    position:absolute;
    left:13px;
    top:50%;
    transform:translateY(-50%);
    color:rgba(255,255,255,.35);
  }
  .rp-toggle{
    position:absolute;
    right:13px;
    top:50%;
    transform:translateY(-50%);
    background:none;
    border:none;
    color:rgba(255,255,255,.35);
    cursor:pointer;
  }
  .rp-input{
    width:100%;
    padding:13px 42px 13px 42px;
    border-radius:14px;
    border:1.5px solid rgba(255,255,255,.08);
    background:rgba(255,255,255,.04);
    color:#fff;
    outline:none;
    font-size:14px;
  }
  .rp-input:focus{
    border-color:rgba(245,166,35,.4);
    background:rgba(245,166,35,.04);
  }
  .rp-btn{
    width:100%;
    border:none;
    border-radius:14px;
    background:#F5A623;
    color:#07091a;
    padding:14px;
    font-size:14px;
    font-weight:900;
    font-family:'Manrope',sans-serif;
    cursor:pointer;
  }
  .rp-btn:disabled{
    opacity:.6;
    cursor:not-allowed;
  }
  .rp-msg{
    margin-bottom:14px;
    padding:11px 13px;
    border-radius:12px;
    display:flex;
    align-items:center;
    gap:8px;
    font-size:13px;
  }
  .rp-msg.error{
    background:rgba(239,68,68,.10);
    border:1px solid rgba(239,68,68,.22);
    color:#f87171;
  }
  .rp-msg.success{
    background:rgba(34,197,94,.10);
    border:1px solid rgba(34,197,94,.22);
    color:#4ade80;
  }
  .rp-link{
    display:inline-flex;
    align-items:center;
    gap:8px;
    margin-top:16px;
    color:rgba(255,255,255,.72);
    font-size:14px;
  }
`;

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showCf, setShowCf] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!password || !confirm) {
      setError("Please fill all fields.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const res = await api.put(`/auth/reset-password/${token}`, {
        password,
      });

      setSuccess(res.data.message || "Password reset successfully.");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="rp-wrap">
        <div className="rp-card">
          <div className="rp-title">Reset Password</div>
          <div className="rp-sub">
            Enter your new password below and confirm it to finish resetting your account.
          </div>

          {error && (
            <div className="rp-msg error">
              <AlertCircle size={15} />
              {error}
            </div>
          )}

          {success && (
            <div className="rp-msg success">
              <CheckCircle2 size={15} />
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <label className="rp-label">New Password</label>
            <div className="rp-input-wrap">
              <span className="rp-icon">
                <Lock size={16} />
              </span>
              <input
                className="rp-input"
                type={showPw ? "text" : "password"}
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="button" className="rp-toggle" onClick={() => setShowPw((v) => !v)}>
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <label className="rp-label">Confirm Password</label>
            <div className="rp-input-wrap">
              <span className="rp-icon">
                <Lock size={16} />
              </span>
              <input
                className="rp-input"
                type={showCf ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
              <button type="button" className="rp-toggle" onClick={() => setShowCf((v) => !v)}>
                {showCf ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <button className="rp-btn" type="submit" disabled={loading}>
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>

          <Link to="/login" className="rp-link">
            <ArrowLeft size={16} />
            Back to Login
          </Link>
        </div>
      </div>
    </>
  );
}