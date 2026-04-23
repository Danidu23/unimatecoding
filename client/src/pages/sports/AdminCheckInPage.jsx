import React from 'react';
import SportsQRScanner from '../../components/sports/SportsQRScanner';
import { FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const AdminCheckInPage = () => {
    const navigate = useNavigate();

    return (
        <div className="admin-checkin-page" style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto' }}>
            <div className="page-header" style={{ marginBottom: '40px' }}>
                <button className="btn btn-ghost" onClick={() => navigate(-1)} style={{ marginBottom: '20px' }}>
                    <FiArrowLeft /> Back
                </button>
                <h1>Attendance Check-in</h1>
                <p>Scan student booking QR codes to verify attendance and unlock facility access.</p>
            </div>

            <div className="card" style={{ padding: '40px', background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border-card)' }}>
                <SportsQRScanner />
            </div>

            <div className="checkin-tips" style={{ marginTop: '40px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                <h3>Helpful Tips:</h3>
                <ul>
                    <li>Ensure the student's screen brightness is turned up.</li>
                    <li>The QR code must be scanned within 15 minutes of the booking start time.</li>
                    <li>If the scanner fails, use the manual entry option below the camera view.</li>
                </ul>
            </div>
        </div>
    );
};

export default AdminCheckInPage;
