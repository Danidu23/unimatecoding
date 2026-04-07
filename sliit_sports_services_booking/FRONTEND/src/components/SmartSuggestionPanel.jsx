import React, { useState, useEffect } from 'react';
import api from '../api';
import './SmartSuggestionPanel.css';

const SmartSuggestionPanel = ({ facilityServiceId, date, onSelectSlot }) => {
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [conflicts, setConflicts] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!facilityServiceId || !date) return;

        const fetchSuggestions = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await api.get('/smart/suggestions', {
                    params: { facilityServiceId, date }
                });
                setSuggestions(res.data.suggestions || []);
            } catch (error) {
                console.error("Failed to fetch smart suggestions", error);
                setError("Unable to load smart suggestions");
                setSuggestions([]);
            } finally {
                setLoading(false);
            }
        };

        fetchSuggestions();
    }, [facilityServiceId, date]);

    const handleSlotSelection = async (slot) => {
        // Check for conflicts before selecting
        try {
            const res = await api.post('/smart/check-conflicts', {
                slotId: slot._id,
                date
            });
            if (res.data.hasConflict) {
                setConflicts(res.data.conflicts);
                // Still allow selection, just warn them
                setTimeout(() => onSelectSlot(slot), 500);
            } else {
                onSelectSlot(slot);
            }
        } catch (error) {
            console.error("Failed to check conflicts", error);
            onSelectSlot(slot); // Allow selection even if check fails
        }
    };

    if (!date) return null;
    
    if (loading) {
        return (
            <div className="smart-suggestion-panel">
                <div className="smart-header">
                    <span className="sparkle-icon">✨</span>
                    <h4>Smart Slot Suggestions</h4>
                </div>
                <div className="smart-panel-loading">Finding best slots...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="smart-suggestion-panel error">
                <div className="smart-header">
                    <span className="sparkle-icon">✨</span>
                    <h4>Smart Slot Suggestions</h4>
                </div>
                <div className="smart-error-message">⚠️ {error}</div>
            </div>
        );
    }

    if (suggestions.length === 0) {
        return (
            <div className="smart-suggestion-panel empty">
                <div className="smart-header">
                    <span className="sparkle-icon">✨</span>
                    <h4>Smart Slot Suggestions</h4>
                </div>
                <div className="smart-empty-message">
                    📅 No ideal slots available for this date. Check manual slot selection below.
                </div>
            </div>
        );
    }

    return (
        <div className="smart-suggestion-panel">
            {conflicts && (
                <div className="conflict-warning">
                    <span className="warning-icon">⚠️</span>
                    <div>
                        <strong>Time Conflict Detected!</strong>
                        <p>You already have booking(s) at this time:</p>
                        <ul>
                            {conflicts.map(c => (
                                <li key={c.id}>{c.facility}: {c.time}</li>
                            ))}
                        </ul>
                    </div>
                    <button onClick={() => setConflicts(null)}>Dismiss</button>
                </div>
            )}
            <div className="smart-header">
                <span className="sparkle-icon">✨</span>
                <h4>Smart Slot Suggestions</h4>
            </div>
            <p className="smart-desc">Top available slots based on occupancy and your schedule</p>
            <div className="smart-cards">
                {suggestions.map((slot, idx) => (
                    <div 
                        key={slot._id} 
                        className={`smart-card ${slot.hasConflict ? 'has-conflict' : ''} ${slot.isFull ? 'is-full' : ''}`}
                        onClick={() => handleSlotSelection(slot)}
                    >
                        <div className="slot-rank">#{idx + 1}</div>
                        <div className="smart-time">
                            <span className="time-text">{slot.startTime} - {slot.endTime}</span>
                        </div>
                        <div className={`smart-occupancy ${slot.occupancyLevel}`}>
                            <span className="status-icon">
                                {slot.occupancyLevel === 'low' ? '🟢' : 
                                 slot.occupancyLevel === 'medium' ? '🟡' : '🔴'}
                            </span>
                            <span className="status-text">
                                {slot.occupancyLevel === 'low' ? 'Less Crowded' : 
                                 slot.occupancyLevel === 'medium' ? 'Moderate' : 'Getting Full'}
                                <br/>
                                <small>{slot.occupancyPercentage}% full</small>
                            </span>
                        </div>
                        <div className="recommendation-badge">
                            {slot.recommendation}
                        </div>
                        {(slot.hasConflict || slot.isFull) && (
                            <div className="slot-warning">
                                {slot.hasConflict && '⚠️ You have a conflict'}
                                {slot.isFull && !slot.hasConflict && '⚠️ Slot full'}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SmartSuggestionPanel;
