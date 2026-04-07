import { useState, useEffect } from 'react';
import api from '../api';
import { FiPlus, FiTrash2, FiEdit, FiLock, FiUnlock } from 'react-icons/fi';
import './AdminSlotsPage.css';

const AdminSlotsPage = () => {
  const [facilities, setFacilities] = useState({ sport: [], service: [] });
  const [selectedFac, setSelectedFac] = useState(null);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [slots, setSlots] = useState([]);
  const [generated, setGenerated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [isEditingFac, setIsEditingFac] = useState(false);
  const [editFacData, setEditFacData] = useState({ capacity: 1, slotDurationMinutes: 60 });
  const [savingFac, setSavingFac] = useState(false);

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const { data } = await api.get('/facilities');
        const sport = data.filter(f => f.type === 'sport');
        const service = data.filter(f => f.type === 'service');
        setFacilities({ sport, service });
        if (data.length > 0) {
          setSelectedFac(data[0]);
          setEditFacData({ capacity: data[0].capacity || 1, slotDurationMinutes: data[0].slotDurationMinutes || 60 });
        }
      } catch (err) {
        console.error('Failed to load facilities', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFacilities();
  }, []);

  const handleFetchOrGenerate = async () => {
    if (!selectedFac) return;
    setGenerating(true);
    try {
      // First try to fetch existing
      let { data } = await api.get(`/slots?facilityServiceId=${selectedFac._id}&date=${date}`);
      
      // If none, generate
      if (data.length === 0) {
        const genRes = await api.post('/slots/generate', {
          facilityServiceId: selectedFac._id,
          date
        });
        data = genRes.data;
      }
      
      setSlots(data);
      setGenerated(true);
    } catch (err) {
      console.error(err);
      alert('Failed to generate slots.');
    } finally {
      setGenerating(false);
    }
  };

  const toggleBlock = async (slot) => {
    const isCurrentlyBlocked = slot.status === 'blocked';
    try {
      const { data } = await api.put(`/slots/${slot._id}/block`, { block: !isCurrentlyBlocked });
      setSlots(prev => prev.map(s => s._id === slot._id ? data : s));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to toggle block status.');
    }
  };

  const handleSaveFac = async () => {
    setSavingFac(true);
    try {
      const { data } = await api.put(`/facilities/${selectedFac._id}`, {
        capacity: Number(editFacData.capacity),
        slotDurationMinutes: Number(editFacData.slotDurationMinutes)
      });
      setSelectedFac(data);
      setFacilities(prev => ({
        sport: prev.sport.map(f => f._id === data._id ? data : f),
        service: prev.service.map(f => f._id === data._id ? data : f)
      }));
      setIsEditingFac(false);
    } catch (err) {
      console.error(err);
      alert('Failed to update facility details');
    } finally {
      setSavingFac(false);
    }
  };

  if (loading) return <div className="loading-container" style={{padding:'60px 0'}}><div className="spinner" /></div>;

  return (
    <div className="admin-slots-page">
      <div className="page-header">
        <h1>Schedule & Slot Management</h1>
        <p>Create and manage available time slots for facilities and services</p>
      </div>

      <div className="slots-manager-grid">
        <div className="slots-config-panel">
          <h3>Configure Slots</h3>

          <div className="form-group">
            <label className="form-label">Facility / Service</label>
            <select
              className="form-input"
              value={selectedFac?._id || ''}
              onChange={e => {
                const f = [...facilities.sport, ...facilities.service].find(i => i._id === e.target.value);
                setSelectedFac(f);
                if (f) {
                  setEditFacData({ capacity: f.capacity, slotDurationMinutes: f.slotDurationMinutes });
                  setIsEditingFac(false);
                }
                setGenerated(false);
                setSlots([]);
              }}
            >
              <optgroup label="Sports Facilities">
                {facilities.sport.map(f => <option key={f._id} value={f._id}>{f.name}</option>)}
              </optgroup>
              <optgroup label="Student Services">
                {facilities.service.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
              </optgroup>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Date</label>
            <input
              type="date"
              className="form-input"
              value={date}
              onChange={e => { setDate(e.target.value); setGenerated(false); setSlots([]); }}
            />
          </div>

          {selectedFac && (
            <div className="facility-info-card">
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <p className="fi-title" style={{margin:0}}>Operating Hours</p>
                {!isEditingFac && (
                  <button className="btn btn-link btn-sm" style={{padding:0, fontSize: '0.8rem', color: 'var(--accent-primary)'}} onClick={() => setIsEditingFac(true)}>
                    <FiEdit style={{marginRight: 4}} /> Edit Limits
                  </button>
                )}
              </div>
              <p className="fi-value">{selectedFac.operatingHours.open} – {selectedFac.operatingHours.close}</p>

              <p className="fi-title">Capacity <span style={{fontSize:'0.7rem', color:'var(--text-muted)'}}>(persons/slot)</span></p>
              {isEditingFac ? (
                <input type="number" className="form-input" style={{marginBottom: 8, padding: '4px 8px'}} value={editFacData.capacity} onChange={(e) => setEditFacData({...editFacData, capacity: e.target.value})} />
              ) : (
                <p className="fi-value">{selectedFac.capacity}</p>
              )}

              <p className="fi-title">Duration <span style={{fontSize:'0.7rem', color:'var(--text-muted)'}}>(min/slot)</span></p>
              {isEditingFac ? (
                <input type="number" className="form-input" style={{marginBottom: 8, padding: '4px 8px'}} value={editFacData.slotDurationMinutes} onChange={(e) => setEditFacData({...editFacData, slotDurationMinutes: e.target.value})} />
              ) : (
                <p className="fi-value">{selectedFac.slotDurationMinutes}</p>
              )}

              {selectedFac.provider && (
                <>
                  <p className="fi-title">Provider</p>
                  <p className="fi-value">{selectedFac.provider}</p>
                </>
              )}

              {isEditingFac && (
                <div style={{display:'flex', gap: 8, marginTop: 12}}>
                  <button className="btn btn-primary btn-sm" onClick={handleSaveFac} disabled={savingFac}>{savingFac ? 'Saving...' : 'Save'}</button>
                  <button className="btn btn-secondary btn-sm" onClick={() => { setIsEditingFac(false); setEditFacData({ capacity: selectedFac.capacity, slotDurationMinutes: selectedFac.slotDurationMinutes }); }}>Cancel</button>
                </div>
              )}
            </div>
          )}

          <button className="btn btn-primary btn-full" onClick={handleFetchOrGenerate} disabled={generating}>
            {generating ? 'Processing...' : <><FiPlus /> Load / Generate Slots</>}
          </button>
        </div>

        <div className="slots-list-panel">
          <div className="section-header">
            <h3>
              Generated Slots
              {generated && <span className="slots-count">{slots.length}</span>}
            </h3>
          </div>

          {!generated && !generating ? (
            <div className="empty-state" style={{ padding: '60px 20px' }}>
              <div className="empty-state-icon">📅</div>
              <p>Configure options above and click "Load / Generate Slots"</p>
            </div>
          ) : slots.length === 0 && generated ? (
            <div className="empty-state" style={{ padding: '60px 20px' }}>
              <div className="empty-state-icon">❌</div>
              <p>No slots generated. Check operating hours vs duration.</p>
            </div>
          ) : (
            <div className="generated-slots-grid">
              {slots.map((slot) => {
                const isBlocked = slot.status === 'blocked';
                const isFull = slot.status === 'full';
                const hasBookings = slot.booked > 0;
                
                return (
                <div key={slot._id} className={`generated-slot ${isBlocked ? 'slot-blocked' : ''}`}>
                  <div>
                    <p className="gs-time">{slot.startTime} – {slot.endTime}</p>
                    <p className="gs-status">
                      {isBlocked ? '🚫 Blocked' : isFull ? '🔴 Full' : '✅ Available'}
                    </p>
                    <p style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>Booked: {slot.booked}/{slot.capacity}</p>
                  </div>
                  <div className="gs-actions">
                    <button
                      className={`btn btn-sm ${isBlocked ? 'btn-secondary' : 'btn-danger'}`}
                      onClick={() => toggleBlock(slot)}
                      title={isBlocked ? 'Unblock' : 'Block'}
                      disabled={hasBookings && !isBlocked} 
                      // Note: Backend prevents blocking if has approved bookings, but UI can disable if ANY bookings exist for safety
                    >
                      {isBlocked ? <FiUnlock /> : <FiLock />}
                    </button>
                  </div>
                </div>
              )})}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSlotsPage;
