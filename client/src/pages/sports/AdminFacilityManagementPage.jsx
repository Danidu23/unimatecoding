import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiEdit2, FiX, FiArrowLeft } from 'react-icons/fi';
import api from '../../api/sportsApi';
import './AdminDashboard.css';
import './AdminFacilityManagementPage.css';

function AdminFacilityManagementPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [facilities, setFacilities] = useState([]);
  const [facilityModalOpen, setFacilityModalOpen] = useState(false);
  const [savingFacility, setSavingFacility] = useState(false);
  const [editingFacility, setEditingFacility] = useState(null);
  const [facilityForm, setFacilityForm] = useState({
    name: '',
    type: 'sport',
    category: 'indoor',
    description: '',
    image: '',
    provider: '',
    capacity: 1,
    slotDurationMinutes: 60,
    active: true,
    tags: '',
    operatingHours: { open: '08:00', close: '18:00' },
  });

  const loadFacilities = async () => {
    try {
      const res = await api.get('/facilities');
      setFacilities(res.data || []);
    } catch (err) {
      console.error('Failed to load facilities/services', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFacilities();
  }, []);

  const resetFacilityForm = () => {
    setEditingFacility(null);
    setFacilityForm({
      name: '',
      type: 'sport',
      category: 'indoor',
      description: '',
      image: '',
      provider: '',
      capacity: 1,
      slotDurationMinutes: 60,
      active: true,
      tags: '',
      operatingHours: { open: '08:00', close: '18:00' },
    });
  };

  const openCreateFacilityModal = () => {
    resetFacilityForm();
    setFacilityModalOpen(true);
  };

  const openEditFacilityModal = (facility) => {
    setEditingFacility(facility);
    setFacilityForm({
      name: facility.name || '',
      type: facility.type || 'sport',
      category: facility.category || 'indoor',
      description: facility.description || '',
      image: facility.image || '',
      provider: facility.provider || '',
      capacity: facility.capacity || 1,
      slotDurationMinutes: facility.slotDurationMinutes || 60,
      active: facility.active ?? true,
      tags: Array.isArray(facility.tags) ? facility.tags.join(', ') : '',
      operatingHours: {
        open: facility.operatingHours?.open || '08:00',
        close: facility.operatingHours?.close || '18:00',
      },
    });
    setFacilityModalOpen(true);
  };

  const closeFacilityModal = () => {
    setFacilityModalOpen(false);
    resetFacilityForm();
  };

  const handleFacilityFormChange = (key, value) => {
    setFacilityForm(prev => ({ ...prev, [key]: value }));
  };

  const handleHoursChange = (key, value) => {
    setFacilityForm(prev => ({
      ...prev,
      operatingHours: {
        ...prev.operatingHours,
        [key]: value,
      },
    }));
  };

  const handleSaveFacility = async () => {
    if (!facilityForm.name.trim() || !facilityForm.description.trim()) return;

    const payload = {
      ...facilityForm,
      name: facilityForm.name.trim(),
      description: facilityForm.description.trim(),
      provider: facilityForm.provider.trim(),
      image: facilityForm.image.trim(),
      capacity: Number(facilityForm.capacity),
      slotDurationMinutes: Number(facilityForm.slotDurationMinutes),
      tags: facilityForm.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(Boolean),
    };

    setSavingFacility(true);
    try {
      if (editingFacility?._id) {
        await api.put(`/facilities/${editingFacility._id}`, payload);
      } else {
        await api.post('/facilities', payload);
      }
      closeFacilityModal();
      setLoading(true);
      await loadFacilities();
    } catch (err) {
      console.error('Failed to save facility/service', err);
    } finally {
      setSavingFacility(false);
    }
  };

  return (
    <div className="dashboard-page facility-management-page">
      <div className="dashboard-header">
        <div>
          <p className="eyebrow">Sports Admin</p>
          <h1>Facility & Service Management</h1>
          <p className="subtitle">Create and update sports facilities and student services used in bookings.</p>
        </div>
        <div className="facility-page-actions">
          <button className="btn btn-secondary" onClick={() => navigate('/sports/admin')}>
            <FiArrowLeft /> Back to Dashboard
          </button>
          <button className="btn btn-primary" onClick={openCreateFacilityModal}>
            <FiPlus /> Add Facility / Service
          </button>
        </div>
      </div>

      <div className="dash-section">
        <div className="section-header">
          <div>
            <h2>All Facilities & Services</h2>
            <p className="subtitle" style={{ marginTop: '6px' }}>
              Manage the items that appear in Sports bookings.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="facility-loading-state">Loading facilities and services...</div>
        ) : facilities.length === 0 ? (
          <div className="facility-empty-state">
            No facilities or services yet. Add your first one to start Sports bookings.
          </div>
        ) : (
          <div className="facility-grid">
            {facilities.map(item => (
              <div key={item._id} className="facility-card">
                <div className="facility-card-top">
                  <div>
                    <div className={`facility-type-pill ${item.type === 'sport' ? 'sport' : 'service'}`}>
                      {item.type}
                    </div>
                    <h3 className="facility-card-title">{item.name}</h3>
                    <p className="facility-card-category">{item.category}</p>
                  </div>
                  <button className="btn btn-secondary btn-sm" onClick={() => openEditFacilityModal(item)}>
                    <FiEdit2 /> Edit
                  </button>
                </div>

                <p className="facility-card-description">
                  {item.description}
                </p>

                <div className="facility-card-meta">
                  <div><strong>Capacity:</strong> {item.capacity}</div>
                  <div><strong>Slot:</strong> {item.slotDurationMinutes} min</div>
                  <div><strong>Open:</strong> {item.operatingHours?.open || '-'}</div>
                  <div><strong>Close:</strong> {item.operatingHours?.close || '-'}</div>
                </div>

                {item.type === 'service' && item.provider && (
                  <p className="facility-card-provider">
                    <strong>Provider:</strong> {item.provider}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {facilityModalOpen && (
        <div className="facility-modal-overlay">
          <div className="facility-modal">
            <div className="facility-modal-header">
              <div>
                <h2 style={{ margin: 0 }}>{editingFacility ? 'Edit Facility / Service' : 'Add Facility / Service'}</h2>
                <p className="subtitle" style={{ margin: '8px 0 0' }}>Manage bookable sports items directly from the admin dashboard.</p>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={closeFacilityModal}>
                <FiX />
              </button>
            </div>

            <div className="facility-modal-body">
              <label>
                <span>Name</span>
                <input className="input" value={facilityForm.name} onChange={e => handleFacilityFormChange('name', e.target.value)} placeholder="e.g. Basketball Court" />
              </label>
              <label>
                <span>Type</span>
                <select className="input" value={facilityForm.type} onChange={e => handleFacilityFormChange('type', e.target.value)}>
                  <option value="sport">Sport</option>
                  <option value="service">Service</option>
                </select>
              </label>
              <label>
                <span>Category</span>
                <input className="input" value={facilityForm.category} onChange={e => handleFacilityFormChange('category', e.target.value)} placeholder="e.g. indoor / wellness / medical" />
              </label>
              <label>
                <span>Image URL</span>
                <input className="input" value={facilityForm.image} onChange={e => handleFacilityFormChange('image', e.target.value)} placeholder="https://..." />
              </label>
              <label>
                <span>Capacity</span>
                <input className="input" type="number" min="1" value={facilityForm.capacity} onChange={e => handleFacilityFormChange('capacity', e.target.value)} />
              </label>
              <label>
                <span>Slot Duration (minutes)</span>
                <input className="input" type="number" min="15" step="15" value={facilityForm.slotDurationMinutes} onChange={e => handleFacilityFormChange('slotDurationMinutes', e.target.value)} />
              </label>
              <label>
                <span>Open Time</span>
                <input className="input" type="time" value={facilityForm.operatingHours.open} onChange={e => handleHoursChange('open', e.target.value)} />
              </label>
              <label>
                <span>Close Time</span>
                <input className="input" type="time" value={facilityForm.operatingHours.close} onChange={e => handleHoursChange('close', e.target.value)} />
              </label>
              <label style={{ gridColumn: '1 / -1' }}>
                <span>Description</span>
                <textarea className="input" rows="4" value={facilityForm.description} onChange={e => handleFacilityFormChange('description', e.target.value)} placeholder="Describe the facility or student service..." />
              </label>
              <label style={{ gridColumn: '1 / -1' }}>
                <span>Tags (comma separated)</span>
                <input className="input" value={facilityForm.tags} onChange={e => handleFacilityFormChange('tags', e.target.value)} placeholder="popular, indoor, wellness" />
              </label>
              {facilityForm.type === 'service' && (
                <label style={{ gridColumn: '1 / -1' }}>
                  <span>Provider</span>
                  <input className="input" value={facilityForm.provider} onChange={e => handleFacilityFormChange('provider', e.target.value)} placeholder="e.g. Dr. Nimal Perera" />
                </label>
              )}
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', gridColumn: '1 / -1' }}>
                <input type="checkbox" checked={facilityForm.active} onChange={e => handleFacilityFormChange('active', e.target.checked)} />
                <span>Active and available for bookings</span>
              </label>
            </div>

            <div className="facility-modal-actions">
              <button className="btn btn-secondary" onClick={closeFacilityModal}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSaveFacility} disabled={savingFacility}>
                {savingFacility ? 'Saving...' : editingFacility ? 'Update Item' : 'Create Item'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminFacilityManagementPage;