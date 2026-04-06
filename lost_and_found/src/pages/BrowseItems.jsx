import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Clock, X, Filter, ChevronRight, PackageSearch } from 'lucide-react';
import { LOCATION_FILTERS, mapLocationToZone } from '../data/lostFoundAdvanced';

const CATEGORIES = ['All', 'Electronics', 'Wallets & ID', 'Books & Notes', 'Clothing', 'Keys', 'Bags & Backpacks', 'Other'];

// Mock items based on new styling
const MOCK_ITEMS = [
  { id: 1, type: 'lost', title: 'MacBook Air M1', category: 'Electronics', location: 'New building library', time: '2 hours ago', status: 'pending', img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80', desc: 'Space gray, has a GitHub sticker on the back.' },
  { id: 2, type: 'found', title: 'Casio Watch', category: 'Other', location: 'Sport Complex', time: '5 hours ago', status: 'verified', img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80', desc: 'Silver colored Casio digital watch. Found near the basketball court.' },
  { id: 3, type: 'lost', title: 'Calculass Notes', category: 'Books & Notes', location: 'Main building lecture hall', time: '1 day ago', status: 'pending', img: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80', desc: 'Blue notebook with "Calculus 101" written on the front.' },
  { id: 4, type: 'found', title: 'Water Bottle', category: 'Other', location: 'Anohana canteen', time: '2 days ago', status: 'verified', img: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80', desc: 'Black hydroflask with dents on the bottom.' },
];

export default function BrowseItems() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeType, setActiveType] = useState('all');
  const [locationZone, setLocationZone] = useState('ALL');

  const filteredItems = MOCK_ITEMS.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) || item.desc.toLowerCase().includes(search.toLowerCase()) || item.location.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesType = activeType === 'all' || item.type === activeType;
    const mapped = mapLocationToZone(item.location);
    const matchesZone = locationZone === 'ALL' || mapped === locationZone;
    return matchesSearch && matchesCategory && matchesType && matchesZone;
  });

  return (
    <div style={{ width: "100%", background: "#07091a", minHeight: "calc(100vh - 66px)" }}>
      
      {/* ── Header Area ── */}
      <div style={{ position: "relative", height: "clamp(160px,25vw,260px)", overflow: "hidden" }}>
        <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80" alt="Campus" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom,rgba(7,9,26,.3) 0%,rgba(7,9,26,.95) 100%)" }} />
        <div style={{ position: "absolute", bottom: "30px", left: "clamp(20px,6vw,60px)", right: "clamp(20px,6vw,60px)" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(245,166,35,.15)", color: "#F5A623", padding: "4px 12px", borderRadius: "100px", fontSize: "11px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "10px" }}>
                <PackageSearch size={12}/> Live Database
              </div>
              <h2 style={{ fontSize: "clamp(24px,4vw,40px)", fontWeight: 900, color: "#fff", fontFamily: "Manrope,sans-serif", letterSpacing: "-1px", marginBottom: "6px" }}>
                Browse Items
              </h2>
              <p style={{ color: "rgba(255,255,255,.6)", fontSize: "15px", maxWidth: "500px" }}>Search through recently reported lost and found items across the campus network.</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Sticky Filter Bar ── */}
      <div style={{
        position: "sticky", top: "66px", zIndex: 100,
        background: "rgba(7,9,26,.98)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,.07)",
        padding: "16px clamp(20px,6vw,60px) 14px"
      }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "center", justifyContent: "space-between" }}>
          
          <div className="search-wrap" style={{ flex: "1 1 300px", maxWidth: "500px", margin: 0 }}>
            <Search size={16} color="rgba(255,255,255,.35)" />
            <input placeholder="Search by name, description, or location..." value={search} onChange={e => setSearch(e.target.value)} />
            {search && <X size={16} color="rgba(255,255,255,.4)" style={{ cursor: "pointer", flexShrink: 0 }} onClick={() => setSearch('')} />}
          </div>

          <div style={{ display: "flex", gap: "8px", background: "rgba(255,255,255,.04)", padding: "4px", borderRadius: "12px", border: "1px solid rgba(255,255,255,.08)" }}>
            {['all', 'lost', 'found'].map(t => (
              <button key={t} onClick={() => setActiveType(t)} style={{
                padding: "8px 16px", borderRadius: "8px", fontSize: "13px", fontWeight: 700, fontFamily: "Manrope,sans-serif", textTransform: "capitalize",
                background: activeType === t ? (t === 'lost' ? "rgba(239,68,68,.15)" : t === 'found' ? "rgba(34,197,94,.15)" : "rgba(245,166,35,.15)") : "transparent",
                color: activeType === t ? (t === 'lost' ? "#ef4444" : t === 'found' ? "#22c55e" : "#F5A623") : "rgba(255,255,255,.5)",
                transition: "all .2s"
              }}>
                {t}
              </button>
            ))}
          </div>

        </div>

        <div style={{ maxWidth: '1100px', margin: '12px auto 0', display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {LOCATION_FILTERS.map((zone) => (
              <button
                key={zone}
                onClick={() => setLocationZone(zone)}
                style={{
                  borderRadius: '999px',
                  padding: '7px 12px',
                  border: `1px solid ${locationZone === zone ? 'rgba(245,166,35,.5)' : 'rgba(255,255,255,.16)'}`,
                  background: locationZone === zone ? 'rgba(245,166,35,.14)' : 'rgba(255,255,255,.04)',
                  color: locationZone === zone ? '#F5A623' : 'rgba(255,255,255,.62)',
                  fontSize: '12px',
                  fontWeight: 700,
                  letterSpacing: '.2px'
                }}
              >
                {zone}
              </button>
            ))}
          </div>

          <select className="form-select" value={locationZone} onChange={(e) => setLocationZone(e.target.value)} style={{ maxWidth: '200px', margin: 0, padding: '8px 10px' }}>
            {LOCATION_FILTERS.map((zone) => (
              <option key={zone} value={zone}>{zone}</option>
            ))}
          </select>
        </div>

        <div style={{ maxWidth: "1100px", margin: "16px auto 0" }}>
          <div className="cat-scroll">
            {CATEGORIES.map(cat => (
              <button key={cat} className={`cat-pill ${activeCategory === cat ? 'active' : ''}`} onClick={() => setActiveCategory(cat)}>
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content Area ── */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "32px clamp(20px,6vw,60px) 120px" }}>
        
        {/* Results Info */}
        <div className="sec-head">
          <span style={{ display: "flex", alignItems: "center", gap: "7px", fontSize: "16px", fontWeight: 800, color: "#fff", fontFamily: "Manrope,sans-serif" }}>
            <span style={{ color: "#F5A623", display: "flex" }}><Filter size={16}/></span> Search Results
          </span>
          <div className="sec-line" />
          <span style={{ fontSize: "13px", color: "rgba(255,255,255,.4)" }}>{filteredItems.length} items found</span>
        </div>

        {filteredItems.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", background: "rgba(255,255,255,.02)", border: "1.5px dashed rgba(255,255,255,.1)", borderRadius: "24px" }}>
            <Search size={48} style={{ display: "block", margin: "0 auto 16px", color: "rgba(255,255,255,.15)" }} />
            <p style={{ fontSize: "18px", fontWeight: 800, color: "#fff", fontFamily: "Manrope,sans-serif", marginBottom: "6px" }}>No items found</p>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,.4)" }}>We couldn't find anything matching your filters.</p>
            <button className="btn-outline" style={{ marginTop: "24px" }} onClick={() => { setSearch(''); setActiveCategory('All'); setActiveType('all'); setLocationZone('ALL'); }}>
              Clear Filters
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px" }}>
            {filteredItems.map((item, i) => (
              <div key={item.id} className="grid-item" style={{ animation: `fadeUp .5s ease ${i * 0.1}s both`, display: "flex", flexDirection: "column", padding: 0, overflow: "hidden" }} onClick={() => navigate(`/item/${item.id}`)}>
                <div style={{ position: "relative", height: "200px" }}>
                  <img src={item.img} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform .4s" }} className="grid-item-img" />
                  <div style={{ position: "absolute", top: "12px", right: "12px", background: item.type === 'lost' ? "#ef4444" : "#22c55e", color: "#fff", borderRadius: "8px", padding: "4px 12px", fontSize: "11px", fontWeight: 800, fontFamily: "Manrope,sans-serif", textTransform: "uppercase", boxShadow: "0 4px 12px rgba(0,0,0,.3)" }}>
                    {item.type}
                  </div>
                </div>
                
                <div style={{ padding: "20px", flex: 1, display: "flex", flexDirection: "column" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
                    <span className="tag" style={{ background: "rgba(255,255,255,.1)", color: "#fff" }}>{item.category}</span>
                    <span className={`tag ${item.status === 'verified' ? 'tag-verified' : 'tag-pending'}`}>{item.status}</span>
                    {mapLocationToZone(item.location) !== 'ALL' ? <span className="tag" style={{ background: 'rgba(245,166,35,.14)', color: '#F5A623', border: '1px solid rgba(245,166,35,.25)' }}>{mapLocationToZone(item.location)}</span> : null}
                  </div>
                  
                  <h3 style={{ fontSize: "18px", fontWeight: 900, color: "#fff", fontFamily: "Manrope,sans-serif", marginBottom: "6px" }}>{item.title}</h3>
                  <p style={{ fontSize: "13px", color: "rgba(255,255,255,.5)", lineHeight: 1.6, flex: 1 }}>
                    {item.desc.length > 60 ? item.desc.substring(0, 60) + '...' : item.desc}
                  </p>
                  
                  <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid rgba(255,255,255,.08)", display: "flex", flexDirection: "column", gap: "8px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "rgba(255,255,255,.45)", fontSize: "13px" }}>
                      <MapPin size={13} color="#F5A623" style={{ flexShrink: 0 }} /> <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.location}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "rgba(255,255,255,.45)", fontSize: "13px" }}>
                        <Clock size={13} /> <span>{item.time}</span>
                      </div>
                      <ChevronRight size={16} color="#F5A623" />
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
