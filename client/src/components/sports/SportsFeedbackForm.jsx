import React, { useState } from 'react';
import { FiX, FiStar } from 'react-icons/fi';
import api from '../../api/sportsApi';
import toast from 'react-hot-toast';

const SportsFeedbackForm = ({ isOpen, onClose, booking, onSubmitted }) => {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    if (!isOpen || !booking) return null;

    const handleSubmit = async () => {
        if (rating === 0) {
            toast.error('Please select a star rating');
            return;
        }

        setSubmitting(true);
        try {
            await api.post('/feedback', {
                bookingId: booking._id,
                rating,
                comment
            });
            toast.success('Thank you for your feedback!');
            onSubmitted();
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to submit feedback');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal" style={{ maxWidth: '450px' }}>
                <div className="modal-header">
                    <h3>Rate Your Experience</h3>
                    <button className="btn-ghost btn-sm" onClick={onClose}>
                        <FiX />
                    </button>
                </div>
                <div className="modal-body">
                    <p style={{ marginBottom: '16px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        How was your session at <strong>{booking.facilityServiceId?.name}</strong>?
                    </p>
                    
                    <div className="star-rating" style={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        gap: '8px', 
                        fontSize: '2rem',
                        marginBottom: '24px'
                    }}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: (hover || rating) >= star ? 'var(--accent-primary)' : 'var(--text-muted)',
                                    transition: 'color 0.2s'
                                }}
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHover(star)}
                                onMouseLeave={() => setHover(0)}
                            >
                                <FiStar fill={(hover || rating) >= star ? 'currentColor' : 'none'} />
                            </button>
                        ))}
                    </div>

                    <div className="form-group">
                        <label className="form-label">Your Comments (Optional)</label>
                        <textarea
                            className="form-input"
                            placeholder="Tell us about your experience..."
                            rows="4"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            style={{ resize: 'none' }}
                        />
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="btn btn-ghost" onClick={onClose} disabled={submitting}>
                        Cancel
                    </button>
                    <button 
                        className="btn btn-primary" 
                        onClick={handleSubmit}
                        disabled={submitting}
                    >
                        {submitting ? 'Submitting...' : 'Submit Feedback'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SportsFeedbackForm;
