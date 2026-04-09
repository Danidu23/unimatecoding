import React, { useMemo, useState, useEffect } from 'react';
import { Send, CheckCheck, Loader } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import SafeImage from '../../components/lostfound/SafeImage';
import { getImageFallbacks } from '../../utils/lostfound/imageFallbacks';
import toast from 'react-hot-toast';

// Unique user ID (in real app, this comes from auth context)
const CURRENT_USER_ID = 'student-user-001';
const CURRENT_USER_NAME = 'You (Student)';
const POLL_INTERVAL = 2000; // Poll every 2 seconds for new messages

export default function LostFoundMessagesPage() {
  const location = useLocation();
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState('');
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [pollIntervalId, setPollIntervalId] = useState(null);
  const [messages, setMessages] = useState([]);

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const conversationId = params.get('conversationId');
    if (conversationId) {
      setActiveId(conversationId);
    }
  }, [location.search]);

  // Real-time polling for new messages when conversation is active
  useEffect(() => {
    if (!activeId) return;

    const poll = async () => {
      await loadConversationMessages(activeId);
    };

    // Poll immediately, then every 2 seconds
    poll();
    const id = setInterval(poll, POLL_INTERVAL);
    setPollIntervalId(id);

    return () => clearInterval(id);
  }, [activeId]);

  const loadConversations = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/conversations?participantId=${CURRENT_USER_ID}`);
      const result = await response.json();

      if (result.success) {
        setConversations(result.data);
        const params = new URLSearchParams(location.search);
        const conversationId = params.get('conversationId');
        if (conversationId) {
          setActiveId(conversationId);
        } else if (result.data.length > 0 && !activeId) {
          setActiveId(result.data[0]._id);
        }
      }
    } catch (error) {
      console.error('Load conversations error:', error);
      toast.error('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  const loadConversationMessages = async (convId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/conversations/${convId}`);
      const result = await response.json();

      if (result.success) {
        setMessages(result.data.messages || []);
      }
    } catch (error) {
      console.error('Load messages error:', error);
    }
  };

  const active = useMemo(() => conversations.find((c) => c._id === activeId), [conversations, activeId]);

  const sendMessage = async () => {
    if (!text.trim() || !active || sending) return;

    setSending(true);
    try {
      const response = await fetch(`http://localhost:5000/api/conversations/${activeId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: activeId,
          senderId: CURRENT_USER_ID,
          senderName: CURRENT_USER_NAME,
          text: text.trim()
        })
      });

      const result = await response.json();
      if (result.success) {
        setText('');
        await loadConversations();
        // Reload messages immediately
        await loadConversationMessages(activeId);
        toast.success('Message sent');
      } else {
        toast.error(result.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Send message error:', error);
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{ width: '100%', minHeight: 'calc(100vh - 66px)', background: '#07091a', padding: '26px clamp(16px,6vw,60px) 50px' }}>
      <div style={{ maxWidth: '1150px', margin: '0 auto' }}>
        <div style={{ marginBottom: '14px' }}>
          <h1 style={{ color: '#fff', fontFamily: 'Manrope,sans-serif', fontWeight: 900, fontSize: '34px' }}>Messages</h1>
          <p style={{ color: 'rgba(255,255,255,.6)', fontSize: '14px' }}>Real-time peer messaging for secure item handover. Messages refresh every 2 seconds.</p>
        </div>

        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '500px', color: '#fff' }}>
            <Loader size={24} className="spin" style={{ marginRight: '10px' }} /> Loading conversations...
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '16px' }} className="messages-grid">
            {/* Conversations List */}
            <div style={{ border: '1px solid rgba(255,255,255,.08)', borderRadius: '16px', background: 'rgba(255,255,255,.03)', overflow: 'hidden' }}>
              <div style={{ padding: '12px 14px', borderBottom: '1px solid rgba(255,255,255,.08)', color: '#fff', fontWeight: 800 }}>
                Conversations ({conversations.length})
              </div>
              <div style={{ maxHeight: '540px', overflowY: 'auto' }}>
                {conversations.length === 0 ? (
                  <div style={{ padding: '16px', color: 'rgba(255,255,255,.5)', fontSize: '13px', textAlign: 'center' }}>
                    No conversations yet
                  </div>
                ) : (
                  conversations.map((c) => {
                    const otherParticipant = c.participantNames.find(n => n !== CURRENT_USER_NAME) || 'Unknown';
                    const otherAvatar = c.participantAvatars[c.participantNames.indexOf(otherParticipant)];
                    const lastTime = new Date(c.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                    return (
                      <button
                        key={c._id}
                        onClick={() => setActiveId(c._id)}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          background: activeId === c._id ? 'rgba(245,166,35,.1)' : 'transparent',
                          borderBottom: '1px solid rgba(255,255,255,.06)',
                          padding: '11px 12px',
                          display: 'flex',
                          gap: '10px',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => !activeId === c._id && (e.currentTarget.style.background = 'rgba(255,255,255,.02)')}
                        onMouseLeave={(e) => !activeId === c._id && (e.currentTarget.style.background = 'transparent')}
                      >
                        <SafeImage
                          src={otherAvatar}
                          alt={otherParticipant}
                          fallbackCandidates={getImageFallbacks({ type: 'avatar', title: otherParticipant })}
                          style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
                            <p style={{ color: '#fff', fontSize: '13px', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0 }}>
                              {otherParticipant}
                            </p>
                            <span style={{ color: 'rgba(255,255,255,.45)', fontSize: '11px', flexShrink: 0 }}>{lastTime}</span>
                          </div>
                          <p style={{ color: 'rgba(255,255,255,.5)', fontSize: '12px', marginTop: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0 }}>
                            {c.itemTitle} - {c.lastMessage}
                          </p>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Chat Area */}
            <div style={{ border: '1px solid rgba(255,255,255,.08)', borderRadius: '16px', background: 'rgba(255,255,255,.03)', display: 'flex', flexDirection: 'column', minHeight: '600px' }}>
              {active ? (
                <>
                  {/* Header */}
                  <div style={{ padding: '12px 14px', borderBottom: '1px solid rgba(255,255,255,.08)', display: 'flex', gap: '10px', alignItems: 'center' }}>
                    {active.participantAvatars && active.participantAvatars.length > 0 && (
                      <SafeImage
                        src={active.participantAvatars[0]}
                        alt={active.participantNames[0]}
                        fallbackCandidates={getImageFallbacks({ type: 'avatar', title: active.participantNames[0] })}
                        style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                    )}
                    <div>
                      <p style={{ color: '#fff', fontWeight: 700, margin: 0 }}>
                        {active.participantNames.find(n => n !== CURRENT_USER_NAME) || 'Unknown'}
                      </p>
                      <p style={{ color: 'rgba(255,255,255,.5)', fontSize: '12px', margin: 0 }}>
                        Regarding: {active.itemTitle}
                      </p>
                    </div>
                  </div>

                  {/* Messages */}
                  <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {messages.length === 0 ? (
                      <div style={{ color: 'rgba(255,255,255,.4)', textAlign: 'center', margin: 'auto' }}>
                        No messages yet. Start the conversation!
                      </div>
                    ) : (
                      messages.map((m) => {
                        const isFromMe = m.senderId === CURRENT_USER_ID;
                        const timeStr = new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                        return (
                          <div key={m._id} style={{ alignSelf: isFromMe ? 'flex-end' : 'flex-start', maxWidth: '72%' }}>
                            <div
                              style={{
                                background: isFromMe ? 'rgba(245,166,35,.2)' : 'rgba(255,255,255,.08)',
                                border: `1px solid ${isFromMe ? 'rgba(245,166,35,.35)' : 'rgba(255,255,255,.1)'}`,
                                color: '#fff',
                                borderRadius: isFromMe ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                                padding: '10px 12px',
                                fontSize: '13px',
                                lineHeight: 1.5,
                                wordWrap: 'break-word'
                              }}
                            >
                              {m.text}
                            </div>
                            <div
                              style={{
                                marginTop: '3px',
                                display: 'flex',
                                justifyContent: isFromMe ? 'flex-end' : 'flex-start',
                                alignItems: 'center',
                                gap: '5px',
                                color: 'rgba(255,255,255,.45)',
                                fontSize: '10px'
                              }}
                            >
                              <span>{timeStr}</span>
                              {isFromMe && <CheckCheck size={11} color={m.seen ? '#22c55e' : 'rgba(255,255,255,.45)'} />}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Input */}
                  <div style={{ borderTop: '1px solid rgba(255,255,255,.08)', padding: '12px', display: 'flex', gap: '10px' }}>
                    <input
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Type your message..."
                      className="form-input"
                      style={{ margin: 0 }}
                      disabled={sending}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !sending) {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                    />
                    <button
                      className="btn-primary"
                      style={{ padding: '10px 14px' }}
                      onClick={sendMessage}
                      disabled={sending}
                    >
                      <Send size={14} /> {sending ? 'Sending...' : 'Send'}
                    </button>
                  </div>
                </>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, color: 'rgba(255,255,255,.5)' }}>
                  Select a conversation to start messaging
                </div>
              )}
            </div>
          </div>
        )}

        {/* Real-Time Info */}
        <div style={{ marginTop: '24px', padding: '16px', background: 'rgba(59,130,246,.1)', border: '1px solid rgba(59,130,246,.2)', borderRadius: '12px' }}>
          <p style={{ color: 'rgba(255,255,255,.8)', fontSize: '13px', margin: 0 }}>
            ✓ <strong>Real-time messaging:</strong> Messages are stored in database and automatically refresh every 2 seconds. Send a message and watch for instant delivery!
          </p>
        </div>
      </div>
    </div>
  );
}
