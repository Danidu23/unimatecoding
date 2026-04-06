import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, User, Info, Hand, MessageCircle } from 'lucide-react';
import { mockItems } from '../mockdata'; // Using mock data
import { dynamicMatchesCache } from '../data/lostFoundAdvanced';

export default function ItemDetails() {
  const { id } = useParams();
  const numericId = parseInt(id);
  const item = mockItems.find(i => i.id === numericId) || dynamicMatchesCache[numericId];

  if (!item) {
    return (
      <div className="text-center py-20 text-white">
        <h1 className="text-2xl font-bold">Item not found</h1>
        <Link to="/browse" className="text-gold hover:underline mt-4 inline-block">
          Back to Browse
        </Link>
      </div>
    );
  }

  const statusStyles = {
    UNCLAIMED: { bg: 'rgba(239, 68, 68, 0.1)', text: '#ef4444', border: 'rgba(239, 68, 68, 0.2)' },
    CLAIMED: { bg: 'rgba(52, 211, 153, 0.1)', text: '#34d399', border: 'rgba(52, 211, 153, 0.2)' },
  };

  const currentStatus = statusStyles[item.status] || statusStyles.UNCLAIMED;

  return (
    <div style={{ width: "100%", minHeight: "calc(100vh - 66px)", background: "#07091a", padding: "40px clamp(20px,6vw,60px)" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <Link to="/browse" style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "rgba(255,255,255,.6)", fontSize: "14px", marginBottom: "24px", textDecoration: "none" }}>
          <ArrowLeft size={16} /> Back to Browse
        </Link>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(24px, 5vw, 60px)", alignItems: "flex-start" }}>
          {/* Image Section */}
          <div style={{ borderRadius: "24px", overflow: "hidden", border: "1px solid rgba(255,255,255,.1)", background: "#101222", aspectRatio: "4/3" }}>
            <img src={item.image || item.img} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>

          {/* Details Section */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ padding: "4px 12px", fontSize: "12px", fontWeight: 700, borderRadius: "8px", background: currentStatus.bg, color: currentStatus.text, border: `1px solid ${currentStatus.border}` }}>
                {item.status}
              </span>
              <span style={{ padding: "4px 12px", fontSize: "12px", fontWeight: 700, borderRadius: "8px", background: "rgba(255,255,255,.05)", color: "rgba(255,255,255,.6)", border: "1px solid rgba(255,255,255,.1)" }}>
                {item.category}
              </span>
            </div>
            
            <h1 style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 900, color: "#fff", fontFamily: "Manrope,sans-serif", lineHeight: 1.2 }}>{item.title}</h1>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <DetailCard icon={<MapPin size={20} />} label="Location Found" value={item.location} />
              <DetailCard icon={<Calendar size={20} />} label="Date Found" value={new Date(item.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} />
              <DetailCard icon={<User size={20} />} label="Reported by" value={item.reporter} />
            </div>

            <div>
              <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#fff", fontFamily: "Manrope,sans-serif", marginBottom: "12px" }}>Description</h3>
              <p style={{ fontSize: "15px", color: "rgba(255,255,255,.6)", lineHeight: 1.7 }}>{item.description}</p>
            </div>

            <div style={{ marginTop: "16px", background: "rgba(245, 166, 35, 0.05)", border: "1px solid rgba(245, 166, 35, 0.2)", borderRadius: "16px", padding: "24px" }}>
              <h4 style={{ fontSize: "18px", fontWeight: 800, color: "#fff", fontFamily: "Manrope,sans-serif", marginBottom: "8px" }}>This Item Might Be Mine</h4>
              <p style={{ fontSize: "14px", color: "rgba(255,255,255,.6)", marginBottom: "20px" }}>Submit a claim request with proof of ownership to replace this item.</p>
              <Link to="/messages" className="btn-outline" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', padding: '12px', textDecoration: 'none', marginBottom: '10px' }}>
                <MessageCircle size={16} /> Message Reporter
              </Link>
              <Link to={`/claim/${item.id}`} className="btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', padding: '14px', textDecoration: 'none' }}>
                <Hand size={18} />
                Submit a Claim
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const DetailCard = ({ icon, label, value }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "16px", background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.08)", borderRadius: "12px", padding: "16px" }}>
    <div style={{ flexShrink: 0, color: "#F5A623" }}>{icon}</div>
    <div>
      <p style={{ fontSize: "12px", color: "rgba(255,255,255,.4)", marginBottom: "4px" }}>{label}</p>
      <p style={{ fontSize: "15px", fontWeight: 600, color: "rgba(255,255,255,.8)" }}>{value}</p>
    </div>
  </div>
);

