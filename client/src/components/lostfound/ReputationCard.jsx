import React from 'react';
import { ShieldCheck, Award, TrendingUp } from 'lucide-react';

export default function ReputationCard({ profile }) {
  const trusted = profile?.trustScore >= 75;

  return (
    <div style={{ borderRadius: '18px', border: '1px solid rgba(245,166,35,.25)', background: 'linear-gradient(160deg, rgba(245,166,35,.12), rgba(255,255,255,.03))', padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <p style={{ color: 'rgba(255,255,255,.58)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '.8px', fontWeight: 700 }}>Reputation Score</p>
          <h3 style={{ color: '#fff', fontSize: '30px', fontWeight: 900, fontFamily: 'Manrope,sans-serif' }}>{profile?.trustScore ?? 0}</h3>
        </div>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', borderRadius: '999px', border: `1px solid ${trusted ? 'rgba(34,197,94,.4)' : 'rgba(245,166,35,.4)'}`, background: trusted ? 'rgba(34,197,94,.15)' : 'rgba(245,166,35,.12)', color: trusted ? '#22c55e' : '#F5A623', padding: '5px 11px', fontSize: '11px', fontWeight: 800 }}>
          <ShieldCheck size={13} /> {trusted ? 'TRUSTED USER' : 'NEW USER'}
        </span>
      </div>

      <div style={{ marginTop: '12px', height: '8px', borderRadius: '999px', background: 'rgba(255,255,255,.12)', overflow: 'hidden' }}>
        <div style={{ width: `${profile?.trustScore ?? 0}%`, height: '100%', background: 'linear-gradient(90deg,#F5A623,#ffd78c)' }} />
      </div>

      <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: '10px' }}>
        <div style={{ background: 'rgba(7,9,26,.45)', borderRadius: '12px', border: '1px solid rgba(255,255,255,.1)', padding: '10px' }}>
          <p style={{ color: 'rgba(255,255,255,.45)', fontSize: '11px' }}>POINTS</p>
          <p style={{ color: '#fff', fontWeight: 800, marginTop: '4px', display: 'inline-flex', gap: '5px', alignItems: 'center' }}><Award size={14} color="#F5A623" /> {profile?.points ?? 0}</p>
        </div>
        <div style={{ background: 'rgba(7,9,26,.45)', borderRadius: '12px', border: '1px solid rgba(255,255,255,.1)', padding: '10px' }}>
          <p style={{ color: 'rgba(255,255,255,.45)', fontSize: '11px' }}>RETURNED</p>
          <p style={{ color: '#fff', fontWeight: 800, marginTop: '4px' }}>{profile?.itemsReturned ?? 0}</p>
        </div>
        <div style={{ background: 'rgba(7,9,26,.45)', borderRadius: '12px', border: '1px solid rgba(255,255,255,.1)', padding: '10px' }}>
          <p style={{ color: 'rgba(255,255,255,.45)', fontSize: '11px' }}>SUCCESS</p>
          <p style={{ color: '#fff', fontWeight: 800, marginTop: '4px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}><TrendingUp size={14} color="#22c55e" /> {profile?.successfulClaims ?? 0}</p>
        </div>
      </div>
    </div>
  );
}
