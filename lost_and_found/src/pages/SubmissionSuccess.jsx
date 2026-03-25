import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle, ArrowLeft } from 'lucide-react';

export default function SubmissionSuccess() {
  const location = useLocation();
  const { message, itemType } = location.state || {
    message: 'Your report has been submitted successfully!',
    itemType: 'Item'
  };

  const isLost = itemType === 'Lost';

  return (
    <div style={{ width: "100%", minHeight: "calc(100vh - 66px)", background: "#07091a", padding: "40px clamp(20px,6vw,60px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ maxWidth: "550px", width: "100%", background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.08)", borderRadius: "24px", padding: "48px 32px", textAlign: "center", animation: "fadeUp .4s ease-out" }}>
        <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "rgba(52, 211, 153,.1)", border: "1.5px solid rgba(52, 211, 153,.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
          <CheckCircle size={32} color="#34D399" />
        </div>
        <h1 style={{ fontSize: "clamp(22px, 4vw, 32px)", fontWeight: 900, color: "#fff", fontFamily: "Manrope,sans-serif", marginBottom: "12px" }}>
          {isLost ? "Lost item report submitted successfully" : "Found item report submitted successfully"}
        </h1>
        <p style={{ fontSize: "15px", color: "rgba(255,255,255,.5)", lineHeight: 1.6, marginBottom: "32px" }}>
          {isLost ? "We've recorded your report. You can track its status in your dashboard." : "Thank you for helping someone recover their lost item!"}
        </p>
        <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
          <Link to="/" className="btn-secondary" style={{ padding: "12px 24px" }}>
            Back to Dashboard
          </Link>
          <Link to="/my-reports" className="btn-primary" style={{ padding: "12px 24px" }}>
            View My Reports
          </Link>
        </div>
      </div>
    </div>
  );
}
