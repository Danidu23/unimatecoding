import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { FiCamera, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import api from '../../api/sportsApi';
import toast from 'react-hot-toast';

const SportsQRScanner = ({ onResult }) => {
    const [scanResult, setScanResult] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [manualId, setManualId] = useState('');
    const [manualQR, setManualQR] = useState('');

    useEffect(() => {
        const scanner = new Html5QrcodeScanner('reader', {
            qrbox: {
                width: 250,
                height: 250,
            },
            fps: 5,
        });

        scanner.render(onScanSuccess, onScanError);

        async function onScanSuccess(result) {
            scanner.clear();
            try {
                const data = JSON.parse(result);
                if (data.bookingId && data.qrCode) {
                    processCheckIn(data.bookingId, data.qrCode);
                } else {
                    toast.error('Invalid QR code format');
                }
            } catch (err) {
                toast.error('Could not read QR code');
            }
        }

        function onScanError(err) {
            // Quietly ignore scan errors (they happen constantly while searching)
        }

        return () => {
            scanner.clear();
        };
    }, []);

    const processCheckIn = async (bookingId, qrCode) => {
        setLoading(true);
        try {
            const res = await api.put(`/bookings/${bookingId}/check-in`, { qrCode });
            setScanResult(res.data);
            toast.success(res.data.message);
            if (onResult) onResult(res.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Check-in failed');
            toast.error(err.response?.data?.message || 'Check-in failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="qr-scanner-container">
            {!scanResult && !error && (
                <>
                    <div id="reader" style={{ width: '100%', maxWidth: '500px', margin: '0 auto' }}></div>
                    <div className="divider" style={{ margin: '30px 0' }}>OR</div>
                    <div className="manual-entry" style={{ maxWidth: '400px', margin: '0 auto' }}>
                        <h4>Manual Check-in</h4>
                        <div className="form-group">
                            <label className="form-label">Booking ID</label>
                            <input 
                                className="form-input" 
                                placeholder="e.g. 64a..." 
                                value={manualId}
                                onChange={e => setManualId(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">QR Token</label>
                            <input 
                                className="form-input" 
                                placeholder="QR Token" 
                                value={manualQR}
                                onChange={e => setManualQR(e.target.value)}
                            />
                        </div>
                        <button 
                            className="btn btn-secondary btn-full" 
                            onClick={() => processCheckIn(manualId, manualQR)}
                            disabled={!manualId || !manualQR || loading}
                        >
                            Verify Manually
                        </button>
                    </div>
                </>
            )}

            {loading && (
                <div className="loading-container" style={{ padding: '20px' }}>
                    <div className="spinner"></div>
                    <p>Processing check-in...</p>
                </div>
            )}

            {scanResult && (
                <div className="alert alert-success" style={{ textAlign: 'center', padding: '30px' }}>
                    <FiCheckCircle style={{ fontSize: '3rem', marginBottom: '16px' }} />
                    <h3>{scanResult.message}</h3>
                    <p>Booking ID: {scanResult.booking._id}</p>
                    <button className="btn btn-primary" style={{ marginTop: '20px' }} onClick={() => window.location.reload()}>
                        Scan Next
                    </button>
                </div>
            )}

            {error && (
                <div className="alert alert-error" style={{ textAlign: 'center', padding: '30px' }}>
                    <FiAlertCircle style={{ fontSize: '3rem', marginBottom: '16px' }} />
                    <h3>Error</h3>
                    <p>{error}</p>
                    <button className="btn btn-danger" style={{ marginTop: '20px' }} onClick={() => window.location.reload()}>
                        Try Again
                    </button>
                </div>
            )}
        </div>
    );
};

export default SportsQRScanner;
