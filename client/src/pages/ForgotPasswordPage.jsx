import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import api from "../api/axios";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800;900&family=DM+Sans:wght@400;500;700&display=swap');

  *{box-sizing:border-box}
  body{margin:0}
  .fp-wrap{
    min-height:100vh;
    background:linear-gradient(180deg,#07091a 0%,#0a1028 100%);
    display:flex;
    align-items:center;
    justify-content:center;
    padding:24px;
    color:#fff;
    font-family:'DM Sans',sans-serif;
  }
  .fp-card{
    width:min(460px,100%);
    background:rgba(255,255,255,.04);
    border:1px solid rgba(255,255,255,.08);
    border-radius:28px;
    padding:28px;
    box-shadow:0 18px 45px rgba(0,0,0,.28);
    backdrop-filter:blur(16px);
  }
  .fp-title{
    font-family:'Manrope',sans-serif;
    font-size:30px;
    font-weight:900;
    letter-spacing:-.8px;
    margin-bottom:8px;
  }
  .fp-sub{
    color:rgba(255,255,255,.55);
    line-height:1.7;
    font-size:14px;
    margin-bottom:20px;
  }
  .fp-label{
    display:block;
    font-size:12px;
    font-weight:800;
    letter-spacing:.5px;
    text-transform:uppercase;
    color:rgba(255,255,255,.5);
    margin-bottom:8px;
    font-family:'Manrope',sans-serif;
  }
  .fp-input-wrap{
    position:relative;
    margin-bottom:16px;
  }
  .fp-icon{
    position:absolute;
    left:13px;
    top:50%;
    transform:translateY(-50%);
    color:rgba(255,255,255,.35);
  }
  .fp-input{
    width:100%;
    padding:13px 14px 13px 42px;
    border-radius:14px;
    border:1.5px solid rgba(255,255,255,.08);
    background:rgba(255,255,255,.04);
    color:#fff;
    outline:none;
    font-size:14px;
  }
  .fp-input:focus{
    border-color:rgba(245,166,35,.4);
    background:rgba(245,166,35,.04);
  }
  .fp-btn{
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
  .fp-btn:disabled{
    opacity:.6;
    cursor:not-allowed;
  }
  .fp-msg{
    margin-bottom:14px;
    padding:11px 13px;
    border-radius:12px;
    display:flex;
    align-items:center;
    gap:8px;
    font-size:13px;
  }
  .fp-msg.error{
    background:rgba(239,68,68,.10);
    border:1px solid rgba(239,68,68,.22);
    color:#f87171;
  }
  .fp-msg.success{
    background:rgba(34,197,94,.10);
    border:1px solid rgba(34,197,94,.22);
    color:#4ade80;
  }
  .fp-link{
    display:inline-flex;
    align-items:center;
    gap:8px;
    margin-top:16px;
    color:rgba(255,255,255,.72);
    font-size:14px;
  }
  .fp-reset-link{
    margin-top:14px;
    padding:12px;
    border-radius:12px;
    background:rgba(255,255,255,.04);
    border:1px dashed rgba(255,255,255,.12);
    word-break:break-all;
    font-size:12px;
    color:#F5A623;
  }
`;

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resetUrl, setResetUrl] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setResetUrl("");

    if (!email) {
      setError("Please enter your email.");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/auth/forgot-password", { email });

      setSuccess(res.data.message || "Reset link generated.");
      setResetUrl(res.data.resetUrl || "");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to process request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="fp-wrap">
        <div className="fp-card">
          <div className="fp-title">Forgot Password</div>
          <div className="fp-sub">
            Enter your email and we’ll generate a password reset link for your account.
          </div>

          {error && (
            <div className="fp-msg error">
              <AlertCircle size={15} />
              {error}
            </div>
          )}

          {success && (
            <div className="fp-msg success">
              <CheckCircle2 size={15} />
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <label className="fp-label">Email Address</label>
            <div className="fp-input-wrap">
              <span className="fp-icon">
                <Mail size={16} />
              </span>
              <input
                className="fp-input"
                type="email"
                placeholder="yourname@slit.lk"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button className="fp-btn" type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          {resetUrl && (
            <div className="fp-reset-link">
              Development reset link: {resetUrl}
            </div>
          )}

          <Link to="/login" className="fp-link">
            <ArrowLeft size={16} />
            Back to Login
          </Link>
        </div>
      </div>
    </>
  );
}