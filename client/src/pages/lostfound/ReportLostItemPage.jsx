import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, Calendar, MapPin, Tag, Image as ImageIcon, Smartphone, Info, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import PotentialMatchesPanel from '../../components/lostfound/PotentialMatchesPanel';
import { findPotentialMatches } from '../../data/lostfound/lostFoundAdvanced';
import { setCurrentUserEmail } from '../../utils/lostfound/sessionUser';

const CATEGORIES = ['Electronics', 'Wallets & ID', 'Books & Notes', 'Clothing', 'Keys', 'Bags & Backpacks', 'Other'];
const LOCATIONS = [
  'New building lecture hall', 'Main building lecture hall', 'Engineering faculty lec hall',
  'Business faculty lec halls', 'Basement canteen', 'p&s', 'New canteen', 'New building library',
  'Anohana canteen', 'Juice bar', 'Finagle canteen', 'Sport Complex', 'Campus ground', 'Other'
];

export default function ReportLostItemPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [possibleMatches, setPossibleMatches] = useState([]);

  const [formData, setFormData] = useState({
    title: '', category: '', location: '', date: '', time: '',
    email: '', contactNo: '+94', desc: '', image: null
  });

  const similarImageCards = [
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80',
    'https://images.unsplash.com/photo-1542751110-97427bbecf20?w=500&q=80',
    'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=500&q=80'
  ];

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name === 'contactNo' && !value.startsWith('+94')) value = '+94';
    setFormData(p => ({ ...p, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) handleFile(e.target.files[0]);
  };

  const handleFile = (file) => {
    setFormData(p => ({ ...p, image: file }));
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const validateForm = () => {
    const nextErrors = {};

    if (formData.title.trim().length < 4) nextErrors.title = 'Title must be at least 4 characters.';
    if (!formData.category) nextErrors.category = 'Please select a category.';
    if (!formData.location) nextErrors.location = 'Please select a location.';
    if (!formData.date) nextErrors.date = 'Please choose the lost date.';
    if (formData.desc.trim().length < 25) nextErrors.desc = 'Description must be at least 25 characters.';
    if (!/^\+94\d{9}$/.test(formData.contactNo)) nextErrors.contactNo = 'Phone must match +94XXXXXXXXX.';
    if (!/^IT\d{8}@my\.sliit\.lk$/i.test(formData.email)) nextErrors.email = 'Must be a valid SLIIT email (IT********@my.sliit.lk).';

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const runSmartMatch = () => {
    if (!formData.title || !formData.location || !formData.date) {
      toast.error('Add title, location, and date to scan possible matches.');
      return;
    }
    const matches = findPotentialMatches(formData);
    setPossibleMatches(matches);
    if (matches.length) {
      toast.success(`${matches.length} potential matches found.`);
    } else {
      toast('No strong matches right now. We will keep scanning.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fix form errors before submitting.');
      return;
    }

    setIsSubmitting(true);
    const matches = findPotentialMatches(formData);
    setPossibleMatches(matches);
    setCurrentUserEmail(formData.email);
    
    try {
      const payload = { ...formData, image: imagePreview };
      const response = await fetch('http://localhost:5000/api/items/lost', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast.success('Lost item reported successfully!');
        navigate('/lost-found/submission-success', { state: { itemType: 'Lost', possibleMatches: matches.length } });
      } else {
        toast.error(result.message || 'Failed to submit report');
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ width: "100%", minHeight: "calc(100vh - 66px)", background: "#07091a", padding: "40px clamp(20px,6vw,60px) 120px" }}>
      <div style={{ maxWidth: "700px", margin: "0 auto" }}>
        
        <div style={{ textAlign: "center", marginBottom: "24px", animation: "fadeUp .4s ease-out" }}>
          <div style={{ width: "64px", height: "64px", borderRadius: "20px", background: "linear-gradient(135deg, rgba(245,166,35,.18), rgba(245,166,35,.05))", border: "1px solid rgba(245,166,35,.26)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", boxShadow: "0 12px 30px rgba(245,166,35,.12)" }}>
            <MapPin size={28} color="#F5A623" />
          </div>
          <h1 style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 900, color: "#fff", fontFamily: "Manrope,sans-serif", marginBottom: "8px" }}>Report Lost Item</h1>
          <p style={{ fontSize: "15px", color: "rgba(255,255,255,.5)", lineHeight: 1.6, maxWidth: "560px", margin: "0 auto" }}>Share the details that matter most so other students can quickly identify and return your item.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px", marginBottom: "18px" }}>
          {[
            { title: 'Clear title', text: 'Use the item name people would search for.' },
            { title: 'Add location', text: 'Choose the most accurate campus area.' },
            { title: 'Upload photo', text: 'Optional, but helps with matching.' }
          ].map((tip) => (
            <div key={tip.title} style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)', borderRadius: '16px', padding: '14px 16px' }}>
              <p style={{ color: '#F5A623', fontSize: '12px', fontWeight: 800, fontFamily: 'Manrope,sans-serif', marginBottom: '4px' }}>{tip.title}</p>
              <p style={{ color: 'rgba(255,255,255,.52)', fontSize: '12px', lineHeight: 1.5 }}>{tip.text}</p>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} style={{ background: "linear-gradient(180deg, rgba(255,255,255,.04), rgba(255,255,255,.025))", border: "1px solid rgba(255,255,255,.08)", borderRadius: "24px", padding: "30px", boxShadow: "0 18px 60px rgba(0,0,0,.25)", animation: "fadeUp .5s ease-out .1s both" }}>
          
          <div className="sec-head">
            <span style={{ display: "flex", alignItems: "center", gap: "7px", fontSize: "16px", fontWeight: 800, color: "#fff", fontFamily: "Manrope,sans-serif" }}>
              <span style={{ color: "#F5A623", display: "flex" }}><Info size={16}/></span> Basic Info
            </span>
            <div className="sec-line" />
          </div>

          <div className="form-group">
            <label className="form-label">Item Title*</label>
            <input name="title" value={formData.title} onChange={handleChange} required placeholder="e.g. Blue Dell Laptop, Wallet with ID" className="form-input" />
            {errors.title ? <span style={{ color: '#f87171', fontSize: '12px' }}>{errors.title}</span> : null}
          </div>

          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginBottom: "20px" }}>
            <div className="form-group" style={{ flex: "1 1 calc(50% - 8px)", marginBottom: 0 }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Tag size={13}/> Category*</label>
              <select name="category" value={formData.category} onChange={handleChange} required className="form-select">
                <option value="" disabled style={{ background: "#07091a", color: "#fff" }}>Select category</option>
                {CATEGORIES.map(c => <option key={c} value={c} style={{ background: "#07091a", color: "#fff" }}>{c}</option>)}
              </select>
              {errors.category ? <span style={{ color: '#f87171', fontSize: '12px' }}>{errors.category}</span> : null}
            </div>
            <div className="form-group" style={{ flex: "1 1 calc(50% - 8px)", marginBottom: 0 }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><MapPin size={13}/> Last Seen Location*</label>
              <select name="location" value={formData.location} onChange={handleChange} required className="form-select">
                <option value="" disabled style={{ background: "#07091a", color: "#fff" }}>Select SLIIT Location</option>
                {LOCATIONS.map(c => <option key={c} value={c} style={{ background: "#07091a", color: "#fff" }}>{c}</option>)}
              </select>
              {errors.location ? <span style={{ color: '#f87171', fontSize: '12px' }}>{errors.location}</span> : null}
            </div>
          </div>

          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginBottom: "20px" }}>
            <div className="form-group" style={{ flex: "1 1 calc(50% - 8px)", marginBottom: 0 }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Calendar size={13}/> Date Lost*</label>
              <input type="date" name="date" value={formData.date} onChange={handleChange} required max={new Date().toISOString().split('T')[0]} className="form-input" style={{ colorScheme: 'dark' }} />
              {errors.date ? <span style={{ color: '#f87171', fontSize: '12px' }}>{errors.date}</span> : null}
            </div>
            <div className="form-group" style={{ flex: "1 1 calc(50% - 8px)", marginBottom: 0 }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Info size={13}/> Approximate Time</label>
              <input type="time" name="time" value={formData.time} onChange={handleChange} className="form-input" style={{ colorScheme: 'dark' }} />
            </div>
          </div>

          <div className="sec-head" style={{ marginTop: "32px" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "7px", fontSize: "16px", fontWeight: 800, color: "#fff", fontFamily: "Manrope,sans-serif" }}>
              <span style={{ color: "#F5A623", display: "flex" }}><ImageIcon size={16}/></span> Description & Media
            </span>
            <div className="sec-line" />
          </div>

          <div className="form-group">
            <label className="form-label">Detailed Description*</label>
            <textarea name="desc" value={formData.desc} onChange={handleChange} required placeholder="Provide color, brand, distinct marks, serial numbers, etc." className="form-textarea"></textarea>
            {errors.desc ? <span style={{ color: '#f87171', fontSize: '12px' }}>{errors.desc}</span> : null}
          </div>

          <div className="form-group">
            <label className="form-label">Upload Image (Optional)</label>
            <div className={`drag-drop-area ${dragActive ? 'drag-over' : ''}`} onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}>
              <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} id="image-upload" />
              {imagePreview ? (
                <div style={{ position: "relative", width: "100%", maxWidth: "300px", borderRadius: "12px", overflow: "hidden" }}>
                  <img src={imagePreview} alt="Preview" style={{ width: "100%", display: "block", objectFit: "contain" }} />
                  <label htmlFor="image-upload" style={{ position: "absolute", bottom: "10px", right: "10px", background: "rgba(0,0,0,.7)", color: "#fff", padding: "6px 12px", borderRadius: "6px", fontSize: "12px", cursor: "pointer", backdropFilter: "blur(4px)" }}>Change Image</label>
                </div>
              ) : (
                <label htmlFor="image-upload" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", cursor: "pointer", width: "100%" }}>
                  <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(245,166,35,.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <UploadCloud size={24} color="#F5A623" />
                  </div>
                  <div>
                    <p style={{ fontSize: "14px", fontWeight: 600, color: "rgba(255,255,255,.8)" }}>Drag & drop an image here</p>
                    <p style={{ fontSize: "12px", color: "rgba(255,255,255,.4)", marginTop: "4px" }}>or click to browse from your device</p>
                  </div>
                </label>
              )}
            </div>
          </div>

          <div style={{ marginTop: '8px', border: '1px solid rgba(245,166,35,.18)', borderRadius: '16px', padding: '16px', background: 'rgba(245,166,35,.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: "rgba(245,166,35,.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ShieldCheck size={20} color="#F5A623" />
              </div>
              <div>
                <p style={{ fontSize: '14px', color: '#fff', fontWeight: 800, fontFamily: 'Manrope,sans-serif', marginBottom: "2px" }}>Campus verification support</p>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,.6)' }}>Your report will be checked against found items in the database.</p>
              </div>
            </div>
            <button type="button" className="btn-outline" style={{ padding: '8px 14px', fontSize: '13px' }} onClick={runSmartMatch}>
              Check Matches
            </button>
          </div>

          <div className="sec-head" style={{ marginTop: "32px" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "7px", fontSize: "16px", fontWeight: 800, color: "#fff", fontFamily: "Manrope,sans-serif" }}>
              <span style={{ color: "#F5A623", display: "flex" }}><Smartphone size={16}/></span> Contact Details
            </span>
            <div className="sec-line" />
          </div>

          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <div className="form-group" style={{ flex: "1 1 calc(50% - 8px)" }}>
              <label className="form-label">SLIIT Student Email*</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="IT********@my.sliit.lk" className="form-input" />
              {errors.email ? <span style={{ color: '#f87171', fontSize: '12px' }}>{errors.email}</span> : null}
            </div>
            <div className="form-group" style={{ flex: "1 1 calc(50% - 8px)" }}>
              <label className="form-label">WhatsApp / Phone Number*</label>
              <input name="contactNo" value={formData.contactNo} onChange={handleChange} required placeholder="+94 XX XXX XXXX" className="form-input" pattern="^\+94\d{9}$" title="+94 followed by 9 digits" />
              {errors.contactNo ? <span style={{ color: '#f87171', fontSize: '12px' }}>{errors.contactNo}</span> : null}
            </div>
          </div>

          <div style={{ marginTop: "40px" }}>
            <button type="submit" disabled={isSubmitting} className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: "16px", fontSize: "16px", borderRadius: "14px" }}>
              {isSubmitting ? 'Submitting Report...' : 'Submit Lost Item Report'}
            </button>
          </div>

          <PotentialMatchesPanel items={possibleMatches} onOpenItem={(itemId) => navigate(`/lost-found/item/${itemId}`)} />
        </form>
      </div>
    </div>
  );
}
