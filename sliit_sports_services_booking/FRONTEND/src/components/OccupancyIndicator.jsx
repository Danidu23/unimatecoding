import React, { useState, useEffect } from 'react';
import api from '../api';
import './OccupancyIndicator.css';

const OccupancyIndicator = ({ facilityServiceId, date, slots }) => {
    const [occupancyData, setOccupancyData] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!facilityServiceId || !date) return;

        const fetchOccupancy = async () => {
            setLoading(true);
            try {
                const res = await api.get('/smart/occupancy', {
                    params: { facilityServiceId, date }
                });
                const dataMap = {};
                res.data.slots.forEach(slot => {
                    dataMap[slot._id] = slot;
                });
                setOccupancyData(dataMap);
            } catch (error) {
                console.error('Error fetching occupancy data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOccupancy();
        // Refresh every 60 seconds
        const interval = setInterval(fetchOccupancy, 60000);
        return () => clearInterval(interval);
    }, [facilityServiceId, date]);

    const getOccupancyClass = (level) => {
        switch (level) {
            case 'low': return 'occupancy-low';
            case 'medium': return 'occupancy-medium';
            case 'full': return 'occupancy-full';
            default: return 'occupancy-unknown';
        }
    };

    const getOccupancyIcon = (level) => {
        switch (level) {
            case 'low': return '🟢';
            case 'medium': return '🟡';
            case 'full': return '🔴';
            default: return '⚪';
        }
    };

    if (loading && Object.keys(occupancyData).length === 0) {
        return <div className="occupancy-loading">Loading occupancy info...</div>;
    }

    return (
        <div className="occupancy-legend">
            <h5>Live Occupancy Status</h5>
            <div className="occupancy-indicators">
                <div className="indicator-item">
                    <span className="icon">🟢</span>
                    <span className="label">Low (0-39%)</span>
                </div>
                <div className="indicator-item">
                    <span className="icon">🟡</span>
                    <span className="label">Medium (40-79%)</span>
                </div>
                <div className="indicator-item">
                    <span className="icon">🔴</span>
                    <span className="label">Full (80%+)</span>
                </div>
            </div>

            {slots && slots.length > 0 && (
                <div className="slots-occupancy">
                    {slots.map(slot => {
                        const occupancy = occupancyData[slot._id];
                        if (!occupancy) return null;

                        return (
                            <div key={slot._id} className={`slot-occupancy-row ${getOccupancyClass(occupancy.occupancyLevel)}`}>
                                <div className="slot-time">{slot.startTime} - {slot.endTime}</div>
                                <div className="occupancy-bar">
                                    <div 
                                        className={`occupancy-fill ${occupancy.occupancyLevel}`}
                                        style={{ width: `${occupancy.occupancyPercentage}%` }}
                                    />
                                </div>
                                <div className="occupancy-info">
                                    <span className="icon">{getOccupancyIcon(occupancy.occupancyLevel)}</span>
                                    <span className="percentage">{occupancy.occupancyPercentage}%</span>
                                    {occupancy.isFull && <span className="full-badge">FULL</span>}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default OccupancyIndicator;
