import { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import api from '../api';
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';
import './AdminScannerPage.css';

const AdminScannerPage = () => {
  const [scanResult, setScanResult] = useState(null);
  const [scanError, setScanError] = useState(null);
  const [manualToken, setManualToken] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: { width: 250, height: 250 },
      fps: 10,
    });

    scanner.render(
      (result) => {
        scanner.clear();
        handleTokenSubmit(result);
      },
      (error) => {
        // silently handled
      }
    );

    return () => {
      scanner.clear().catch(error => console.error('Failed to clear scanner', error));
    };
  }, []);

  const handleTokenSubmit = async (token) => {
    if (!token) return;
    setLoading(true);
    setScanResult(null);
    setScanError(null);
    try {
      const res = await api.post('/bookings/scan', { token });
      setScanResult(res.data);
    } catch (err) {
      setScanError(err.response?.data?.message || 'Check-in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    handleTokenSubmit(manualToken);
  };

  const completeBooking = async (id) => {
    try {
      await api.put(`/bookings/${id}/complete`);
      setScanResult(prev => ({
        ...prev,
        booking: { ...prev.booking, status: 'completed' },
        message: 'Booking marked as completed'
      }));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to complete booking');
    }
  };

  return (
    <div className="admin-scanner-page">
      <div className="page-header">
        <h1>QR Code Check-in Scanner</h1>
        <p>Scan student QR codes to verify attendance and manage check-ins</p>
      </div>

      <div className="scanner-container grid-2">
        <div className="card">
          <div className="card-body">
            <h3>Scan QR Code</h3>
            <div id="reader" style={{ width: '100%', marginTop: '20px' }}></div>
            
            <div className="divider"></div>
            
            <form onSubmit={handleManualSubmit} className="manual-scan-form">
              <label className="form-label" style={{ marginBottom: '8px', display: 'block' }}>Or enter token manually:</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input 
                  type="text" 
                  className="form-input" 
                  style={{ flex: 1 }}
                  value={manualToken}
                  onChange={(e) => setManualToken(e.target.value)}
                  placeholder="Paste QR token"
                />
                <button type="submit" className="btn btn-primary" disabled={!manualToken || loading}>
                  {loading ? 'Validating...' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <h3>Scan Result</h3>
            
            {loading && <div className="spinner" style={{ margin: '40px auto' }}></div>}
            
            {!loading && !scanResult && !scanError && (
              <div className="empty-state">
                <div className="empty-state-icon">📱</div>
                <p>Waiting for scan...</p>
              </div>
            )}

            {scanError && (
              <div className="scan-alert scan-error">
                <FiXCircle size={48} color="var(--accent-red)" style={{ marginBottom: 16 }} />
                <h4>Check-in Failed</h4>
                <p style={{ color: 'var(--accent-red)', marginTop: 8 }}>{scanError}</p>
                <button className="btn btn-ghost" onClick={() => {
                  setScanError(null);
                  window.location.reload(); 
                }} style={{ marginTop: 24 }}>Reset Scanner</button>
              </div>
            )}

            {scanResult && (
              <div className="scan-alert scan-success">
                <FiCheckCircle size={48} color="var(--accent-green)" style={{ marginBottom: 16 }} />
                <h4 style={{ color: 'var(--accent-green)' }}>{scanResult.message}</h4>
                
                <div className="booking-details-box" style={{ textAlign: 'left', marginTop: 24, padding: 16, background: 'var(--bg-input)', borderRadius: 'var(--radius-md)' }}>
                  <p style={{ marginBottom: 8 }}><strong>Student:</strong> {scanResult.booking?.userId?.name}</p>
                  <p style={{ marginBottom: 8 }}><strong>Facility:</strong> {scanResult.booking?.facilityServiceId?.name}</p>
                  <p style={{ marginBottom: 8 }}><strong>Time:</strong> {scanResult.booking?.startTime} - {scanResult.booking?.endTime}</p>
                  <p><strong>Status:</strong> <span className={`badge badge-${scanResult.booking?.status}`}>{scanResult.booking?.status}</span></p>
                </div>

                <div className="scanner-actions" style={{ marginTop: '24px', display: 'flex', gap: '12px', justifyContent: 'center' }}>
                   {scanResult.booking?.status === 'checked-in' && (
                     <button className="btn btn-secondary" onClick={() => completeBooking(scanResult.booking._id)}>
                       Mark as Completed
                     </button>
                   )}
                   <button className="btn btn-primary" onClick={() => window.location.reload()}>
                     Scan Another
                   </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminScannerPage;
