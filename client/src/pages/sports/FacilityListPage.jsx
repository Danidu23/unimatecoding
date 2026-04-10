import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiFilter, FiClock, FiUsers, FiSearch } from 'react-icons/fi';
import api from '../../api/sportsApi';
import './FacilityListPage.css';

const CATEGORY_FILTERS = {
  facilities: ['All', 'Indoor', 'Outdoor'],
  services:   ['All', 'Medical', 'Wellness'],
};

const FacilityListPage = () => {
  const { type } = useParams(); // 'facilities' | 'services'
  const navigate = useNavigate();
  const isSport = type === 'facilities';

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const filters = CATEGORY_FILTERS[type] || ['All'];

  const [activeFilter, setActiveFilter] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const { data } = await api.get('/facilities');
        const filteredType = data.filter(f => f.type === (isSport ? 'sport' : 'service'));
        setItems(filteredType);
      } catch (error) {
        console.error('Failed to fetch facilities', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFacilities();
  }, [isSport]);

  const filtered = useMemo(() => {
    let list = items;
    if (activeFilter !== 'All') {
      list = list.filter(i => i.category.toLowerCase() === activeFilter.toLowerCase());
    }
    if (search.trim()) {
      list = list.filter(i =>
        i.name.toLowerCase().includes(search.toLowerCase()) ||
        (i.description && i.description.toLowerCase().includes(search.toLowerCase()))
      );
    }
    return list;
  }, [items, activeFilter, search]);

  const getAvailabilityColor = (n) => {
    if (n === 0) return 'var(--accent-red)';
    if (n <= 2) return 'var(--accent-orange)';
    return 'var(--accent-green)';
  };

  if (loading) return <div className="loading-container" style={{padding:'40px 0'}}><div className="spinner" /></div>;

  return (
    <div>
      {/* Page Header */}
      <div className="facility-list-header">
        <div className="page-header">
          <h1>{isSport ? 'Sports Facilities' : 'Student Services'}</h1>
          <p>Select a {isSport ? 'facility' : 'service'} to book your time slot</p>
        </div>

        {/* Search + Filter Row */}
        <div className="facility-controls">
          <div className="search-bar" style={{ flex: 1, maxWidth: 360 }}>
            <FiSearch className="search-icon" />
            <input
              className="form-input"
              placeholder={`Search ${isSport ? 'facilities' : 'services'}...`}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div className="filter-tabs">
            <FiFilter style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }} />
            {filters.map(f => (
              <button
                key={f}
                className={`filter-tab ${activeFilter === f ? 'active' : ''}`}
                onClick={() => setActiveFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          <h3>No results found</h3>
          <p>Try adjusting your search or filter</p>
        </div>
      ) : (
        <div className="grid-3">
          {filtered.map(item => {
            // Mocking availableToday for UX purposes, as the count requires slot aggregation
            const mockAvail = item.capacity > 0 ? 5 : 0;
            return (
              <FacilityCard
                key={item._id}
                item={{...item, availableToday: mockAvail}}
                getAvailabilityColor={getAvailabilityColor}
                onClick={() => navigate(`/sports/book/${type}/${item._id}`)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

const FacilityCard = ({ item, getAvailabilityColor, onClick }) => {
  const isFull = item.availableToday === 0;

  return (
    <div className={`facility-card ${isFull ? 'facility-card-full' : ''}`}>
      {/* Image */}
      <div className="facility-image-wrap">
        <img src={item.image} alt={item.name} className="facility-image" />
        <div className="facility-image-overlay" />

        {/* Top badges */}
        <div className="facility-image-badges">
          <span className={`badge badge-${item.category}`}>{item.category}</span>
        </div>
        <div className="facility-image-badges-right">
          {item.tags?.includes('popular') && (
            <span className="badge badge-popular">🔥 Popular</span>
          )}
          {item.tags?.includes('almost-full') && (
            <span className="badge badge-almost-full">⚠ Almost Full</span>
          )}
          {isFull && (
            <span className="badge badge-rejected">Full</span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="facility-card-body">
        <h3 className="facility-name">{item.name}</h3>
        <p className="facility-desc">{item.description}</p>

        <div className="facility-meta">
          <div className="facility-meta-item">
            <FiClock />
            <span>{item.operatingHours.open} – {item.operatingHours.close}</span>
          </div>
          <div className="facility-meta-item">
            <FiUsers />
            <span>Capacity: {item.capacity}</span>
          </div>
        </div>

        {item.provider && (
          <div className="facility-provider">
            👤 <span>{item.provider}</span>
          </div>
        )}

        <div
          className="facility-availability"
          style={{ color: getAvailabilityColor(item.availableToday) }}
        >
          {item.availableToday > 0
            ? `${item.availableToday} slots available today`
            : 'No slots available today'}
        </div>

        <button
          className="btn btn-primary btn-full"
          onClick={onClick}
          disabled={isFull}
        >
          {isFull ? 'Fully Booked' : 'Book Now'}
        </button>
      </div>
    </div>
  );
};

export default FacilityListPage;