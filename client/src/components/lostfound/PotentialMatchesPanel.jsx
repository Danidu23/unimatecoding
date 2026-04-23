import React from 'react';
import { Sparkles, MapPin, CalendarDays } from 'lucide-react';
import SafeImage from './SafeImage';
import { getImageFallbacks } from '../../utils/lostfound/imageFallbacks';

export default function PotentialMatchesPanel({ items = [], onOpenItem }) {
  return (
    <div style={{ marginTop: '26px', borderRadius: '18px', border: '1px solid rgba(245,166,35,.3)', background: 'rgba(245,166,35,.08)', padding: '18px' }}>
      <div className="sec-head" style={{ marginBottom: '14px' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'Manrope,sans-serif', fontWeight: 800, color: '#fff' }}>
          <Sparkles size={16} color="#F5A623" /> Potential Matches
        </span>
        <div className="sec-line" />
        <span style={{ color: 'rgba(255,255,255,.6)', fontSize: '12px', fontWeight: 700 }}>{items.length} Suggestions</span>
      </div>

      {items.length === 0 ? (
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,.6)' }}>
          No strong matches yet. Your report is still being scanned against new found items.
        </p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px,1fr))', gap: '12px' }}>
          {items.map((item) => (
            <div
              key={item.id}
              style={{ background: 'rgba(7,9,26,.7)', border: '1px solid rgba(255,255,255,.1)', borderRadius: '14px', overflow: 'hidden', cursor: 'pointer' }}
              onClick={() => onOpenItem?.(item.id)}
            >
              <div style={{ position: 'relative', height: '120px' }}>
                <SafeImage src={item.img} alt={item.title} fallbackCandidates={getImageFallbacks({ category: item.category, type: item.type, title: item.title })} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <span style={{ position: 'absolute', top: '8px', right: '8px', background: '#F5A623', color: '#07091a', borderRadius: '999px', padding: '2px 8px', fontSize: '10px', fontWeight: 900 }}>
                  Potential Match
                </span>
              </div>
              <div style={{ padding: '10px 12px 12px' }}>
                <h4 style={{ color: '#fff', fontSize: '14px', fontWeight: 800, fontFamily: 'Manrope,sans-serif', marginBottom: '8px' }}>{item.title}</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'rgba(255,255,255,.62)' }}><MapPin size={12} color="#F5A623" /> {item.location}</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'rgba(255,255,255,.62)' }}><CalendarDays size={12} color="#F5A623" /> {item.date}</span>
                </div>
                <div style={{ marginTop: '8px', height: '7px', borderRadius: '99px', background: 'rgba(255,255,255,.12)', overflow: 'hidden' }}>
                  <div style={{ width: `${item.matchScore}%`, height: '100%', background: 'linear-gradient(90deg,#F5A623,#ffd788)' }} />
                </div>
                <p style={{ fontSize: '11px', marginTop: '6px', color: '#F5A623', fontWeight: 700 }}>Match Score: {item.matchScore}%</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
