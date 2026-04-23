import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { FiX, FiDownload } from 'react-icons/fi';

const SportsQRCodeModal = ({ isOpen, onClose, booking }) => {
    if (!isOpen || !booking) return null;

    // The data encoded in the QR code
    const qrData = JSON.stringify({
        bookingId: booking._id,
        qrCode: booking.qrCode,
        userId: booking.userId
    });

    return (
        <div className="modal-overlay">
            <div className="modal" style={{ maxWidth: '400px' }}>
                <div className="modal-header">
                    <h3>Booking QR Code</h3>
                    <button className="btn-ghost btn-sm" onClick={onClose}>
                        <FiX />
                    </button>
                </div>
                <div className="modal-body" style={{ textAlign: 'center' }}>
                    <div className="qr-container" style={{ 
                        background: 'white', 
                        padding: '20px', 
                        borderRadius: '12px',
                        display: 'inline-block',
                        marginBottom: '20px'
                    }}>
                        <QRCodeSVG 
                            value={qrData}
                            size={256}
                            level="H"
                            includeMargin={true}
                        />
                    </div>
                    <div className="booking-summary" style={{ textAlign: 'left', marginBottom: '20px' }}>
                        <p><strong>{booking.facilityServiceId?.name}</strong></p>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                            Date: {booking.date}
                        </p>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                            Time: {booking.startTime} - {booking.endTime}
                        </p>
                    </div>
                    <div className="alert alert-info" style={{ fontSize: '0.8rem' }}>
                        Scan this at the entrance within 15 mins of your start time.
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="btn btn-primary btn-full" onClick={onClose}>
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SportsQRCodeModal;
