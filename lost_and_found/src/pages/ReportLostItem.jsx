import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PackageSearch, UploadCloud, Calendar, MapPin, Tag, Image as ImageIcon, Smartphone, Info } from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORIES = ['Electronics', 'Wallets & ID', 'Books & Notes', 'Clothing', 'Keys', 'Bags & Backpacks', 'Other'];
const LOCATIONS = [
  'New building lecture hall', 'Main building lecture hall', 'Engineering faculty lec hall',
  'Business faculty lec halls', 'Basement canteen', 'p&s', 'New canteen', 'New building library',
  'Anohana canteen', 'Juice bar', 'Finagle canteen', 'Sport Complex', 'Campus ground', 'Other'
];

export default function ReportLostItem() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    title: '', category: '', location: '', date: '', time: '',
    contactNo: '+94', desc: '', image: null
  });

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name === 'contactNo' && !value.startsWith('+94')) value = '+94';
    setFormData(p => ({ ...p, [name]: value }));
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      toast.success('Lost item reported successfully!');
      setIsSubmitting(false);
      navigate('/submission-success', { state: { itemType: 'Lost' } });
    }, 1200);
  };

  return (
    <div style={{ width: "100%", minHeight: "calc(100vh - 66px)", background: "#07091a", padding: "40px clamp(20px,6vw,60px) 120px" }}>
      <div style={{ maxWidth: "700px", margin: "0 auto" }}>
        
        <div style={{ textAlign: "center", marginBottom: "32px", animation: "fadeUp .4s ease-out" }}>
          <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: "rgba(239,68,68,.12)", border: "1.5px solid rgba(239,68,68,.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <PackageSearch size={26} color="#ef4444" />
          </div>
          <h1 style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 900, color: "#fff", fontFamily: "Manrope,sans-serif", marginBottom: "8px" }}>Report Lost Item</h1>
          <p style={{ fontSize: "15px", color: "rgba(255,255,255,.5)", lineHeight: 1.6 }}>Please provide as much detail as possible to help others identify your item.</p>
        </div>

        <form onSubmit={handleSubmit} style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.08)", borderRadius: "24px", padding: "32px", animation: "fadeUp .5s ease-out .1s both" }}>
          
          <div className="sec-head">
            <span style={{ display: "flex", alignItems: "center", gap: "7px", fontSize: "16px", fontWeight: 800, color: "#fff", fontFamily: "Manrope,sans-serif" }}>
              <span style={{ color: "#F5A623", display: "flex" }}><Info size={16}/></span> Basic Info
            </span>
            <div className="sec-line" />
          </div>

          <div className="form-group">
            <label className="form-label">Item Title*</label>
            <input name="title" value={formData.title} onChange={handleChange} required placeholder="e.g. Blue Dell Laptop, Wallet with ID" className="form-input" />
          </div>

          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginBottom: "20px" }}>
            <div className="form-group" style={{ flex: "1 1 calc(50% - 8px)", marginBottom: 0 }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Tag size={13}/> Category*</label>
              <select name="category" value={formData.category} onChange={handleChange} required className="form-select">
                <option value="" disabled>Select category</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group" style={{ flex: "1 1 calc(50% - 8px)", marginBottom: 0 }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><MapPin size={13}/> Last Seen Location*</label>
              <select name="location" value={formData.location} onChange={handleChange} required className="form-select">
                <option value="" disabled>Select SLIIT Location</option>
                {LOCATIONS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginBottom: "20px" }}>
            <div className="form-group" style={{ flex: "1 1 calc(50% - 8px)", marginBottom: 0 }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Calendar size={13}/> Date Lost*</label>
              <input type="date" name="date" value={formData.date} onChange={handleChange} required max={new Date().toISOString().split('T')[0]} className="form-input" style={{ colorScheme: 'dark' }} />
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

          <div className="sec-head" style={{ marginTop: "32px" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "7px", fontSize: "16px", fontWeight: 800, color: "#fff", fontFamily: "Manrope,sans-serif" }}>
              <span style={{ color: "#F5A623", display: "flex" }}><Smartphone size={16}/></span> Contact Details
            </span>
            <div className="sec-line" />
          </div>

          <div className="form-group">
            <label className="form-label">WhatsApp / Phone Number*</label>
            <input name="contactNo" value={formData.contactNo} onChange={handleChange} required placeholder="+94 XX XXX XXXX" className="form-input" 
              pattern="^\+94\d{9}$" title="+94 followed by 9 digits" />
          </div>

          <div style={{ marginTop: "40px" }}>
            <button type="submit" disabled={isSubmitting} className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: "16px", fontSize: "16px" }}>
              {isSubmitting ? 'Submitting Report...' : 'Submit Lost Item Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
