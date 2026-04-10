import React, { useState } from 'react';
import './PriorityBookingForm.css';

const PriorityBookingForm = ({ facilityType, onPriorityChange }) => {
    const [isPriority, setIsPriority] = useState(false);
    const [priorityReason, setPriorityReason] = useState('');

    // Priority booking only available for student services
    const canUsePriority = facilityType === 'service';

    const priorityOptions = {
        service: [
            { value: 'medical_urgent', label: 'Medical Emergency/Urgent Care' },
            { value: 'health_concern', label: 'Serious Health Concern' },
            { value: 'academic_support', label: 'Academic Support Needed' },
            { value: 'other', label: 'Other (specify below)' }
        ]
    };

    const handlePriorityToggle = (e) => {
        const checked = e.target.checked;
        setIsPriority(checked);
        if (!checked) {
            setPriorityReason('');
        }
        onPriorityChange({ isPriority: checked, priorityReason: '' });
    };

    const handleReasonChange = (e) => {
        const reason = e.target.value;
        setPriorityReason(reason);
        onPriorityChange({ isPriority, priorityReason: reason });
    };

    if (!canUsePriority) {
        return null;
    }

    return (
        <div className="priority-booking-form">
            <div className="priority-header">
                <h4>🔴 Priority Booking</h4>
                <p className="priority-info">Available for urgent student service requests only</p>
            </div>

            <div className="priority-checkbox">
                <input
                    type="checkbox"
                    id="isPriority"
                    checked={isPriority}
                    onChange={handlePriorityToggle}
                />
                <label htmlFor="isPriority">
                    This is an urgent request that needs priority handling
                </label>
            </div>

            {isPriority && (
                <div className="priority-details">
                    <div className="form-group">
                        <label htmlFor="priorityReason">
                            Reason for Priority Request *
                        </label>
                        <select
                            id="priorityReason"
                            value={priorityReason}
                            onChange={handleReasonChange}
                            required
                        >
                            <option value="">-- Select a reason --</option>
                            {priorityOptions.service.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {priorityReason === 'other' && (
                        <div className="form-group">
                            <label htmlFor="customReason">
                                Please specify your reason
                            </label>
                            <textarea
                                id="customReason"
                                placeholder="Describe why you need priority handling..."
                                rows="3"
                                onChange={(e) => onPriorityChange({ isPriority, priorityReason: e.target.value })}
                            />
                        </div>
                    )}

                    <div className="priority-warning">
                        <span className="warning-icon">⚠️</span>
                        <p>
                            <strong>Note:</strong> Priority claims are subject to verification by staff. 
                            False claims may result in disciplinary action.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PriorityBookingForm;
