import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowRight } from 'lucide-react';

export default function AdminLogin() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/admin');
  };

  return (
    <div style={{ width: "100%", minHeight: "calc(100vh - 66px)", background: "#07091a", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.08)", borderRadius: "24px", padding: "40px", maxWidth: "420px", width: "100%", animation: "fadeUp .4s ease-out" }}>
        <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: "rgba(245,166,35,.12)", border: "1.5px solid rgba(245,166,35,.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
          <ShieldAlert size={28} color="#F5A623" />
        </div>
        <h2 style={{ fontSize: "28px", fontWeight: 900, color: "#fff", fontFamily: "Manrope,sans-serif", textAlign: "center", marginBottom: "8px" }}>Admin Portal</h2>
        <p style={{ fontSize: "14px", color: "rgba(255,255,255,.5)", textAlign: "center", marginBottom: "32px", lineHeight: 1.6 }}>Restrict access to authorized administrative personnel only.</p>
        
        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Employee ID / Email</label>
            <input type="text" required placeholder="admin@unimate.edu" className="form-input" defaultValue="admin" />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Password</label>
            <input type="password" required placeholder="••••••••" className="form-input" defaultValue="password123" />
          </div>
          
          <button type="submit" className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: "14px", marginTop: "12px", fontSize: "15px" }}>
            Secure Login <ArrowRight size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
