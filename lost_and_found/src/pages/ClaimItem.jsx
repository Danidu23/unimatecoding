import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { UploadCloud, AlertCircle, Hand, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { mockItems } from '../mockdata';
import { dynamicMatchesCache } from '../data/lostFoundAdvanced';

export default function ClaimItem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [claimStatus, setClaimStatus] = useState('PENDING');
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    explanation: '',
    color: '',
    brand: '',
    identifier: '',
    image: null
  });

  useEffect(() => {
    const load = async () => {
      try {
        let found = null;
        for (const kind of ['lost', 'found']) {
          const response = await fetch(`http://localhost:5000/api/items/${kind}/${id}`);
          if (response.ok) {
            const result = await response.json();
            if (result.success) {
              const data = result.data;
              found = kind === 'lost'
                ? { id: data._id, title: data.itemName, category: data.category, location: data.lastSeenLocation, date: data.dateLost, description: data.description, image: data.image, reporter: data.contact, status: data.status || 'Pending' }
                : { id: data._id, title: data.itemName, category: data.category, location: data.locationFound, date: data.dateFound, description: data.description, image: data.image, reporter: data.finderContact, status: data.status || 'Pending' };
              break;
            }
          }
        }
        if (!found) {
          const numericId = parseInt(id, 10);
          found = mockItems.find((entry) => entry.id === numericId) || dynamicMatchesCache[numericId] || null;
        }
        setItem(found);
      } catch (error) {
        const numericId = parseInt(id, 10);
        setItem(mockItems.find((entry) => entry.id === numericId) || dynamicMatchesCache[numericId] || null);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const handleChange = (e) => {
    setFormData(p => ({ ...p, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
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

  const validate = () => {
    const next = {};
    if (formData.explanation.trim().length < 20) next.explanation = 'Please provide at least 20 characters.';
    if (!formData.color.trim()) next.color = 'Color is required.';
    if (!formData.brand.trim()) next.brand = 'Brand is required.';
    if (formData.identifier.trim().length < 4) next.identifier = 'Unique identifier is required.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please fill all verification fields correctly.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('http://localhost:5000/api/claims', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemId: item.id,
          explanation: formData.explanation,
          identifier: `${formData.brand} | ${formData.color} | ${formData.identifier}`,
          proofImage: imagePreview,
          claimantEmail: ''
        })
      });

      const result = await response.json();
      if (result.success) {
        setClaimStatus('PENDING');
        toast.success('Claim request submitted. Awaiting admin review.');
        navigate('/submission-success', { state: { message: 'Your claim has been submitted and is awaiting admin approval.', itemType: 'Claim' } });
      } else {
        toast.error(result.message || 'Failed to submit claim');
      }
    } catch (error) {
      console.error('Claim submit error:', error);
      toast.error('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div style={{ width: '100%', minHeight: 'calc(100vh - 66px)', background: '#07091a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>Loading claim form...</div>;
  }

  if (!item) {
    return <div className="text-center py-20 text-white">Item not found.</div>;
  }

  return (
    <div style={{ width: "100%", minHeight: "calc(100vh - 66px)", background: "#07091a", padding: "40px clamp(20px,6vw,60px) 120px" }}>
      <div style={{ maxWidth: "700px", margin: "0 auto" }}>
        
        <div style={{ textAlign: "center", marginBottom: "32px", animation: "fadeUp .4s ease-out" }}>
          <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: "rgba(245,166,35,.12)", border: "1.5px solid rgba(245,166,35,.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <Hand size={26} color="#F5A623" />
          </div>
          <h1 style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 900, color: "#fff", fontFamily: "Manrope,sans-serif", marginBottom: "8px" }}>Submit Claim Request</h1>
          <p style={{ fontSize: "15px", color: "rgba(255,255,255,.5)", lineHeight: 1.6 }}>You are claiming: <strong style={{color: "#fff"}}>{item.title}</strong></p>
        </div>

        <form onSubmit={handleSubmit} style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.08)", borderRadius: "24px", padding: "32px", animation: "fadeUp .5s ease-out .1s both" }}>
          
          <div style={{ background: "rgba(59,130,246,.1)", border: "1px solid rgba(59,130,246,.2)", borderRadius: "12px", padding: "16px", display: "flex", gap: "12px", marginBottom: "24px" }}>
            <AlertCircle size={20} style={{ color: "#3b82f6", flexShrink: 0, marginTop: "2px" }} />
            <div>
              <h4 style={{ fontWeight: 700, color: "rgba(255,255,255,.9)"}}>Important Notice</h4>
              <p style={{ fontSize: "14px", color: "rgba(255,255,255,.6)", lineHeight: 1.6, marginTop: "4px" }}>
                Only submit a claim if you are absolutely sure this is your item. False claims may result in disciplinary action.
              </p>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Why does this item belong to you?*</label>
            <textarea name="explanation" value={formData.explanation} onChange={handleChange} required placeholder="Provide context on when and where you lost it..." className="form-textarea"></textarea>
            {errors.explanation ? <span style={{ color: '#f87171', fontSize: '12px' }}>{errors.explanation}</span> : null}
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <div className="form-group" style={{ flex: '1 1 180px' }}>
              <label className="form-label">Color*</label>
              <input name="color" value={formData.color} onChange={handleChange} placeholder="e.g. Matte Black" className="form-input" />
              {errors.color ? <span style={{ color: '#f87171', fontSize: '12px' }}>{errors.color}</span> : null}
            </div>
            <div className="form-group" style={{ flex: '1 1 180px' }}>
              <label className="form-label">Brand*</label>
              <input name="brand" value={formData.brand} onChange={handleChange} placeholder="e.g. Dell, Apple, Casio" className="form-input" />
              {errors.brand ? <span style={{ color: '#f87171', fontSize: '12px' }}>{errors.brand}</span> : null}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Unique Identifier Description*</label>
            <input name="identifier" value={formData.identifier} onChange={handleChange} required placeholder="e.g., Sticker on back, specific scratch, wallpaper" className="form-input" />
            {errors.identifier ? <span style={{ color: '#f87171', fontSize: '12px' }}>{errors.identifier}</span> : null}
          </div>

          <div className="form-group">
            <label className="form-label">Upload Proof Image (Optional)</label>
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
                    <p style={{ fontSize: "12px", color: "rgba(255,255,255,.4)", marginTop: "4px" }}>Receipts, IMEI boxes, old photos etc.</p>
                  </div>
                </label>
              )}
            </div>
          </div>

          <div style={{ marginTop: "40px", display: "flex", gap: "16px" }}>
            <button type="button" onClick={() => navigate(-1)} className="btn-secondary" style={{ width: "100%", justifyContent: "center", padding: "16px", fontSize: "16px" }}>
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: "16px", fontSize: "16px" }}>
              {isSubmitting ? 'Submitting...' : 'Submit Claim'}
            </button>
          </div>

          <div style={{ marginTop: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,.1)', background: 'rgba(255,255,255,.02)', padding: '12px 14px' }}>
            <p style={{ color: 'rgba(255,255,255,.55)', fontSize: '12px', marginBottom: '8px' }}>Claim Verification Status</p>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', borderRadius: '999px', padding: '4px 10px', fontSize: '11px', fontWeight: 800, border: `1px solid ${claimStatus === 'APPROVED' ? 'rgba(34,197,94,.4)' : claimStatus === 'REJECTED' ? 'rgba(239,68,68,.4)' : 'rgba(245,166,35,.4)'}`, color: claimStatus === 'APPROVED' ? '#22c55e' : claimStatus === 'REJECTED' ? '#ef4444' : '#F5A623', background: claimStatus === 'APPROVED' ? 'rgba(34,197,94,.12)' : claimStatus === 'REJECTED' ? 'rgba(239,68,68,.12)' : 'rgba(245,166,35,.12)' }}>
              <ShieldCheck size={12} /> {claimStatus}
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}
