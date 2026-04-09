import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Clock, X, Filter, ChevronRight } from 'lucide-react';
import { LOCATION_FILTERS, mapLocationToZone } from '../../data/lostfound/lostFoundAdvanced';
import SafeImage from '../../components/lostfound/SafeImage';
import { getImageFallbacks } from '../../utils/lostfound/imageFallbacks';

const CATEGORIES = ['All', 'Electronics', 'Wallets & ID', 'Books & Notes', 'Clothing', 'Keys', 'Bags & Backpacks', 'Other'];

const inferCategory = (item) => {
  if (item?.category) return item.category;
  const description = String(item?.description || '');
  const match = description.match(/Category:\s*([^\.]+)/i);
  return match?.[1]?.trim() || 'Other';
};

export default function BrowseLostFoundItemsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeType, setActiveType] = useState('all');
  const [locationZone, setLocationZone] = useState('ALL');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [lostRes, foundRes] = await Promise.all([
          fetch('http://localhost:5000/api/items/lost'),
          fetch('http://localhost:5000/api/items/found')
        ]);
        const lostData = await lostRes.json();
        const foundData = await foundRes.json();

        const lostItems = (lostData.data || [])
          .filter((item) => ['approved', 'matched', 'verified', 'claimed'].includes(String(item.status || '').toLowerCase()))
          .map((item) => ({
            id: item._id,
            type: 'lost',
            title: item.itemName,
            category: item.category,
            location: item.lastSeenLocation,
            time: new Date(item.createdAt).toLocaleDateString(),
            status: String(item.status || 'pending').toLowerCase(),
            img: item.image || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',
            desc: item.description
          }));

        const foundItems = (foundData.data || [])
          .filter((item) => ['approved', 'verified', 'claimed'].includes(String(item.status || '').toLowerCase()))
          .map((item) => ({
            id: item._id,
            type: 'found',
            title: item.itemName,
            category: inferCategory(item),
            location: item.locationFound,
            time: new Date(item.createdAt).toLocaleDateString(),
            status: String(item.status || 'pending').toLowerCase(),
            img: item.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
            desc: item.description
          }));

        setItems([...lostItems, ...foundItems]);
      } catch (error) {
        console.error('Browse load error:', error);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) || item.desc.toLowerCase().includes(search.toLowerCase()) || item.location.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
      const matchesType = activeType === 'all' || item.type === activeType;
      const mapped = mapLocationToZone(item.location);
      const matchesZone = locationZone === 'ALL' || mapped === locationZone;
      return matchesSearch && matchesCategory && matchesType && matchesZone;
    });
  }, [items, search, activeCategory, activeType, locationZone]);

  return (
    <div style={{ width: '100%', background: '#07091a', minHeight: 'calc(100vh - 66px)' }}>
      <div style={{ position: 'relative', height: 'clamp(180px,27vw,300px)', overflow: 'hidden' }}>
        <SafeImage src='https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1800&q=80' alt='University Campus' fallbackCandidates={getImageFallbacks({ category: 'Books & Notes', type: 'lost', title: 'University Campus' })} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom,rgba(7,9,26,.3) 0%,rgba(7,9,26,.95) 100%)' }} />
        <div style={{ position: 'absolute', bottom: '32px', left: 'clamp(18px,4vw,52px)', right: 'clamp(18px,4vw,52px)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(245,166,35,.15)', color: '#F5A623', padding: '4px 12px', borderRadius: '100px', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>
                <Filter size={12}/> Approved Campus Items
              </div>
              <h2 style={{ fontSize: 'clamp(24px,4vw,40px)', fontWeight: 900, color: '#fff', fontFamily: 'Manrope,sans-serif', letterSpacing: '-1px', marginBottom: '6px' }}>Browse Items</h2>
              <p style={{ color: 'rgba(255,255,255,.6)', fontSize: '15px', maxWidth: '560px' }}>Only admin-approved reports appear here so students can trust what they see.</p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ position: 'sticky', top: '66px', zIndex: 100, background: 'rgba(7,9,26,.98)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,.07)', padding: '16px clamp(18px,4vw,52px) 14px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '14px', background: 'rgba(255,255,255,.02)', border: '1px solid rgba(255,255,255,.06)', borderRadius: '16px', padding: '14px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center', justifyContent: 'space-between' }}>
            <div className='search-wrap' style={{ flex: '1 1 360px', maxWidth: '760px', margin: 0, background: 'rgba(255,255,255,.05)', minHeight: '46px', padding: '0 14px', borderRadius: '12px' }}>
              <Search size={16} color='rgba(255,255,255,.35)' />
              <input placeholder='Search by item name, description, or campus location...' value={search} onChange={e => setSearch(e.target.value)} />
              {search && <X size={16} color='rgba(255,255,255,.4)' style={{ cursor: 'pointer', flexShrink: 0 }} onClick={() => setSearch('')} />}
            </div>
            <button className='btn-outline' style={{ minHeight: '46px', padding: '0 18px', borderRadius: '12px', fontSize: '13px', minWidth: '116px', justifyContent: 'center' }} onClick={() => { setSearch(''); setActiveCategory('All'); setActiveType('all'); setLocationZone('ALL'); }}>
              Reset All
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
            <div style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.08)', borderRadius: '14px', padding: '12px' }}>
              <p style={{ fontSize: '11px', color: 'rgba(255,255,255,.45)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', fontWeight: 800, fontFamily: 'Manrope,sans-serif' }}>Item Type</p>
              <div style={{ display: 'flex', gap: '8px' }}>
                {['all', 'lost', 'found'].map(t => (
                  <button key={t} onClick={() => setActiveType(t)} style={{ flex: 1, minHeight: '42px', padding: '0 12px', borderRadius: '10px', fontSize: '13px', fontWeight: 700, fontFamily: 'Manrope,sans-serif', textTransform: 'capitalize', background: activeType === t ? (t === 'lost' ? 'rgba(239,68,68,.16)' : t === 'found' ? 'rgba(34,197,94,.16)' : 'rgba(245,166,35,.16)') : 'rgba(255,255,255,.04)', color: activeType === t ? (t === 'lost' ? '#f87171' : t === 'found' ? '#34d399' : '#F5A623') : 'rgba(255,255,255,.58)', border: `1px solid ${activeType === t ? (t === 'lost' ? 'rgba(239,68,68,.3)' : t === 'found' ? 'rgba(34,197,94,.3)' : 'rgba(245,166,35,.3)') : 'rgba(255,255,255,.08)'}`, transition: 'all .2s' }}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.08)', borderRadius: '14px', padding: '12px' }}>
              <p style={{ fontSize: '11px', color: 'rgba(255,255,255,.45)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', fontWeight: 800, fontFamily: 'Manrope,sans-serif' }}>Campus Zone</p>
              <select className='form-select' value={locationZone} onChange={(e) => setLocationZone(e.target.value)} style={{ margin: 0, minHeight: '42px', padding: '0 12px', borderRadius: '10px' }}>
                {LOCATION_FILTERS.map((zone) => <option key={zone} value={zone}>{zone}</option>)}
              </select>
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.08)', borderRadius: '14px', padding: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '10px', flexWrap: 'wrap' }}>
              <p style={{ fontSize: '11px', color: 'rgba(255,255,255,.45)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 800, fontFamily: 'Manrope,sans-serif' }}>Categories</p>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,.45)' }}>Filter items by academic or personal categories</p>
            </div>
            <div className='cat-scroll'>
              {CATEGORIES.map(cat => <button key={cat} className={`cat-pill ${activeCategory === cat ? 'active' : ''}`} style={{ minHeight: '34px', padding: '0 14px', borderRadius: '999px' }} onClick={() => setActiveCategory(cat)}>{cat}</button>)}
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px clamp(18px,4vw,52px) 120px' }}>
        <div className='sec-head'>
          <span style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '16px', fontWeight: 800, color: '#fff', fontFamily: 'Manrope,sans-serif' }}>
            <span style={{ color: '#F5A623', display: 'flex' }}><Filter size={16}/></span> Search Results
          </span>
          <div className='sec-line' />
          <span style={{ fontSize: '13px', color: 'rgba(255,255,255,.4)' }}>{loading ? 'Loading...' : `${filteredItems.length} items found`}</span>
        </div>

        {loading ? (
          <div style={{ padding: '80px 0', textAlign: 'center', color: 'rgba(255,255,255,.6)' }}>Loading approved campus items...</div>
        ) : filteredItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', background: 'rgba(255,255,255,.02)', border: '1.5px dashed rgba(255,255,255,.1)', borderRadius: '24px' }}>
            <Search size={48} style={{ display: 'block', margin: '0 auto 16px', color: 'rgba(255,255,255,.15)' }} />
            <p style={{ fontSize: '18px', fontWeight: 800, color: '#fff', fontFamily: 'Manrope,sans-serif', marginBottom: '6px' }}>No items found</p>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,.4)' }}>We couldn't find anything matching your filters.</p>
            <button className='btn-outline' style={{ marginTop: '24px' }} onClick={() => { setSearch(''); setActiveCategory('All'); setActiveType('all'); setLocationZone('ALL'); }}>
              Clear Filters
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '22px' }}>
            {filteredItems.map((item, i) => (
              <div key={item.id} className='grid-item' style={{ animation: `fadeUp .5s ease ${i * 0.1}s both`, display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }} onClick={() => navigate(`/lost-found/item/${item.id}`)}>
                <div style={{ position: 'relative', height: '200px' }}>
                  <SafeImage src={item.img} alt={item.title} fallbackCandidates={getImageFallbacks({ category: item.category, type: item.type, title: item.title })} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .4s' }} className='grid-item-img' />
                  <div style={{ position: 'absolute', top: '12px', right: '12px', background: item.type === 'lost' ? '#ef4444' : '#22c55e', color: '#fff', borderRadius: '8px', padding: '4px 12px', fontSize: '11px', fontWeight: 800, fontFamily: 'Manrope,sans-serif', textTransform: 'uppercase', boxShadow: '0 4px 12px rgba(0,0,0,.3)' }}>
                    {item.type}
                  </div>
                </div>
                <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', flexWrap: 'wrap' }}>
                    <span className='tag' style={{ background: 'rgba(255,255,255,.1)', color: '#fff' }}>{item.category}</span>
                    <span className={`tag ${item.status === 'verified' || item.status === 'approved' || item.status === 'matched' || item.status === 'claimed' ? 'tag-verified' : 'tag-pending'}`}>{item.status}</span>
                    {mapLocationToZone(item.location) !== 'ALL' ? <span className='tag' style={{ background: 'rgba(245,166,35,.14)', color: '#F5A623', border: '1px solid rgba(245,166,35,.25)' }}>{mapLocationToZone(item.location)}</span> : null}
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#fff', fontFamily: 'Manrope,sans-serif', marginBottom: '6px' }}>{item.title}</h3>
                  <p style={{ fontSize: '13px', color: 'rgba(255,255,255,.5)', lineHeight: 1.6, flex: 1 }}>{item.desc.length > 60 ? item.desc.substring(0, 60) + '...' : item.desc}</p>
                  <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,.08)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,.45)', fontSize: '13px' }}>
                      <MapPin size={13} color='#F5A623' style={{ flexShrink: 0 }} /> <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.location}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,.45)', fontSize: '13px' }}><Clock size={13} /> <span>{item.time}</span></div>
                      <ChevronRight size={16} color='#F5A623' />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}