import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarDays, MapPin, Package } from 'lucide-react';
import ReputationCard from '../../components/lostfound/ReputationCard';
import { MOCK_REPUTATION } from '../../data/lostfound/lostFoundAdvanced';
import SafeImage from '../../components/lostfound/SafeImage';
import { getImageFallbacks } from '../../utils/lostfound/imageFallbacks';
import { getCurrentUserEmail } from '../../utils/lostfound/sessionUser';

export default function MyLostFoundReportsPage() {
  const navigate = useNavigate();
  const heroImage = 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1800&q=80&auto=format&fit=crop';
  const [activeTab, setActiveTab] = useState('lost');
  const [reputation, setReputation] = useState(MOCK_REPUTATION);
  const [myLostItems, setMyLostItems] = useState([]);
  const [myFoundItems, setMyFoundItems] = useState([]);
  const [myClaims, setMyClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserEmail, setCurrentUserEmailState] = useState('');

  const tabs = [
    { id: 'lost', label: 'Lost Items' },
    { id: 'found', label: 'Found Items' },
    { id: 'claims', label: 'Claims' },
  ];

  // Fetch user's submitted items from database
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const userEmail = getCurrentUserEmail();
        setCurrentUserEmailState(userEmail);

        const extractEmail = (text) => {
          const match = String(text || '').match(/([A-Z0-9._%+-]+@my\.sliit\.lk)/i);
          return match ? match[1].toLowerCase() : '';
        };

        const [lostRes, foundRes, claimsRes] = await Promise.all([
          fetch('http://localhost:5001/api/lost-found/items/lost'),
          fetch('http://localhost:5001/api/lost-found/items/found'),
          fetch('http://localhost:5001/api/lost-found/claims')
        ]);

        const lostData = await lostRes.json();
        const foundData = await foundRes.json();
        const claimsData = await claimsRes.json();

        // Transform lost items
        if (lostData.success && lostData.data) {
          const lost = lostData.data
            .filter((item) => userEmail && extractEmail(item.description) === userEmail)
            .map(item => ({
              id: item._id,
              name: item.itemName,
              date: new Date(item.dateLost).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
              status: item.status || 'Pending',
              location: item.lastSeenLocation,
              image: item.image || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=900&q=80',
              detail: item.description
            }));
          setMyLostItems(lost);
        }

        // Transform found items
        if (foundData.success && foundData.data) {
          const found = foundData.data
            .filter((item) => userEmail && extractEmail(item.description) === userEmail)
            .map(item => ({
            id: item._id,
            name: item.itemName,
            date: new Date(item.dateFound).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            status: item.status || 'Pending',
            location: item.locationFound,
            image: item.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&q=80',
            detail: item.description
          }));
          setMyFoundItems(found);
        }

        if (claimsData.success && claimsData.data) {
          const claims = claimsData.data
            .filter((claim) => userEmail && extractEmail(claim.explanation) === userEmail)
            .map(claim => ({
              id: claim._id,
              itemRefId: claim.itemId?._id || claim.itemId || null,
              name: claim.identifier,
              date: new Date(claim.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
              status: claim.status,
              location: claim.itemId?.lastSeenLocation || claim.itemId?.locationFound || 'Campus',
              image: claim.proofImage || 'https://images.unsplash.com/photo-1523966211575-eb4a01e7dd51?w=900&q=80',
              detail: claim.explanation
            }));
          setMyClaims(claims);
        }
      } catch (error) {
        console.error('Error fetching items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const activeList = useMemo(() => {
    if (activeTab === 'lost') return myLostItems;
    if (activeTab === 'found') return myFoundItems;
    return myClaims;
  }, [activeTab, myLostItems, myFoundItems, myClaims]);

  const getStatusStyle = (status) => {
    const normalized = status.toLowerCase();
    if (normalized === 'matched' || normalized === 'approved' || normalized === 'verified') {
      return {
        background: 'rgba(34,197,94,.15)',
        border: '1px solid rgba(34,197,94,.3)',
        color: '#4ade80',
      };
    }
    if (normalized === 'pending') {
      return {
        background: 'rgba(245,166,35,.15)',
        border: '1px solid rgba(245,166,35,.3)',
        color: '#F5A623',
      };
    }
    return {
      background: 'rgba(239,68,68,.15)',
      border: '1px solid rgba(239,68,68,.3)',
      color: '#f87171',
    };
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div style={{
          marginTop: '20px',
          textAlign: 'center',
          padding: '60px 20px',
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid rgba(245,166,35,.2)',
            borderTop: '3px solid #F5A623',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto',
          }} />
          <p style={{ color: 'rgba(255,255,255,.6)', marginTop: '16px' }}>Loading items...</p>
        </div>
      );
    }

    if (!activeList.length) {
      return (
        <div style={{
          marginTop: '20px',
          background: 'rgba(255,255,255,.02)',
          border: '1.5px dashed rgba(255,255,255,.12)',
          borderRadius: '20px',
          padding: '70px 24px',
          textAlign: 'center',
        }}>
          <Package size={42} style={{ color: 'rgba(255,255,255,.25)', marginBottom: '14px' }} />
          <p style={{ fontSize: '20px', color: '#fff', fontWeight: 800, fontFamily: 'Manrope,sans-serif', marginBottom: '6px' }}>
            No records found
          </p>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,.45)' }}>
            You have not submitted any {activeTab} records yet.
          </p>
        </div>
      );
    }

    return (
      <div style={{
        marginTop: '22px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '22px',
      }}>
        {activeList.map((item, index) => (
          <div
            key={item.id}
            className="grid-item"
            style={{
              animation: `fadeUp .45s ease ${index * 0.08}s both`,
              padding: '0',
              overflow: 'hidden',
              minHeight: '380px',
            }}
          >
            <div style={{
              height: '160px',
              margin: '18px',
              marginBottom: '14px',
              borderRadius: '12px',
              background: 'rgba(255,255,255,.04)',
              border: '1px solid rgba(255,255,255,.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'rgba(255,255,255,.25)',
              fontWeight: 600,
            }}>
              {item.image ? <SafeImage src={item.image} alt={item.name} fallbackCandidates={getImageFallbacks({ category: item.category, title: item.name })} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }} /> : 'No Image'}
            </div>

            <div style={{ padding: '0 18px 18px', display: 'flex', flexDirection: 'column', height: 'calc(100% - 192px)' }}>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
                <span style={{
                  ...getStatusStyle(item.status),
                  borderRadius: '999px',
                  padding: '4px 12px',
                  fontSize: '11px',
                  fontWeight: 800,
                  fontFamily: 'Manrope,sans-serif',
                  textTransform: 'uppercase',
                  letterSpacing: '.5px',
                }}>
                  {item.status}
                </span>
              </div>

              <h3 style={{ fontSize: '29px', fontWeight: 800, color: '#fff', fontFamily: 'Manrope,sans-serif', marginBottom: '8px', lineHeight: 1.2 }}>
                {item.name}
              </h3>

              <p style={{ color: 'rgba(255,255,255,.5)', fontSize: '13px', lineHeight: 1.55, marginBottom: '14px' }}>
                {item.detail}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '7px', color: 'rgba(255,255,255,.52)', fontSize: '13px' }}>
                  <MapPin size={14} color="#F5A623" />
                  <span>{item.location}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '7px', color: 'rgba(255,255,255,.52)', fontSize: '13px' }}>
                  <CalendarDays size={14} color="#F5A623" />
                  <span>{item.date}</span>
                </div>
              </div>

              <div style={{ marginTop: 'auto' }}>
                <button
                  className="btn-primary"
                  style={{ width: '100%', justifyContent: 'center', padding: '12px 18px', fontSize: '13px' }}
                  onClick={() => navigate(`/lost-found/item/${item.itemRefId || item.id}`)}
                >
                  View Details
                </button>
                {activeTab === 'found' ? (
                  <button
                    className="btn-outline"
                    style={{ width: '100%', justifyContent: 'center', marginTop: '8px', padding: '10px 14px', fontSize: '12px' }}
                    onClick={() =>
                      setReputation((prev) => ({
                        ...prev,
                        itemsReturned: prev.itemsReturned + 1,
                        points: prev.points + 30,
                        trustScore: Math.min(100, prev.trustScore + 2)
                      }))
                    }
                  >
                    Mark As Returned (+Points)
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div style={{ width: '100%', minHeight: 'calc(100vh - 66px)', background: '#07091a' }}>
      <div style={{
        background: 'linear-gradient(135deg,#07091a 0%,#0b1234 55%,#111939 100%)',
        borderBottom: '1px solid rgba(255,255,255,.06)',
        padding: '34px clamp(20px,6vw,60px) 34px',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '170px',
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 36%',
          opacity: 0.55,
          transform: 'scale(1.04)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(115deg, rgba(7,9,26,.74) 6%, rgba(10,16,44,.62) 45%, rgba(7,9,26,.68) 100%)',
          pointerEvents: 'none',
        }} />
        <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{
            width: 'fit-content',
            marginBottom: '12px',
            borderRadius: '999px',
            border: '1px solid rgba(245,166,35,.38)',
            background: 'rgba(245,166,35,.14)',
            color: '#ffd788',
            fontSize: '11px',
            fontWeight: 800,
            letterSpacing: '.7px',
            textTransform: 'uppercase',
            padding: '6px 12px',
            position: 'relative',
          }}>
            Personal Dashboard
          </div>
          <h1 style={{ fontSize: '44px', fontWeight: 900, color: '#fff', fontFamily: 'Manrope,sans-serif', marginBottom: '8px', letterSpacing: '-1px' }}>
            My Reports
          </h1>
          <p style={{ color: 'rgba(255,255,255,.72)', fontSize: '18px', maxWidth: '700px' }}>
            Track the status of your reported items and claims.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '22px clamp(20px,6vw,60px) 80px' }}>
        <div style={{ marginBottom: '18px' }}>
          <ReputationCard profile={reputation} />
        </div>

        <div style={{ display: 'flex', gap: '18px', borderBottom: '1px solid rgba(255,255,255,.08)', overflowX: 'auto' }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                position: 'relative',
                padding: '0 22px 14px',
                fontSize: '20px',
                fontWeight: 800,
                fontFamily: 'Manrope,sans-serif',
                color: activeTab === tab.id ? '#F5A623' : 'rgba(255,255,255,.5)',
                background: 'none',
                border: 'none',
                whiteSpace: 'nowrap',
                transition: 'color .2s',
              }}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span style={{
                  position: 'absolute',
                  left: '22px',
                  right: '22px',
                  bottom: '-1px',
                  height: '3px',
                  borderRadius: '999px',
                  background: '#F5A623',
                }} />
              )}
            </button>
          ))}
        </div>

        {!currentUserEmail ? (
          <p style={{ marginTop: '12px', fontSize: '13px', color: 'rgba(245,166,35,.85)' }}>
            Submit a report with your SLIIT email first to personalize My Reports.
          </p>
        ) : null}

        {renderContent()}

        <div style={{ paddingTop: '34px', display: 'flex', justifyContent: 'center' }}>
          <button
            type="button"
            onClick={() => navigate('/lost-found')}
            style={{
              color: 'rgba(255,255,255,.45)',
              fontSize: '14px',
              transition: 'color .2s',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: 0
            }}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
