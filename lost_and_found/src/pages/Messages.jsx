import React, { useMemo, useState } from 'react';
import { Send, CheckCheck } from 'lucide-react';
import { MOCK_CONVERSATIONS } from '../data/lostFoundAdvanced';

export default function Messages() {
  const [conversations, setConversations] = useState(MOCK_CONVERSATIONS);
  const [activeId, setActiveId] = useState(MOCK_CONVERSATIONS[0]?.id || '');
  const [text, setText] = useState('');

  const active = useMemo(() => conversations.find((c) => c.id === activeId), [conversations, activeId]);

  const sendMessage = () => {
    if (!text.trim() || !active) return;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== active.id) return c;
        const nextMsg = { id: `m-${Date.now()}`, from: 'me', text: text.trim(), time: now, seen: false };
        return { ...c, lastMessage: text.trim(), lastTime: now, unread: 0, messages: [...c.messages, nextMsg] };
      })
    );
    setText('');
  };

  return (
    <div style={{ width: '100%', minHeight: 'calc(100vh - 66px)', background: '#07091a', padding: '26px clamp(16px,6vw,60px) 50px' }}>
      <div style={{ maxWidth: '1150px', margin: '0 auto' }}>
        <div style={{ marginBottom: '14px' }}>
          <h1 style={{ color: '#fff', fontFamily: 'Manrope,sans-serif', fontWeight: 900, fontSize: '34px' }}>Messages</h1>
          <p style={{ color: 'rgba(255,255,255,.6)', fontSize: '14px' }}>Student-to-student communication for secure item handover.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '16px' }} className="messages-grid">
          <div style={{ border: '1px solid rgba(255,255,255,.08)', borderRadius: '16px', background: 'rgba(255,255,255,.03)', overflow: 'hidden' }}>
            <div style={{ padding: '12px 14px', borderBottom: '1px solid rgba(255,255,255,.08)', color: '#fff', fontWeight: 800 }}>Conversations</div>
            <div style={{ maxHeight: '540px', overflowY: 'auto' }}>
              {conversations.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveId(c.id)}
                  style={{ width: '100%', textAlign: 'left', background: activeId === c.id ? 'rgba(245,166,35,.1)' : 'transparent', borderBottom: '1px solid rgba(255,255,255,.06)', padding: '11px 12px', display: 'flex', gap: '10px' }}
                >
                  <img src={c.avatar} alt={c.name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
                      <p style={{ color: '#fff', fontSize: '13px', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</p>
                      <span style={{ color: 'rgba(255,255,255,.45)', fontSize: '11px' }}>{c.lastTime}</span>
                    </div>
                    <p style={{ color: 'rgba(255,255,255,.5)', fontSize: '12px', marginTop: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.item} - {c.lastMessage}</p>
                  </div>
                  {c.unread > 0 ? <span style={{ minWidth: '18px', height: '18px', borderRadius: '999px', background: '#ef4444', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 800 }}>{c.unread}</span> : null}
                </button>
              ))}
            </div>
          </div>

          <div style={{ border: '1px solid rgba(255,255,255,.08)', borderRadius: '16px', background: 'rgba(255,255,255,.03)', display: 'flex', flexDirection: 'column', minHeight: '600px' }}>
            {active ? (
              <>
                <div style={{ padding: '12px 14px', borderBottom: '1px solid rgba(255,255,255,.08)', display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <img src={active.avatar} alt={active.name} style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
                  <div>
                    <p style={{ color: '#fff', fontWeight: 700 }}>{active.name}</p>
                    <p style={{ color: 'rgba(255,255,255,.5)', fontSize: '12px' }}>Regarding: {active.item}</p>
                  </div>
                </div>

                <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {active.messages.map((m) => (
                    <div key={m.id} style={{ alignSelf: m.from === 'me' ? 'flex-end' : 'flex-start', maxWidth: '72%' }}>
                      <div style={{ background: m.from === 'me' ? 'rgba(245,166,35,.2)' : 'rgba(255,255,255,.08)', border: `1px solid ${m.from === 'me' ? 'rgba(245,166,35,.35)' : 'rgba(255,255,255,.1)'}`, color: '#fff', borderRadius: m.from === 'me' ? '14px 14px 4px 14px' : '14px 14px 14px 4px', padding: '10px 12px', fontSize: '13px', lineHeight: 1.5 }}>
                        {m.text}
                      </div>
                      <div style={{ marginTop: '3px', display: 'flex', justifyContent: m.from === 'me' ? 'flex-end' : 'flex-start', alignItems: 'center', gap: '5px', color: 'rgba(255,255,255,.45)', fontSize: '10px' }}>
                        <span>{m.time}</span>
                        {m.from === 'me' ? <CheckCheck size={11} color={m.seen ? '#22c55e' : 'rgba(255,255,255,.45)'} /> : null}
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ borderTop: '1px solid rgba(255,255,255,.08)', padding: '12px', display: 'flex', gap: '10px' }}>
                  <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type your message..."
                    className="form-input"
                    style={{ margin: 0 }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                  />
                  <button className="btn-primary" style={{ padding: '10px 14px' }} onClick={sendMessage}>
                    <Send size={14} /> Send
                  </button>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
