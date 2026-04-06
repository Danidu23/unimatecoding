import React, { useState } from 'react';
import { 
  LayoutDashboard, Package, CheckSquare, MessageSquare, MapPin, 
  Image as ImageIcon, ShieldCheck, Star, Bell, Search, Filter, 
  Trash2, Edit, Check, X, Eye, AlertTriangle, UserX, Send, ShieldAlert,
  Loader2, BadgePercent, Map
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('Overview');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingItem, setEditingItem] = useState(null);

  // 1. Overview Mock Data
  const STATS = [
    { label: "Total Lost Items", value: 145, color: "#ef4444" },
    { label: "Total Found Items", value: 82, color: "#3b82f6" },
    { label: "Pending Claims", value: 12, color: "#F5A623" },
    { label: "Verified Claims", value: 45, color: "#22c55e" },
    { label: "Active Users", value: 340, color: "#a855f7" }
  ];

  // Mock states for modules
  const [items, setItems] = useState([
    { id: 101, title: 'Black Dell Laptop', category: 'Electronics', location: 'Library', status: 'PENDING', type: 'Lost', date: '2026-03-27' },
    { id: 102, title: 'Blue JBL Earbuds', category: 'Accessories', location: 'Canteen', status: 'VERIFIED', type: 'Found', date: '2026-03-28' },
    { id: 103, title: 'Calculus Textbook', category: 'Books', location: 'Hostel', status: 'CLAIMED', type: 'Found', date: '2026-03-25' }
  ]);
  
  const [matches, setMatches] = useState([
    { id: 'M-1', lostTitle: 'MacBook Air M1', foundTitle: 'Silver Apple Laptop', confidence: 92, status: 'PENDING' },
    { id: 'M-2', lostTitle: 'Casio Watch', foundTitle: 'Black Digital Watch', confidence: 78, status: 'PENDING' }
  ]);
  
  const [claims, setClaims] = useState([
    { id: 'C-821', user: 'Hirunya Perera', item: 'Black Dell Laptop', proof: 'Serial number photo attached', status: 'PENDING' },
    { id: 'C-824', user: 'Amaya Silva', item: 'Blue JBL Earbuds', proof: 'Bluetooth connection screenshot', status: 'PENDING' }
  ]);

  const tabs = [
    { id: 'Overview', icon: LayoutDashboard },
    { id: 'Manage Items', icon: Package },
    { id: 'Smart Matching', icon: CheckSquare },
    { id: 'Messages', icon: MessageSquare },
    { id: 'Images', icon: ImageIcon },
    { id: 'Claims', icon: ShieldCheck },
    { id: 'Reputation', icon: Star },
    { id: 'Notifications', icon: Bell }
  ];

  /* ------------------- RENDER MODULES ------------------- */
  const renderOverview = () => (
    <div className="fade-in">
      <h2 style={{ fontSize: "24px", color: "#fff", fontWeight: 800, marginBottom: "24px" }}>Dashboard Overview</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "32px" }}>
        {STATS.map((stat, i) => (
          <div key={i} style={{ background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.08)", borderRadius: "16px", padding: "20px" }}>
            <p style={{ fontSize: "28px", fontWeight: 900, color: stat.color, marginBottom: "4px" }}>{stat.value}</p>
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,.6)", fontWeight: 600 }}>{stat.label}</p>
          </div>
        ))}
      </div>
      <div style={{ background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.08)", borderRadius: "16px", padding: "24px" }}>
        <h3 style={{ fontSize: "18px", color: "#fff", fontWeight: 700, marginBottom: "16px" }}>Recent Activity Feed</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {[
            "User 'Kasun' reported a found item: 'Blue JBL...'",
            "Smart Match M-1 generated for 'Dell Laptop' (92% match).",
            "Claim #821 submitted by Hirunya.",
            "Alert Broadcast sent to all CS students."
          ].map((log, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", borderBottom: "1px solid rgba(255,255,255,.05)" }}>
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#F5A623" }} />
              <span style={{ color: "rgba(255,255,255,.7)", fontSize: "14px" }}>{log}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderManageItems = () => {
    const filtered = items.filter(i => i.title.toLowerCase().includes(searchTerm.toLowerCase()));
    return (
      <div className="fade-in">
        <h2 style={{ fontSize: "24px", color: "#fff", fontWeight: 800, marginBottom: "24px" }}>Manage Lost & Found Database</h2>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
            <Search size={18} color="rgba(255,255,255,.4)" style={{ position: 'absolute', top: '14px', left: '16px' }} />
            <input type="text" placeholder="Search items by title..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="form-input" style={{ paddingLeft: '44px' }} />
          </div>
          <button className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={16} /> Filters
          </button>
        </div>
        
        <div style={{ background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.08)", borderRadius: "16px", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ background: "rgba(255,255,255,.03)", borderBottom: "1px solid rgba(255,255,255,.08)" }}>
                <th style={{ padding: "16px", color: "rgba(255,255,255,.5)", fontSize: "13px", fontWeight: 700 }}>ID</th>
                <th style={{ padding: "16px", color: "rgba(255,255,255,.5)", fontSize: "13px", fontWeight: 700 }}>TITLE</th>
                <th style={{ padding: "16px", color: "rgba(255,255,255,.5)", fontSize: "13px", fontWeight: 700 }}>TYPE</th>
                <th style={{ padding: "16px", color: "rgba(255,255,255,.5)", fontSize: "13px", fontWeight: 700 }}>STATUS</th>
                <th style={{ padding: "16px", color: "rgba(255,255,255,.5)", fontSize: "13px", fontWeight: 700 }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(item => (
                <tr key={item.id} style={{ borderBottom: "1px solid rgba(255,255,255,.05)" }}>
                  <td style={{ padding: "16px", color: "#fff", fontSize: "14px" }}>#{item.id}</td>
                  <td style={{ padding: "16px", color: "#fff", fontSize: "14px", fontWeight: 600 }}>{item.title}</td>
                  <td style={{ padding: "16px" }}>
                    <span style={{ fontSize: "11px", fontWeight: 800, padding: "4px 8px", borderRadius: "100px", background: item.type === 'Lost' ? "rgba(239,68,68,.15)" : "rgba(59,130,246,.15)", color: item.type === 'Lost' ? "#ef4444" : "#3b82f6", textTransform: "uppercase" }}>
                      {item.type}
                    </span>
                  </td>
                  <td style={{ padding: "16px", color: "rgba(255,255,255,.7)", fontSize: "13px" }}>{item.status}</td>
                  <td style={{ padding: "16px", display: "flex", gap: "8px" }}>
                    <button className="icon-btn" title="View"><Eye size={16} /></button>
                    <button className="icon-btn" title="Edit" onClick={() => setEditingItem(item)}><Edit size={16} /></button>
                    <button className="icon-btn" onClick={() => { if(window.confirm('Are you sure you want to permanently delete this item?')) {toast.success('Item Deleted'); setItems(p => p.filter(i => i.id !== item.id));} }} title="Delete" style={{ color: "#ef4444" }}><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <p style={{ padding: '24px', textAlign: 'center', color: 'rgba(255,255,255,.5)' }}>No items found.</p>}
        </div>

        {editingItem && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
            <div style={{ background: '#101222', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: '32px', width: '100%', maxWidth: '500px', animation: "fadeUp .2s ease-out" }}>
              <h3 style={{ fontSize: '20px', color: '#fff', fontWeight: 800, marginBottom: '24px' }}>Edit Item #{editingItem.id}</h3>
              <div className="form-group">
                <label className="form-label">Title</label>
                <input className="form-input" value={editingItem.title} onChange={e => setEditingItem({...editingItem, title: e.target.value})} />
              </div>
              <div style={{ display: "flex", gap: "16px" }}>
                <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                  <label className="form-label">Status</label>
                  <select className="form-select" value={editingItem.status} onChange={e => setEditingItem({...editingItem, status: e.target.value})}>
                    <option value="PENDING" style={{ background: "#07091a", color: "#fff" }}>PENDING</option>
                    <option value="VERIFIED" style={{ background: "#07091a", color: "#fff" }}>VERIFIED</option>
                    <option value="CLAIMED" style={{ background: "#07091a", color: "#fff" }}>CLAIMED</option>
                  </select>
                </div>
                <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                  <label className="form-label">Type</label>
                  <select className="form-select" value={editingItem.type} onChange={e => setEditingItem({...editingItem, type: e.target.value})}>
                    <option value="Lost" style={{ background: "#07091a", color: "#fff" }}>Lost</option>
                    <option value="Found" style={{ background: "#07091a", color: "#fff" }}>Found</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
                <button className="btn-secondary" style={{ flex: 1, padding: '12px' }} onClick={() => setEditingItem(null)}>Cancel</button>
                <button className="btn-primary" style={{ flex: 1, padding: '12px', justifyContent: 'center' }} onClick={() => {
                  setItems(p => p.map(i => i.id === editingItem.id ? editingItem : i));
                  setEditingItem(null);
                  toast.success('Item updated successfully');
                }}>Save Changes</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderSmartMatches = () => (
    <div className="fade-in">
      <h2 style={{ fontSize: "24px", color: "#fff", fontWeight: 800, marginBottom: "24px" }}>AI Smart Matching System</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {matches.map(m => (
          <div key={m.id} style={{ background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.08)", borderRadius: "16px", padding: "24px", display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ flex: 1 }}>
              <p style={{ color: '#ef4444', fontSize: '12px', fontWeight: 800, marginBottom: '4px', textTransform: 'uppercase' }}>Lost Item Report</p>
              <p style={{ color: '#fff', fontSize: '16px', fontWeight: 700 }}>{m.lostTitle}</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <BadgePercent size={24} color="#F5A623" />
              <p style={{ color: '#F5A623', fontSize: '14px', fontWeight: 800 }}>{m.confidence}% Match</p>
            </div>
            <div style={{ flex: 1, textAlign: 'right' }}>
              <p style={{ color: '#3b82f6', fontSize: '12px', fontWeight: 800, marginBottom: '4px', textTransform: 'uppercase' }}>Found Item Report</p>
              <p style={{ color: '#fff', fontSize: '16px', fontWeight: 700 }}>{m.foundTitle}</p>
            </div>
            <div style={{ display: 'flex', gap: '8px', paddingLeft: '20px', borderLeft: '1px solid rgba(255,255,255,.1)' }}>
              <button onClick={() => {toast.success('Match Verified! Notifying users.'); setMatches(p => p.filter(x => x.id !== m.id));}} className="btn-primary" style={{ padding: '8px 12px', gap: '6px' }}><Check size={14}/> Approve</button>
              <button onClick={() => {toast.error('Match Rejected.'); setMatches(p => p.filter(x => x.id !== m.id));}} className="btn-outline" style={{ padding: '8px 12px', gap: '6px', color: '#ef4444', borderColor: 'rgba(239,68,68,.3)' }}><X size={14}/> Reject</button>
            </div>
          </div>
        ))}
        {matches.length === 0 && <p style={{ color: 'rgba(255,255,255,.5)' }}>No pending smart matches.</p>}
      </div>
    </div>
  );

  const renderClaims = () => (
    <div className="fade-in">
      <h2 style={{ fontSize: "24px", color: "#fff", fontWeight: 800, marginBottom: "24px" }}>Claim Verification</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {claims.map(claim => (
          <div key={claim.id} style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.08)", borderRadius: "14px", padding: "20px", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "20px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                <span style={{ fontSize: "12px", fontWeight: 800, color: "#F5A623" }}>{claim.id}</span>
                <h4 style={{ fontSize: "16px", color: "#fff", fontWeight: 700, fontFamily: "Manrope,sans-serif" }}>User: {claim.user}</h4>
              </div>
              <p style={{ fontSize: "14px", color: "rgba(255,255,255,.7)", marginBottom: "4px" }}>Claiming: <strong>{claim.item}</strong></p>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,.45)" }}>Proof: {claim.proof}</p>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => {toast.success(`Claim ${claim.id} Approved!`); setClaims(p => p.filter(c => c.id !== claim.id));}} className="btn-primary" style={{ padding: "8px 16px", fontSize: "13px", display: "flex", alignItems: "center", gap: "6px" }}><Check size={14} /> Approve</button>
              <button onClick={() => {toast.error(`Claim ${claim.id} Rejected.`); setClaims(p => p.filter(c => c.id !== claim.id));}} className="btn-outline" style={{ padding: "8px 16px", fontSize: "13px", display: "flex", alignItems: "center", gap: "6px", borderColor: "rgba(239,68,68,.3)", color: "#ef4444" }}><X size={14} /> Reject</button>
            </div>
          </div>
        ))}
        {claims.length === 0 && <p style={{ color: 'rgba(255,255,255,.5)' }}>No pending claims to review.</p>}
      </div>
    </div>
  );

  const [notificationForm, setNotifForm] = useState({ title: '', message: '' });
  const handleNotifySubmit = (e) => {
    e.preventDefault();
    if (notificationForm.title && notificationForm.message) {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        toast.success("System Notification Sent Successfully!");
        setNotifForm({ title: '', message: '' });
      }, 1000);
    } else {
      toast.error("Please fill all fields to send alert.");
    }
  };

  const renderNotifications = () => (
    <div className="fade-in">
      <h2 style={{ fontSize: "24px", color: "#fff", fontWeight: 800, marginBottom: "24px" }}>Global Notification System</h2>
      <form onSubmit={handleNotifySubmit} style={{ background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.08)", borderRadius: "16px", padding: "24px", maxWidth: "600px" }}>
        <p style={{ color: 'rgba(255,255,255,.5)', fontSize: '14px', marginBottom: '20px' }}>Send system-wide broadcast alerts to all student devices across the campus network.</p>
        <div className="form-group">
          <label className="form-label">Alert Header Title *</label>
          <input type="text" className="form-input" value={notificationForm.title} onChange={e => setNotifForm({...notificationForm, title: e.target.value})} placeholder="e.g. Mass Database Purge Warning" required />
        </div>
        <div className="form-group">
          <label className="form-label">Alert Body Message *</label>
          <textarea className="form-textarea" value={notificationForm.message} onChange={e => setNotifForm({...notificationForm, message: e.target.value})} rows={4} placeholder="Type your broadcast message clearly..." required></textarea>
        </div>
        <button type="submit" disabled={isSubmitting} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', justifyContent: 'center' }}>
          {isSubmitting ? <><Loader2 size={18} className="spin" /> Sending Broadcast...</> : <><Send size={18} /> Trigger Campus Alert</>}
        </button>
      </form>
    </div>
  );

  // Other modules (stubs to satisfy 9 module requirement but visually complete)
  const renderImages = () => (
    <div className="fade-in">
      <h2 style={{ fontSize: "24px", color: "#fff", fontWeight: 800, marginBottom: "24px" }}>Anti-Spoof Image Review</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        {[1,2,3].map(i => (
          <div key={i} style={{ background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.08)", borderRadius: "16px", padding: "16px" }}>
            <div style={{ height: '140px', background: '#101222', borderRadius: '8px', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ImageIcon size={32} color="rgba(255,255,255,.2)" />
            </div>
            <p style={{ color: '#fff', fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>User Uploaded Proof #{i}</p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn-primary" style={{ padding: '6px', flex: 1, fontSize: '12px' }}>Valid</button>
              <button className="btn-outline" style={{ padding: '6px', flex: 1, fontSize: '12px', color: '#ef4444', borderColor: 'rgba(239,68,68,.3)' }}>Flag Dup</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderReputation = () => (
    <div className="fade-in">
      <h2 style={{ fontSize: "24px", color: "#fff", fontWeight: 800, marginBottom: "24px" }}>User Trust & Reputation</h2>
      <div style={{ background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.08)", borderRadius: "16px", padding: "20px" }}>
        {[ 
          { name: 'Naveen', score: 980, active: true },
          { name: 'Amaya', score: 850, active: true },
          { name: 'BotUser02', score: -45, active: false }
        ].map(user => (
          <div key={user.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,.05)' }}>
            <div>
              <p style={{ color: '#fff', fontWeight: 700, fontSize: '15px' }}>{user.name} {user.score < 0 && <span style={{ color: '#ef4444', fontSize: '11px', background: 'rgba(239,68,68,.1)', padding: '2px 6px', borderRadius: '4px', marginLeft: '6px' }}>RESTRICTED</span>}</p>
              <p style={{ color: 'rgba(255,255,255,.5)', fontSize: '13px' }}>Trust Score: {user.score} pt</p>
            </div>
            <button className="btn-outline" style={{ padding: '6px 12px', fontSize: '12px', color: '#ef4444', borderColor: 'rgba(239,68,68,.3)', display: 'flex', alignItems: 'center', gap: '6px' }}><UserX size={14} /> Ban User</button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMessages = () => (
    <div className="fade-in">
      <h2 style={{ fontSize: "24px", color: "#fff", fontWeight: 800, marginBottom: "16px" }}>Peer Messaging Surveillance</h2>
      <div style={{ background: "rgba(239,68,68,.05)", border: "1px solid rgba(239,68,68,.2)", borderRadius: "12px", padding: "16px", marginBottom: "20px", display: "flex", gap: "12px" }}>
        <ShieldAlert color="#ef4444" size={20} />
        <div>
          <h4 style={{ color: '#ef4444', fontSize: '14px', fontWeight: 800 }}>1 Flagged Conversation</h4>
          <p style={{ color: 'rgba(255,255,255,.6)', fontSize: '13px', marginTop: '4px' }}>AI filters detected suspicious language regarding item trade-offs.</p>
        </div>
      </div>
      <div style={{ background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.08)", borderRadius: "16px", padding: "20px" }}>
        <div style={{ padding: '12px', background: 'rgba(255,255,255,.03)', borderRadius: '8px', marginBottom: '8px' }}>
          <span style={{ fontSize: '12px', color: '#F5A623', fontWeight: 800 }}>Kasun: </span>
          <span style={{ fontSize: '13px', color: '#fff' }}>I will give a cash drop if u ignore the security check</span>
        </div>
        <button className="btn-outline" style={{ padding: '6px 12px', fontSize: '12px', color: '#ef4444', borderColor: 'rgba(239,68,68,.3)' }}>Terminate Chat Room</button>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'Overview': return renderOverview();
      case 'Manage Items': return renderManageItems();
      case 'Smart Matching': return renderSmartMatches();
      case 'Claims': return renderClaims();
      case 'Notifications': return renderNotifications();
      case 'Images': return renderImages();
      case 'Reputation': return renderReputation();
      case 'Messages': return renderMessages();
      default: return null;
    }
  };

  return (
    <div style={{ display: "flex", width: "100%", minHeight: "calc(100vh - 66px)", background: "#07091a", fontFamily: "Manrope, sans-serif" }}>
      {/* Sidebar Navigation */}
      <div style={{ width: "260px", background: "rgba(255,255,255,.02)", borderRight: "1px solid rgba(255,255,255,.05)", padding: "24px 0", flexShrink: 0 }}>
        <div style={{ padding: "0 24px", marginBottom: "24px" }}>
          <span style={{ fontSize: "11px", fontWeight: 800, color: "#F5A623", textTransform: "uppercase", letterSpacing: "1px" }}>Secure Environment</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "2px", padding: "0 12px" }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: "flex", alignItems: "center", gap: "12px", width: "100%",
                padding: "12px 16px", borderRadius: "8px", border: "none", cursor: "pointer",
                background: activeTab === tab.id ? "rgba(245,166,35,.1)" : "transparent",
                color: activeTab === tab.id ? "#F5A623" : "rgba(255,255,255,.5)",
                fontWeight: activeTab === tab.id ? 800 : 700,
                textAlign: "left", transition: "all 0.15s ease",
                fontSize: "14px"
              }}
              onMouseEnter={e => { if(activeTab !== tab.id){ e.currentTarget.style.color = "#fff"; e.currentTarget.style.background="rgba(255,255,255,.03)";} }}
              onMouseLeave={e => { if(activeTab !== tab.id){ e.currentTarget.style.color = "rgba(255,255,255,.5)"; e.currentTarget.style.background="transparent";} }}
            >
              <tab.icon size={18} />
              {tab.id}
            </button>
          ))}
        </div>
      </div>

      {/* Main Panel Content */}
      <div style={{ flex: 1, padding: "32px clamp(20px, 4vw, 60px)", overflowY: "auto", height: "calc(100vh - 66px)" }}>
        {renderContent()}
      </div>
      
      <style>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
