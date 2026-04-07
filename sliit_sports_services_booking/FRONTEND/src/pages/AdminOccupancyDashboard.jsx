import { useState, useEffect } from 'react';
import { format, addDays } from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import api from '../api';
import './AdminOccupancyDashboard.css';

const AdminOccupancyDashboard = () => {
    const [facilities, setFacilities] = useState([]);
    const [selectedFacility, setSelectedFacility] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [occupancyData, setOccupancyData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({});

    useEffect(() => {
        fetchFacilities();
    }, []);

    useEffect(() => {
        if (selectedFacility) {
            fetchOccupancyData();
        }
    }, [selectedFacility, selectedDate]);

    const fetchFacilities = async () => {
        try {
            const res = await api.get('/facilities');
            setFacilities(res.data);
            if (res.data.length > 0) {
                setSelectedFacility(res.data[0]._id);
            }
        } catch (error) {
            console.error('Error fetching facilities:', error);
        }
    };

    const fetchOccupancyData = async () => {
        setLoading(true);
        try {
            const dateStr = format(selectedDate, 'yyyy-MM-dd');
            const res = await api.get('/smart/occupancy', {
                params: { facilityServiceId: selectedFacility, date: dateStr }
            });
            setOccupancyData(res.data.slots || []);
            
            // Calculate statistics
            const totalCapacity = res.data.slots.reduce((sum, s) => sum + s.capacity, 0);
            const totalBooked = res.data.slots.reduce((sum, s) => sum + s.booked, 0);
            const averageOccupancy = totalCapacity > 0 ? (totalBooked / totalCapacity) * 100 : 0;
            const fullSlots = res.data.slots.filter(s => s.isFull).length;

            setStats({
                totalSlots: res.data.slots.length,
                totalCapacity,
                totalBooked,
                averageOccupancy: Math.round(averageOccupancy),
                fullSlots,
                availableSlots: res.data.slots.filter(s => !s.isFull).length
            });
        } catch (error) {
            console.error('Error fetching occupancy:', error);
        } finally {
            setLoading(false);
        }
    };

    const getOccupancyColor = (percentage) => {
        if (percentage < 40) return '#4caf50'; // Green
        if (percentage < 80) return '#ff9800'; // Orange
        return '#f44336'; // Red
    };

    const selectedFacilityName = facilities.find(f => f._id === selectedFacility)?.name || '';

    return (
        <div className="occupancy-dashboard">
            <div className="dashboard-header">
                <h2>📊 Real-Time Occupancy Dashboard</h2>
                <p>Monitor slot availability and facility occupancy across all your services</p>
            </div>

            <div className="dashboard-controls">
                <div className="control-group">
                    <label>Select Facility</label>
                    <select 
                        value={selectedFacility || ''} 
                        onChange={(e) => setSelectedFacility(e.target.value)}
                    >
                        {facilities.map(f => (
                            <option key={f._id} value={f._id}>{f.name}</option>
                        ))}
                    </select>
                </div>

                <div className="control-group">
                    <label>Select Date</label>
                    <DatePicker
                        selected={selectedDate}
                        onChange={setSelectedDate}
                        minDate={new Date()}
                        maxDate={addDays(new Date(), 30)}
                        dateFormat="EEEE, MMMM d, yyyy"
                        className="form-input"
                    />
                </div>
            </div>

            {loading ? (
                <div className="loading-container"><div className="spinner" /></div>
            ) : (
                <>
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-icon">📅</div>
                            <div className="stat-value">{stats.totalSlots}</div>
                            <div className="stat-label">Total Slots</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">👥</div>
                            <div className="stat-value">{stats.totalBooked}/{stats.totalCapacity}</div>
                            <div className="stat-label">Capacity Usage</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">📈</div>
                            <div className="stat-value">{stats.averageOccupancy}%</div>
                            <div className="stat-label">Avg Occupancy</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">🔴</div>
                            <div className="stat-value">{stats.fullSlots}</div>
                            <div className="stat-label">Full Slots</div>
                        </div>
                    </div>

                    <div className="occupancy-chart">
                        <h3>Overall Facility Occupancy</h3>
                        <div className="progress-bar">
                            <div 
                                className="progress-fill" 
                                style={{
                                    width: `${stats.averageOccupancy}%`,
                                    backgroundColor: getOccupancyColor(stats.averageOccupancy)
                                }}
                            />
                        </div>
                        <div className="progress-labels">
                            <span>0%</span>
                            <span>{stats.averageOccupancy}%</span>
                            <span>100%</span>
                        </div>
                    </div>

                    <div className="slots-list">
                        <h3>Time Slot Details - {selectedFacilityName}</h3>
                        <div className="slots-header">
                            <span>Time Slot</span>
                            <span>Occupancy</span>
                            <span>Booked / Capacity</span>
                            <span>Status</span>
                        </div>

                        {occupancyData.length === 0 ? (
                            <div className="empty-state">
                                <p>No slots available for this date</p>
                            </div>
                        ) : (
                            <div className="slots-container">
                                {occupancyData.map((slot) => (
                                    <div key={slot._id} className="slot-item">
                                        <div className="slot-time">
                                            {slot.startTime} - {slot.endTime}
                                        </div>
                                        <div className="occupancy-visual">
                                            <div className="occupancy-bar-small">
                                                <div 
                                                    className="occupancy-fill-small"
                                                    style={{
                                                        width: `${slot.occupancyPercentage}%`,
                                                        backgroundColor: getOccupancyColor(slot.occupancyPercentage)
                                                    }}
                                                />
                                            </div>
                                            <span className="occupancy-percent">
                                                {slot.occupancyPercentage}%
                                            </span>
                                        </div>
                                        <div className="slot-capacity">
                                            {slot.booked} / {slot.capacity}
                                        </div>
                                        <div className="slot-status">
                                            {slot.isFull ? (
                                                <span className="status-badge status-full">🔴 FULL</span>
                                            ) : (
                                                <span className={`status-badge status-${slot.occupancyLevel}`}>
                                                    {slot.statusIcon} {slot.occupancyLevel.toUpperCase()}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="legend-section">
                        <h3>Occupancy Legend</h3>
                        <div className="legend-items">
                            <div className="legend-item">
                                <span className="legend-color" style={{ backgroundColor: '#4caf50' }}/>
                                <span>Low (0-39%)</span>
                            </div>
                            <div className="legend-item">
                                <span className="legend-color" style={{ backgroundColor: '#ff9800' }}/>
                                <span>Medium (40-79%)</span>
                            </div>
                            <div className="legend-item">
                                <span className="legend-color" style={{ backgroundColor: '#f44336' }}/>
                                <span>Full (80-100%)</span>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default AdminOccupancyDashboard;
