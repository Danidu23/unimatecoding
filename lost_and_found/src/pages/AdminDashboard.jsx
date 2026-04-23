import React, { useEffect, useMemo, useState } from 'react';
import { LayoutDashboard, Package, ShieldCheck, Check, X, RefreshCw, AlertTriangle, ListChecks } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('Overview');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [summary, setSummary] = useState({ pendingLost: 0, pendingFound: 0, approvedLost: 0, approvedFound: 0 });
  const [lostItems, setLostItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);
  const [claims, setClaims] = useState([]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [summaryRes, lostRes, foundRes, claimsRes] = await Promise.all([
        fetch('http://localhost:5000/api/admin/summary'),
        fetch('http://localhost:5000/api/items/lost'),
        fetch('http://localhost:5000/api/items/found'),
        fetch('http://localhost:5000/api/claims')
      ]);

      const [summaryJson, lostJson, foundJson, claimsJson] = await Promise.all([
        summaryRes.json(),
        lostRes.json(),
        foundRes.json(),
        claimsRes.json()
      ]);

      if (summaryJson.success) {
        setSummary(summaryJson.data);
      }
      if (lostJson.success) {
        setLostItems(lostJson.data || []);
      }
      if (foundJson.success) {
        setFoundItems(foundJson.data || []);
      }
      if (claimsJson.success) {
        setClaims(claimsJson.data || []);
      }
    } catch (error) {
      console.error('Admin load error:', error);
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const pendingLost = useMemo(() => lostItems.filter((item) => String(item.status || '').toLowerCase() === 'pending'), [lostItems]);
  const pendingFound = useMemo(() => foundItems.filter((item) => String(item.status || '').toLowerCase() === 'pending'), [foundItems]);
  const pendingClaims = useMemo(() => claims.filter((item) => String(item.status || '').toLowerCase() === 'pending'), [claims]);

  const handleReview = async (type, id, action) => {
    const reviewNote = action === 'reject' ? window.prompt('Enter a rejection note for the student:') || '' : 'Approved by admin';
    try {
      setSaving(true);
      const endpoint = type === 'claim'
        ? `http://localhost:5000/api/claims/${id}/review`
        : `http://localhost:5000/api/items/${type === 'lost' ? 'lost' : 'found'}/${id}/review`;

      const response = await fetch(endpoint, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, reviewNote })
      });

      const result = await response.json();
      if (!result.success) {
        toast.error(result.message || 'Review update failed');
        return;
      }

      toast.success(action === 'approve' ? 'Approved successfully' : 'Rejected successfully');
      await loadData();
    } catch (error) {
      console.error('Review error:', error);
      toast.error('Unable to update review status');
    } finally {
      setSaving(false);
    }
  };

  const stats = [
    { label: 'Pending Lost', value: summary.pendingLost, color: '#ef4444' },
    { label: 'Pending Found', value: summary.pendingFound, color: '#22c55e' },
    { label: 'Approved Lost', value: summary.approvedLost, color: '#F5A623' },
    { label: 'Approved Found', value: summary.approvedFound, color: '#38bdf8' },
    { label: 'Pending Claims', value: pendingClaims.length, color: '#f97316' }
  ];

  const tabs = [
    { id: 'Overview', icon: LayoutDashboard },
    { id: 'Items', icon: Package },
    { id: 'Claims', icon: ShieldCheck }
  ];

  const renderOverview = () => (
    <div className='fade-in'>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ fontSize: '28px', color: '#fff', fontWeight: 900, fontFamily: 'Manrope,sans-serif' }}>Admin Review Console</h2>
          <p style={{ color: 'rgba(255,255,255,.55)', marginTop: '6px' }}>Approve or reject student-submitted items and claims before they become public.</p>
        </div>
        <button className='btn-outline' onClick={loadData} disabled={loading || saving} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <RefreshCw size={16} /> Refresh Data
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        {stats.map((stat) => (
          <div key={stat.label} style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.08)', borderRadius: '18px', padding: '20px' }}>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,.55)', marginBottom: '8px' }}>{stat.label}</p>
            <p style={{ fontSize: '30px', fontWeight: 900, color: stat.color }}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.08)', borderRadius: '20px', padding: '22px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
          <AlertTriangle size={18} color='#F5A623' />
          <h3 style={{ color: '#fff', fontSize: '18px', fontWeight: 800 }}>Review Flow</h3>
        </div>
        <p style={{ color: 'rgba(255,255,255,.65)', lineHeight: 1.7, marginBottom: '12px' }}>1. Student submits a lost item, found item, or claim.</p>
        <p style={{ color: 'rgba(255,255,255,.65)', lineHeight: 1.7, marginBottom: '12px' }}>2. Admin reviews it in this dashboard and approves or rejects it with a note.</p>
        <p style={{ color: 'rgba(255,255,255,.65)', lineHeight: 1.7 }}>3. Approved items become visible in the browse page; rejected items stay in My Reports with the admin note.</p>
      </div>
    </div>
  );

  const renderItems = () => (
    <div className='fade-in'>
      <h2 style={{ fontSize: '24px', color: '#fff', fontWeight: 800, marginBottom: '20px' }}>Pending Item Moderation</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px' }}>
        {[...pendingLost.map((item) => ({ ...item, kind: 'lost', title: item.itemName, location: item.lastSeenLocation })), ...pendingFound.map((item) => ({ ...item, kind: 'found', title: item.itemName, location: item.locationFound }))].map((item) => (
          <div key={item._id} style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.08)', borderRadius: '18px', padding: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '10px' }}>
              <span style={{ display: 'inline-flex', padding: '4px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 800, color: '#F5A623', background: 'rgba(245,166,35,.12)' }}>{item.kind.toUpperCase()}</span>
              <span style={{ color: 'rgba(255,255,255,.45)', fontSize: '12px' }}>{new Date(item.createdAt).toLocaleDateString()}</span>
            </div>
            <h3 style={{ fontSize: '20px', color: '#fff', fontWeight: 800, marginBottom: '6px' }}>{item.title}</h3>
            <p style={{ color: 'rgba(255,255,255,.58)', fontSize: '13px', marginBottom: '6px' }}>{item.category}</p>
            <p style={{ color: 'rgba(255,255,255,.58)', fontSize: '13px', marginBottom: '16px' }}>{item.location}</p>
            <p style={{ color: 'rgba(255,255,255,.5)', fontSize: '13px', lineHeight: 1.6, minHeight: '52px' }}>{item.description}</p>
            <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
              <button className='btn-primary' style={{ flex: 1, justifyContent: 'center', padding: '10px 12px' }} disabled={saving} onClick={() => handleReview(item.kind, item._id, 'approve')}>
                <Check size={16} /> Approve
              </button>
              <button className='btn-outline' style={{ flex: 1, justifyContent: 'center', padding: '10px 12px', color: '#ef4444', borderColor: 'rgba(239,68,68,.3)' }} disabled={saving} onClick={() => handleReview(item.kind, item._id, 'reject')}>
                <X size={16} /> Reject
              </button>
            </div>
          </div>
        ))}
      </div>
      {pendingLost.length + pendingFound.length === 0 ? <p style={{ color: 'rgba(255,255,255,.55)', marginTop: '20px' }}>No pending items to review.</p> : null}
    </div>
  );

  const renderClaims = () => (
    <div className='fade-in'>
      <h2 style={{ fontSize: '24px', color: '#fff', fontWeight: 800, marginBottom: '20px' }}>Claim Approvals</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {claims.map((claim) => (
          <div key={claim._id} style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.08)', borderRadius: '18px', padding: '18px', display: 'flex', flexWrap: 'wrap', gap: '14px', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ minWidth: '240px' }}>
              <p style={{ color: '#F5A623', fontSize: '12px', fontWeight: 800, marginBottom: '4px' }}>STATUS: {claim.status}</p>
              <h3 style={{ color: '#fff', fontSize: '18px', fontWeight: 800, marginBottom: '6px' }}>{claim.identifier}</h3>
              <p style={{ color: 'rgba(255,255,255,.6)', fontSize: '13px', marginBottom: '4px' }}>Proof: {claim.proofImage ? 'Attached' : 'None'}</p>
              <p style={{ color: 'rgba(255,255,255,.55)', fontSize: '13px', lineHeight: 1.6 }}>{claim.explanation}</p>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className='btn-primary' style={{ padding: '10px 14px', justifyContent: 'center' }} disabled={saving} onClick={() => handleReview('claim', claim._id, 'approve')}>
                <Check size={16} /> Approve
              </button>
              <button className='btn-outline' style={{ padding: '10px 14px', justifyContent: 'center', color: '#ef4444', borderColor: 'rgba(239,68,68,.3)' }} disabled={saving} onClick={() => handleReview('claim', claim._id, 'reject')}>
                <X size={16} /> Reject
              </button>
            </div>
          </div>
        ))}
      </div>
      {pendingClaims.length === 0 ? <p style={{ color: 'rgba(255,255,255,.55)', marginTop: '20px' }}>No claims waiting for review.</p> : null}
    </div>
  );

  const renderContent = () => {
    if (activeTab === 'Overview') return renderOverview();
    if (activeTab === 'Items') return renderItems();
    return renderClaims();
  };

  return (
    <div style={{ display: 'flex', width: '100%', minHeight: 'calc(100vh - 66px)', background: '#07091a', fontFamily: 'Manrope, sans-serif' }}>
      <div style={{ width: '260px', background: 'rgba(255,255,255,.02)', borderRight: '1px solid rgba(255,255,255,.05)', padding: '24px 0', flexShrink: 0 }}>
        <div style={{ padding: '0 24px', marginBottom: '24px' }}>
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#F5A623', textTransform: 'uppercase', letterSpacing: '1px' }}>Admin Review</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', padding: '0 12px' }}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '12px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                  background: activeTab === tab.id ? 'rgba(245,166,35,.1)' : 'transparent',
                  color: activeTab === tab.id ? '#F5A623' : 'rgba(255,255,255,.5)', fontWeight: activeTab === tab.id ? 800 : 700,
                  textAlign: 'left', transition: 'all 0.15s ease', fontSize: '14px'
                }}
              >
                <Icon size={18} />
                {tab.id}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ flex: 1, padding: '32px clamp(20px, 4vw, 60px)', overflowY: 'auto', height: 'calc(100vh - 66px)' }}>
        {loading ? <div style={{ color: '#fff' }}>Loading admin data...</div> : renderContent()}
      </div>
    </div>
  );
}
