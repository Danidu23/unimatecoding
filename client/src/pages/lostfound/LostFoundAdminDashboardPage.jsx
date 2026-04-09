import React, { useEffect, useMemo, useState } from 'react';
import { LayoutDashboard, Package, ShieldCheck, Check, X, RefreshCw, AlertTriangle, Search, SlidersHorizontal, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

const PAGE_SIZE = 6;

export default function LostFoundAdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('Overview');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [summary, setSummary] = useState({ pendingLost: 0, pendingFound: 0, approvedLost: 0, approvedFound: 0 });
  const [lostItems, setLostItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);
  const [claims, setClaims] = useState([]);
  const [itemSearch, setItemSearch] = useState('');
  const [itemTypeFilter, setItemTypeFilter] = useState('all');
  const [itemStatusFilter, setItemStatusFilter] = useState('pending');
  const [itemSort, setItemSort] = useState('newest');
  const [itemPage, setItemPage] = useState(1);
  const [claimSearch, setClaimSearch] = useState('');
  const [claimStatusFilter, setClaimStatusFilter] = useState('pending');
  const [claimSort, setClaimSort] = useState('newest');
  const [claimPage, setClaimPage] = useState(1);
  const [proofPreview, setProofPreview] = useState({ open: false, url: '', title: '' });

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

  useEffect(() => {
    setItemPage(1);
  }, [itemSearch, itemTypeFilter, itemStatusFilter, itemSort]);

  useEffect(() => {
    setClaimPage(1);
  }, [claimSearch, claimStatusFilter, claimSort]);

  const pendingLost = useMemo(() => lostItems.filter((item) => String(item.status || '').toLowerCase() === 'pending'), [lostItems]);
  const pendingFound = useMemo(() => foundItems.filter((item) => String(item.status || '').toLowerCase() === 'pending'), [foundItems]);
  const pendingClaims = useMemo(() => claims.filter((item) => String(item.status || '').toLowerCase() === 'pending'), [claims]);

  const allItems = useMemo(() => {
    const lost = lostItems.map((item) => ({
      ...item,
      kind: 'lost',
      title: item.itemName,
      location: item.lastSeenLocation
    }));
    const found = foundItems.map((item) => ({
      ...item,
      kind: 'found',
      title: item.itemName,
      location: item.locationFound
    }));
    return [...lost, ...found];
  }, [lostItems, foundItems]);

  const filteredItems = useMemo(() => {
    const q = itemSearch.trim().toLowerCase();
    const filtered = allItems.filter((item) => {
      const status = String(item.status || '').toLowerCase();
      const typeOk = itemTypeFilter === 'all' ? true : item.kind === itemTypeFilter;
      const statusOk = itemStatusFilter === 'all' ? true : status === itemStatusFilter;
      const searchOk = !q
        ? true
        : String(item.title || '').toLowerCase().includes(q)
          || String(item.description || '').toLowerCase().includes(q)
          || String(item.location || '').toLowerCase().includes(q);

      return typeOk && statusOk && searchOk;
    });

    filtered.sort((a, b) => {
      const left = new Date(a.createdAt || 0).getTime();
      const right = new Date(b.createdAt || 0).getTime();
      return itemSort === 'newest' ? right - left : left - right;
    });

    return filtered;
  }, [allItems, itemSearch, itemTypeFilter, itemStatusFilter, itemSort]);

  const itemPageCount = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE));
  const pagedItems = useMemo(() => {
    const start = (itemPage - 1) * PAGE_SIZE;
    return filteredItems.slice(start, start + PAGE_SIZE);
  }, [filteredItems, itemPage]);

  const filteredClaims = useMemo(() => {
    const q = claimSearch.trim().toLowerCase();
    const filtered = claims.filter((claim) => {
      const status = String(claim.status || '').toLowerCase();
      const statusOk = claimStatusFilter === 'all' ? true : status === claimStatusFilter;
      const searchOk = !q
        ? true
        : String(claim.identifier || '').toLowerCase().includes(q)
          || String(claim.explanation || '').toLowerCase().includes(q)
          || String(claim.reviewNote || '').toLowerCase().includes(q);
      return statusOk && searchOk;
    });

    filtered.sort((a, b) => {
      const left = new Date(a.createdAt || 0).getTime();
      const right = new Date(b.createdAt || 0).getTime();
      return claimSort === 'newest' ? right - left : left - right;
    });

    return filtered;
  }, [claims, claimSearch, claimStatusFilter, claimSort]);

  const claimPageCount = Math.max(1, Math.ceil(filteredClaims.length / PAGE_SIZE));
  const pagedClaims = useMemo(() => {
    const start = (claimPage - 1) * PAGE_SIZE;
    return filteredClaims.slice(start, start + PAGE_SIZE);
  }, [filteredClaims, claimPage]);

  const recentModeration = useMemo(() => {
    const itemReviews = allItems
      .filter((item) => String(item.status || '').toLowerCase() !== 'pending')
      .map((item) => ({
        id: item._id,
        kind: item.kind,
        title: item.title,
        status: item.status,
        reviewedAt: item.reviewedAt || item.updatedAt || item.createdAt,
        reviewNote: item.reviewNote || ''
      }));

    const claimReviews = claims
      .filter((claim) => String(claim.status || '').toLowerCase() !== 'pending')
      .map((claim) => ({
        id: claim._id,
        kind: 'claim',
        title: claim.identifier,
        status: claim.status,
        reviewedAt: claim.reviewedAt || claim.updatedAt || claim.createdAt,
        reviewNote: claim.reviewNote || ''
      }));

    return [...itemReviews, ...claimReviews]
      .sort((a, b) => new Date(b.reviewedAt || 0).getTime() - new Date(a.reviewedAt || 0).getTime())
      .slice(0, 6);
  }, [allItems, claims]);

  const alertLines = useMemo(() => {
    const lines = [];
    if (pendingLost.length + pendingFound.length > 10) {
      lines.push('High moderation queue: more than 10 item reports pending review.');
    }
    if (pendingClaims.length > 4) {
      lines.push('Claims queue is growing: review pending claims to avoid delays.');
    }
    if (!lines.length) {
      lines.push('No urgent moderation alerts right now.');
    }
    return lines;
  }, [pendingLost.length, pendingFound.length, pendingClaims.length]);

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

      let result = null;
      try {
        result = await response.json();
      } catch {
        result = null;
      }

      if (!response.ok || !result?.success) {
        toast.error(result?.message || 'Review update failed');
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
    { label: 'Pending Claims', value: pendingClaims.length, color: '#f97316' },
    { label: 'Total Claims', value: claims.length, color: '#a78bfa' }
  ];

  const tabs = [
    { id: 'Overview', icon: LayoutDashboard },
    { id: 'Items', icon: Package },
    { id: 'Claims', icon: ShieldCheck }
  ];

  const renderPagination = (page, setPage, count) => {
    if (count <= 1) return null;
    return (
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '10px', marginTop: '16px' }}>
        <button className='btn-outline' disabled={page <= 1} style={{ padding: '8px 12px', opacity: page <= 1 ? 0.5 : 1 }} onClick={() => setPage((p) => Math.max(1, p - 1))}>
          <ChevronLeft size={14} />
        </button>
        <span style={{ fontSize: '12px', color: 'rgba(255,255,255,.58)', fontWeight: 700 }}>Page {page} of {count}</span>
        <button className='btn-outline' disabled={page >= count} style={{ padding: '8px 12px', opacity: page >= count ? 0.5 : 1 }} onClick={() => setPage((p) => Math.min(count, p + 1))}>
          <ChevronRight size={14} />
        </button>
      </div>
    );
  };

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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px', marginTop: '20px' }}>
        <div style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.08)', borderRadius: '18px', padding: '18px' }}>
          <h3 style={{ color: '#fff', fontSize: '17px', fontWeight: 800, marginBottom: '10px' }}>System Alerts</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {alertLines.map((line) => (
              <p key={line} style={{ color: 'rgba(255,255,255,.62)', fontSize: '13px', lineHeight: 1.55 }}>{line}</p>
            ))}
          </div>
        </div>

        <div style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.08)', borderRadius: '18px', padding: '18px' }}>
          <h3 style={{ color: '#fff', fontSize: '17px', fontWeight: 800, marginBottom: '10px' }}>Recent Moderation</h3>
          {recentModeration.length ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {recentModeration.map((entry) => (
                <div key={`${entry.kind}-${entry.id}`} style={{ border: '1px solid rgba(255,255,255,.08)', background: 'rgba(255,255,255,.02)', borderRadius: '12px', padding: '10px 12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
                    <p style={{ color: '#fff', fontSize: '13px', fontWeight: 700 }}>{entry.title}</p>
                    <span style={{ color: 'rgba(255,255,255,.5)', fontSize: '11px' }}>{new Date(entry.reviewedAt).toLocaleDateString()}</span>
                  </div>
                  <p style={{ color: '#F5A623', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', marginTop: '3px' }}>{entry.kind} - {entry.status}</p>
                  {entry.reviewNote ? <p style={{ color: 'rgba(255,255,255,.6)', fontSize: '12px', marginTop: '4px' }}>Note: {entry.reviewNote}</p> : null}
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: 'rgba(255,255,255,.55)' }}>No completed moderation actions yet.</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderItems = () => (
    <div className='fade-in'>
      <h2 style={{ fontSize: '24px', color: '#fff', fontWeight: 800, marginBottom: '16px' }}>Item Moderation</h2>
      <div style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.08)', borderRadius: '16px', padding: '14px', marginBottom: '18px', display: 'grid', gridTemplateColumns: '1.6fr repeat(4, minmax(120px, 1fr))', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,.02)', border: '1px solid rgba(255,255,255,.08)', borderRadius: '10px', padding: '0 10px' }}>
          <Search size={15} color='rgba(255,255,255,.55)' />
          <input value={itemSearch} onChange={(e) => setItemSearch(e.target.value)} placeholder='Search title, location, description...' style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: '13px', padding: '10px 0' }} />
        </div>
        <select value={itemTypeFilter} onChange={(e) => setItemTypeFilter(e.target.value)} style={{ background: 'rgba(255,255,255,.02)', color: '#fff', border: '1px solid rgba(255,255,255,.08)', borderRadius: '10px', padding: '10px' }}>
          <option value='all'>All Types</option>
          <option value='lost'>Lost</option>
          <option value='found'>Found</option>
        </select>
        <select value={itemStatusFilter} onChange={(e) => setItemStatusFilter(e.target.value)} style={{ background: 'rgba(255,255,255,.02)', color: '#fff', border: '1px solid rgba(255,255,255,.08)', borderRadius: '10px', padding: '10px' }}>
          <option value='pending'>Pending</option>
          <option value='approved'>Approved</option>
          <option value='rejected'>Rejected</option>
          <option value='all'>All Status</option>
        </select>
        <select value={itemSort} onChange={(e) => setItemSort(e.target.value)} style={{ background: 'rgba(255,255,255,.02)', color: '#fff', border: '1px solid rgba(255,255,255,.08)', borderRadius: '10px', padding: '10px' }}>
          <option value='newest'>Newest</option>
          <option value='oldest'>Oldest</option>
        </select>
        <button className='btn-outline' style={{ justifyContent: 'center', gap: '6px', padding: '10px' }} onClick={() => { setItemSearch(''); setItemTypeFilter('all'); setItemStatusFilter('pending'); setItemSort('newest'); }}>
          <SlidersHorizontal size={14} /> Reset
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px' }}>
        {pagedItems.map((item) => (
          <div key={item._id} style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.08)', borderRadius: '18px', padding: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '10px' }}>
              <span style={{ display: 'inline-flex', padding: '4px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 800, color: '#F5A623', background: 'rgba(245,166,35,.12)' }}>{item.kind.toUpperCase()}</span>
              <span style={{ color: 'rgba(255,255,255,.45)', fontSize: '12px' }}>{new Date(item.createdAt).toLocaleDateString()}</span>
            </div>
            <h3 style={{ fontSize: '20px', color: '#fff', fontWeight: 800, marginBottom: '6px' }}>{item.title}</h3>
            <p style={{ color: 'rgba(255,255,255,.58)', fontSize: '13px', marginBottom: '6px' }}>{item.category} - {item.status}</p>
            <p style={{ color: 'rgba(255,255,255,.58)', fontSize: '13px', marginBottom: '16px' }}>{item.location}</p>
            <p style={{ color: 'rgba(255,255,255,.5)', fontSize: '13px', lineHeight: 1.6, minHeight: '52px' }}>{item.description}</p>

            {item.reviewNote ? <p style={{ color: '#c7d6ff', fontSize: '12px', marginTop: '12px' }}>Admin note: {item.reviewNote}</p> : null}
            {item.reviewedAt ? <p style={{ color: 'rgba(255,255,255,.45)', fontSize: '11px', marginTop: '5px' }}>Reviewed: {new Date(item.reviewedAt).toLocaleString()}</p> : null}

            {String(item.status || '').toLowerCase() === 'pending' ? (
              <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                <button className='btn-primary' style={{ flex: 1, justifyContent: 'center', padding: '10px 12px' }} disabled={saving} onClick={() => handleReview(item.kind, item._id, 'approve')}>
                  <Check size={16} /> Approve
                </button>
                <button className='btn-outline' style={{ flex: 1, justifyContent: 'center', padding: '10px 12px', color: '#ef4444', borderColor: 'rgba(239,68,68,.3)' }} disabled={saving} onClick={() => handleReview(item.kind, item._id, 'reject')}>
                  <X size={16} /> Reject
                </button>
              </div>
            ) : null}
          </div>
        ))}
      </div>
      {!filteredItems.length ? <p style={{ color: 'rgba(255,255,255,.55)', marginTop: '20px' }}>No items match the selected filters.</p> : null}
      {renderPagination(itemPage, setItemPage, itemPageCount)}
    </div>
  );

  const renderClaims = () => (
    <div className='fade-in'>
      <h2 style={{ fontSize: '24px', color: '#fff', fontWeight: 800, marginBottom: '16px' }}>Claim Approvals</h2>
      <div style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.08)', borderRadius: '16px', padding: '14px', marginBottom: '18px', display: 'grid', gridTemplateColumns: '1.8fr repeat(3, minmax(120px, 1fr))', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,.02)', border: '1px solid rgba(255,255,255,.08)', borderRadius: '10px', padding: '0 10px' }}>
          <Search size={15} color='rgba(255,255,255,.55)' />
          <input value={claimSearch} onChange={(e) => setClaimSearch(e.target.value)} placeholder='Search identifier, note, explanation...' style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: '13px', padding: '10px 0' }} />
        </div>
        <select value={claimStatusFilter} onChange={(e) => setClaimStatusFilter(e.target.value)} style={{ background: 'rgba(255,255,255,.02)', color: '#fff', border: '1px solid rgba(255,255,255,.08)', borderRadius: '10px', padding: '10px' }}>
          <option value='pending'>Pending</option>
          <option value='approved'>Approved</option>
          <option value='rejected'>Rejected</option>
          <option value='all'>All Status</option>
        </select>
        <select value={claimSort} onChange={(e) => setClaimSort(e.target.value)} style={{ background: 'rgba(255,255,255,.02)', color: '#fff', border: '1px solid rgba(255,255,255,.08)', borderRadius: '10px', padding: '10px' }}>
          <option value='newest'>Newest</option>
          <option value='oldest'>Oldest</option>
        </select>
        <button className='btn-outline' style={{ justifyContent: 'center', gap: '6px', padding: '10px' }} onClick={() => { setClaimSearch(''); setClaimStatusFilter('pending'); setClaimSort('newest'); }}>
          <SlidersHorizontal size={14} /> Reset
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {pagedClaims.map((claim) => (
          <div key={claim._id} style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.08)', borderRadius: '18px', padding: '18px', display: 'flex', flexWrap: 'wrap', gap: '14px', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ minWidth: '240px' }}>
              <p style={{ color: '#F5A623', fontSize: '12px', fontWeight: 800, marginBottom: '4px' }}>STATUS: {claim.status}</p>
              <h3 style={{ color: '#fff', fontSize: '18px', fontWeight: 800, marginBottom: '6px' }}>{claim.identifier}</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <p style={{ color: 'rgba(255,255,255,.6)', fontSize: '13px' }}>Proof: {claim.proofImage ? 'Attached' : 'None'}</p>
                {claim.proofImage ? (
                  <button className='btn-outline' style={{ padding: '6px 10px', fontSize: '11px' }} onClick={() => setProofPreview({ open: true, url: claim.proofImage, title: claim.identifier })}>
                    <Eye size={13} /> View
                  </button>
                ) : null}
              </div>
              <p style={{ color: 'rgba(255,255,255,.55)', fontSize: '13px', lineHeight: 1.6 }}>{claim.explanation}</p>
              {claim.reviewNote ? <p style={{ color: '#c7d6ff', fontSize: '12px', marginTop: '10px' }}>Admin note: {claim.reviewNote}</p> : null}
              {claim.reviewedAt ? <p style={{ color: 'rgba(255,255,255,.45)', fontSize: '11px', marginTop: '5px' }}>Reviewed: {new Date(claim.reviewedAt).toLocaleString()}</p> : null}
            </div>
            {String(claim.status || '').toLowerCase() === 'pending' ? (
              <div style={{ display: 'flex', gap: '10px' }}>
                <button className='btn-primary' style={{ padding: '10px 14px', justifyContent: 'center' }} disabled={saving} onClick={() => handleReview('claim', claim._id, 'approve')}>
                  <Check size={16} /> Approve
                </button>
                <button className='btn-outline' style={{ padding: '10px 14px', justifyContent: 'center', color: '#ef4444', borderColor: 'rgba(239,68,68,.3)' }} disabled={saving} onClick={() => handleReview('claim', claim._id, 'reject')}>
                  <X size={16} /> Reject
                </button>
              </div>
            ) : null}
          </div>
        ))}
      </div>
      {!filteredClaims.length ? <p style={{ color: 'rgba(255,255,255,.55)', marginTop: '20px' }}>No claims match the selected filters.</p> : null}
      {renderPagination(claimPage, setClaimPage, claimPageCount)}
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

      {proofPreview.open ? (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.78)', zIndex: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }} onClick={() => setProofPreview({ open: false, url: '', title: '' })}>
          <div style={{ width: 'min(880px, 92vw)', background: '#0f1432', border: '1px solid rgba(255,255,255,.15)', borderRadius: '16px', overflow: 'hidden' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', borderBottom: '1px solid rgba(255,255,255,.09)' }}>
              <h3 style={{ color: '#fff', fontSize: '14px', fontWeight: 800 }}>Proof Preview - {proofPreview.title}</h3>
              <button className='btn-outline' style={{ padding: '8px 12px' }} onClick={() => setProofPreview({ open: false, url: '', title: '' })}>Close</button>
            </div>
            <div style={{ padding: '14px', display: 'flex', justifyContent: 'center' }}>
              <img src={proofPreview.url} alt='Claim proof' style={{ maxWidth: '100%', maxHeight: '70vh', borderRadius: '12px', border: '1px solid rgba(255,255,255,.1)', objectFit: 'contain' }} />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
