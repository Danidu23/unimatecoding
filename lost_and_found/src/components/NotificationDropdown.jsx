import React from 'react';
import { BellRing, MessageSquareText, CheckCircle2, Sparkles } from 'lucide-react';

function iconFor(type) {
  if (type === 'MESSAGE') return <MessageSquareText size={14} color="#60a5fa" />;
  if (type === 'CLAIM') return <CheckCircle2 size={14} color="#22c55e" />;
  return <Sparkles size={14} color="#F5A623" />;
}

export default function NotificationDropdown({ items = [], onClose }) {
  return (
    <div style={{ position: 'absolute', top: '48px', right: '0', width: '320px', zIndex: 999, background: '#0d1232', border: '1px solid rgba(255,255,255,.12)', borderRadius: '14px', boxShadow: '0 18px 45px rgba(0,0,0,.45)', overflow: 'hidden' }}>
      <div style={{ padding: '12px 14px', borderBottom: '1px solid rgba(255,255,255,.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 800, fontSize: '13px', fontFamily: 'Manrope,sans-serif', color: '#fff' }}><BellRing size={14} color="#F5A623" /> Notifications</span>
        <button onClick={onClose} style={{ background: 'none', color: 'rgba(255,255,255,.55)', fontSize: '12px' }}>Close</button>
      </div>
      <div style={{ maxHeight: '360px', overflowY: 'auto' }}>
        {items.map((n) => (
          <div key={n.id} style={{ padding: '11px 14px', borderBottom: '1px solid rgba(255,255,255,.06)', background: n.unread ? 'rgba(245,166,35,.08)' : 'transparent' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <span style={{ marginTop: '2px' }}>{iconFor(n.type)}</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
                  <p style={{ color: '#fff', fontSize: '12px', fontWeight: 700 }}>{n.title}</p>
                  <span style={{ color: 'rgba(255,255,255,.45)', fontSize: '10px' }}>{n.time}</span>
                </div>
                <p style={{ color: 'rgba(255,255,255,.58)', fontSize: '11px', marginTop: '3px', lineHeight: 1.5 }}>{n.desc}</p>
              </div>
              {n.unread ? <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#ef4444', marginTop: '6px' }} /> : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
