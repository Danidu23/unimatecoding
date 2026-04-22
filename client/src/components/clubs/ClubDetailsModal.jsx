import { X, Calendar, Users, Target, Image as ImageIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const CSS = `
  .det-overlay{
    position:fixed;inset:0;background:rgba(0,0,0,0.85);backdrop-filter:blur(10px);
    z-index:1000;display:flex;align-items:center;justify-content:center;padding:20px;
    animation: fadeIn 0.3s ease;
  }
  .det-modal{
    background:#0F0F0F;border:1px solid rgba(255,215,0,0.2);border-radius:24px;
    width:100%;max-width:900px;max-height:90vh;overflow-y:auto;position:relative;
    box-shadow:0 25px 50px -12px rgba(255,215,0,0.1);display:flex;flex-direction:column;
  }
  .det-header{
    height:300px;position:relative;overflow:hidden;
  }
  .det-header-img{
    width:100%;height:100%;object-fit:cover;opacity:0.6;
  }
  .det-header-grad{
    position:absolute;inset:0;
    background:linear-gradient(to bottom, transparent, #0F0F0F);
  }
  .det-close{
    position:absolute;top:20px;right:20px;background:rgba(0,0,0,0.5);color:#fff;
    width:40px;height:40px;border-radius:50%;display:flex;align-items:center;
    justify-content:center;cursor:pointer;border:1px solid rgba(255,255,255,0.2);
    transition:all 0.2s;z-index:10;
  }
  .det-close:hover{background:#FFD700;color:#000;border-color:#FFD700;}
  
  .det-content{padding:0 40px 40px;}
  .det-title-section{margin-top:-60px;position:relative;z-index:2;margin-bottom:32px;}
  .det-name{font-size:32px;font-weight:900;color:#fff;letter-spacing:-1px;}
  .det-cat{
    display:inline-flex;align-items:center;gap:6px;background:rgba(255,215,0,0.1);
    color:#FFD700;padding:4px 12px;border-radius:100px;font-size:12px;font-weight:700;
    border:1px solid rgba(255,215,0,0.2);margin-top:8px;
  }
  
  .det-grid{display:grid;grid-template-columns:1.5fr 1fr;gap:40px;}
  .det-about-p{font-size:15px;color:rgba(255,255,255,0.7);line-height:1.7;margin-bottom:24px;}
  .det-section-title{
    font-size:18px;font-weight:800;color:#fff;margin-bottom:16px;
    display:flex;align-items:center;gap:10px;
  }
  
  .det-gallery{
    display:grid;grid-template-columns:repeat(auto-fill, minmax(140px, 1fr));gap:12px;
  }
  .gallery-item{
    height:100px;border-radius:12px;overflow:hidden;border:1px solid rgba(255,255,255,0.1);
    cursor:pointer;transition:transform 0.2s;
  }
  .gallery-item:hover{transform:scale(1.05);border-color:#FFD700;}
  .gallery-item img{width:100%;height:100%;object-fit:cover;}
  
  .det-sidebar{
    background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);
    border-radius:20px;padding:24px;height:fit-content;
  }
  .det-stat{display:flex;align-items:center;gap:12px;margin-bottom:20px;}
  .det-stat-icon{
    width:40px;height:40px;background:rgba(255,215,0,0.1);border-radius:10px;
    display:flex;align-items:center;justify-content:center;color:#FFD700;
  }
  .det-stat-label{font-size:12px;color:rgba(255,255,255,0.4);display:block;}
  .det-stat-val{font-size:14px;color:#fff;font-weight:600;}
  
  .det-apply-btn{
    width:100%;background:#FFD700;color:#000;padding:14px;border-radius:12px;
    font-weight:800;font-size:14px;display:flex;align-items:center;justify-content:center;
    gap:8px;margin-top:20px;box-shadow:0 10px 20px rgba(255,215,0,0.2);
    transition:all 0.2s;
  }
  .det-apply-btn:hover{transform:translateY(-2px);box-shadow:0 15px 30px rgba(255,215,0,0.3);}

  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  
  @media(max-width:768px){
    .det-grid{grid-template-columns:1fr;}
    .det-content{padding:0 24px 24px;}
    .det-header{height:200px;}
  }
`;

export default function ClubDetailsModal({ club, onClose, onJoin }) {
  const [activeImg, setActiveImg] = useState(club.logoUrl);

  return (
    <div className="det-overlay" onClick={onClose}>
      <style>{CSS}</style>
      <div className="det-modal" onClick={e => e.stopPropagation()}>
        <button className="det-close" onClick={onClose}><X size={20} /></button>
        
        <div className="det-header">
          <img src={activeImg || club.logoUrl} alt={club.name} className="det-header-img" />
          <div className="det-header-grad" />
        </div>
        
        <div className="det-content">
          <div className="det-title-section">
            <h2 className="det-name">{club.name}</h2>
            <div className="det-cat">{club.category}</div>
          </div>
          
          <div className="det-grid">
            <div className="det-left">
              <h3 className="det-section-title"><Target size={18} color="#FFD700" /> About the Club</h3>
              <p className="det-about-p">{club.about || club.description}</p>
              
              <h3 className="det-section-title"><ImageIcon size={18} color="#FFD700" /> Gallery & Events</h3>
              <div className="det-gallery">
                {[club.logoUrl, ...(club.gallery || [])].map((img, i) => (
                  <div key={i} className="gallery-item" onClick={() => setActiveImg(img)}>
                    <img src={img} alt={`Event ${i}`} />
                  </div>
                ))}
              </div>
            </div>
            
            <div className="det-right">
              <div className="det-sidebar">
                <div className="det-stat">
                  <div className="det-stat-icon"><Users size={18} /></div>
                  <div>
                    <span className="det-stat-label">Member Count</span>
                    <span className="det-stat-val">{club.memberCount || 100}+ Members</span>
                  </div>
                </div>
                <div className="det-stat">
                  <div className="det-stat-icon"><Calendar size={18} /></div>
                  <div>
                    <span className="det-stat-label">Frequency</span>
                    <span className="det-stat-val">Weekly Sessions</span>
                  </div>
                </div>
                
                <div style={{marginTop:'32px'}}>
                  <h4 style={{fontSize:'12px', color:'rgba(255,255,255,0.4)', marginBottom:'12px', textTransform:'uppercase', fontWeight:800}}>Tags</h4>
                  <div style={{display:'flex', flexWrap:'wrap', gap:6}}>
                    {club.tags.map(t => (
                      <span key={t} style={{fontSize:'10px', background:'rgba(255,255,255,0.05)', padding:'4px 10px', borderRadius:6, color:'rgba(255,255,255,0.6)', border:'1px solid rgba(255,255,255,0.1)'}}>
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
                
                <button className="det-apply-btn" onClick={() => onJoin(club)}>
                  Join this Club <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
