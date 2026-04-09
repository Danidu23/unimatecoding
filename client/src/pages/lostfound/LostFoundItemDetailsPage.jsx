import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, User, Hand, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { mockItems } from '../../data/lostfound/mockdata';
import { dynamicMatchesCache } from '../../data/lostfound/lostFoundAdvanced';
import SafeImage from '../../components/lostfound/SafeImage';
import { getImageFallbacks } from '../../utils/lostfound/imageFallbacks';

const CURRENT_USER_ID = 'student-user-001';
const CURRENT_USER_NAME = 'You (Student)';

export default function LostFoundItemDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startingChat, setStartingChat] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        let found = null;
        for (const kind of ['lost', 'found']) {
          const response = await fetch(`http://localhost:5000/api/items/${kind}/${id}`);
          if (response.ok) {
            const result = await response.json();
            if (result.success) {
              const data = result.data;
              found = kind === 'lost'
                ? { id: data._id, title: data.itemName, category: data.category, location: data.lastSeenLocation, date: data.dateLost, description: data.description, image: data.image, reporter: data.contact, status: data.status || 'Pending' }
                : { id: data._id, title: data.itemName, category: data.category, location: data.locationFound, date: data.dateFound, description: data.description, image: data.image, reporter: data.finderContact, status: data.status || 'Pending' };
              break;
            }
          }
        }

        if (!found) {
          const numericId = parseInt(id, 10);
          found = mockItems.find((entry) => entry.id === numericId) || dynamicMatchesCache[numericId] || null;
        }

        setItem(found);
      } catch (error) {
        const numericId = parseInt(id, 10);
        setItem(mockItems.find((entry) => entry.id === numericId) || dynamicMatchesCache[numericId] || null);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const startChat = async () => {
    if (!item || startingChat) return;

    try {
      setStartingChat(true);
      const reporterId = item.reporter || `reporter-${item.id}`;
      const reporterName = item.type === 'found' ? 'Finder' : 'Reporter';

      const response = await fetch('http://localhost:5000/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          participantIds: [CURRENT_USER_ID, reporterId],
          participantNames: [CURRENT_USER_NAME, reporterName],
          participantAvatars: [
            'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80'
          ],
          itemId: String(item.id),
          itemTitle: item.title
        })
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        toast.error(result.message || 'Failed to open chat');
        return;
      }

      navigate(`/lost-found/messages?conversationId=${result.data._id}`);
    } catch (error) {
      console.error('Start chat error:', error);
      toast.error('Unable to open chat right now');
    } finally {
      setStartingChat(false);
    }
  };

  if (loading) {
    return (
      <div style={{ width: '100%', minHeight: 'calc(100vh - 66px)', background: '#07091a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'rgba(255,255,255,.7)' }}>Loading item...</div>
      </div>
    );
  }

  if (!item) {
    return (
      <div style={{ width: '100%', minHeight: 'calc(100vh - 66px)', background: '#07091a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 20px' }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 900, color: '#fff', marginBottom: '12px' }}>Item not found</h1>
          <button
            type='button'
            onClick={() => navigate('/lost-found/browse')}
            className='btn-primary'
            style={{ textDecoration: 'none' }}
          >
            <ArrowLeft size={16} /> Back to Browse
          </button>
        </div>
      </div>
    );
  }

  const status = String(item.status || 'Pending').toLowerCase();
  const currentStatus = status === 'approved' || status === 'verified' || status === 'matched' || status === 'claimed'
    ? { bg: 'rgba(34,197,94,.1)', text: '#22c55e', border: 'rgba(34,197,94,.2)' }
    : status === 'rejected'
      ? { bg: 'rgba(239,68,68,.1)', text: '#ef4444', border: 'rgba(239,68,68,.2)' }
      : { bg: 'rgba(245,166,35,.1)', text: '#F5A623', border: 'rgba(245,166,35,.2)' };

  return (
    <div style={{ width: '100%', minHeight: 'calc(100vh - 66px)', background: '#07091a', padding: '40px clamp(20px,6vw,60px)' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <button
        type='button'
        onClick={() => navigate('/lost-found/browse')}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          color: 'rgba(255,255,255,.6)',
          fontSize: '14px',
          marginBottom: '24px',
          textDecoration: 'none',
          background: 'transparent',
          border: 'none',
          padding: 0,
          cursor: 'pointer'
        }}
      >
        <ArrowLeft size={16} /> Back to Browse
      </button>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(24px, 5vw, 60px)', alignItems: 'flex-start' }}>
          <div style={{ borderRadius: '24px', overflow: 'hidden', border: '1px solid rgba(255,255,255,.1)', background: '#101222', aspectRatio: '4/3' }}>
            <SafeImage src={item.image || item.img} alt={item.title} fallbackCandidates={getImageFallbacks({ category: item.category, type: item.type, title: item.title })} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <span style={{ padding: '4px 12px', fontSize: '12px', fontWeight: 700, borderRadius: '999px', background: currentStatus.bg, color: currentStatus.text, border: `1px solid ${currentStatus.border}` }}>{item.status || 'Pending'}</span>
              <span style={{ padding: '4px 12px', fontSize: '12px', fontWeight: 700, borderRadius: '999px', background: 'rgba(255,255,255,.05)', color: 'rgba(255,255,255,.6)', border: '1px solid rgba(255,255,255,.1)' }}>{item.category}</span>
            </div>

            <h1 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 900, color: '#fff', fontFamily: 'Manrope,sans-serif', lineHeight: 1.2 }}>{item.title}</h1>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <DetailCard icon={<MapPin size={20} />} label='Location' value={item.location} />
              <DetailCard icon={<Calendar size={20} />} label='Date' value={new Date(item.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} />
              <DetailCard icon={<User size={20} />} label='Reported by' value={item.reporter || 'Campus user'} />
            </div>

            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#fff', fontFamily: 'Manrope,sans-serif', marginBottom: '12px' }}>Description</h3>
              <p style={{ fontSize: '15px', color: 'rgba(255,255,255,.6)', lineHeight: 1.7 }}>{item.description}</p>
            </div>

            <div style={{ marginTop: '16px', background: 'rgba(245, 166, 35, 0.05)', border: '1px solid rgba(245, 166, 35, 0.2)', borderRadius: '16px', padding: '24px' }}>
              <h4 style={{ fontSize: '18px', fontWeight: 800, color: '#fff', fontFamily: 'Manrope,sans-serif', marginBottom: '8px' }}>Claim or Report Matching</h4>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,.6)', marginBottom: '20px' }}>If this is your item, submit a claim and wait for admin review before it can be released.</p>
              <button type='button' onClick={startChat} disabled={startingChat} className='btn-outline' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', padding: '12px', textDecoration: 'none', marginBottom: '10px' }}>
                <MessageCircle size={16} /> {startingChat ? 'Opening Chat...' : 'Message Reporter'}
              </button>
              <button
                type='button'
                onClick={() => navigate(`/lost-found/claim/${item.id}`)}
                className='btn-primary'
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', padding: '14px', textDecoration: 'none' }}
              >
                <Hand size={18} /> Submit a Claim
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const DetailCard = ({ icon, label, value }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.08)', borderRadius: '12px', padding: '16px' }}>
    <div style={{ flexShrink: 0, color: '#F5A623' }}>{icon}</div>
    <div>
      <p style={{ fontSize: '12px', color: 'rgba(255,255,255,.4)', marginBottom: '4px' }}>{label}</p>
      <p style={{ fontSize: '15px', fontWeight: 600, color: 'rgba(255,255,255,.8)' }}>{value}</p>
    </div>
  </div>
);
