import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarDays, MapPin, Package } from 'lucide-react';

export default function MyReports() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('lost');

  const tabs = [
    { id: 'lost', label: 'Lost Items' },
    { id: 'found', label: 'Found Items' },
    { id: 'claims', label: 'Claims' },
  ];

  const myLostItems = [
    {
      id: 1,
      name: 'Black Leather Wallet',
      date: 'Mar 24, 2026',
      status: 'Matched',
      location: 'Main Library',
      image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=900&q=80',
      detail: 'Brown leather wallet with student ID slot and two debit cards.',
    },
    {
      id: 3,
      name: 'Calculus Textbook',
      date: 'Mar 23, 2026',
      status: 'Pending',
      location: 'Block A',
      image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=900&q=80',
      detail: 'Calculus textbook with highlighted chapters and notes on the first page.',
    },
  ];

  const myFoundItems = [
    {
      id: 4,
      name: 'Campus Keys with Lanyard',
      date: 'Mar 22, 2026',
      status: 'Verified',
      location: 'Canteen Entrance',
      image: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=900&q=80',
      detail: 'Set of silver keys attached to a navy university lanyard.',
    },
  ];

  const myClaims = [
    {
      id: 5,
      name: 'Apple AirPods Pro',
      date: 'Mar 25, 2026',
      status: 'Approved',
      location: 'IT Faculty',
      image: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=900&q=80',
      detail: 'Claim request approved after matching serial number and case engraving.',
    },
    {
      id: 2,
      name: 'Blue Hydroflask',
      date: 'Mar 21, 2026',
      status: 'Rejected',
      location: 'Sports Complex',
      image: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=900&q=80',
      detail: 'Claim rejected due to missing ownership proof and incorrect sticker details.',
    },
  ];

  const activeList = useMemo(() => {
    if (activeTab === 'lost') return myLostItems;
    if (activeTab === 'found') return myFoundItems;
    return myClaims;
  }, [activeTab]);

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
              {item.image ? <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }} /> : 'No Image'}
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
                  onClick={() => navigate(`/item/${item.id}`)}
                >
                  View Details
                </button>
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
        padding: '38px clamp(20px,6vw,60px) 30px',
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '44px', fontWeight: 900, color: '#fff', fontFamily: 'Manrope,sans-serif', marginBottom: '8px', letterSpacing: '-1px' }}>
            My Reports
          </h1>
          <p style={{ color: 'rgba(255,255,255,.62)', fontSize: '18px' }}>
            Track the status of your reported items and claims.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '22px clamp(20px,6vw,60px) 80px' }}>
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

        {renderContent()}

        <div style={{ paddingTop: '34px', display: 'flex', justifyContent: 'center' }}>
          <a href="/" style={{ color: 'rgba(255,255,255,.45)', fontSize: '14px', transition: 'color .2s' }}>
            Back to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
