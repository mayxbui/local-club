import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { useUser } from '../contexts/UserContext';
import './Scan.css'; // Custom styles

const Scan = () => {
  const { userDetails, loading } = useUser();

  if (loading) {
    return <p className="loading-text">Loading...</p>;
  }

  if (!userDetails) {
    return (
      <p className="loading-text">Please log in to view your QR code.</p>
    );
  }

  const qrValue = userDetails.uid;

  return (
    <div className="scan-container">
      <div className="qr-card">
        <h2>Hi, {userDetails.name}</h2>
        <p className="qr-sub">Here’s your QR code:</p>
        <QRCodeCanvas
          value={qrValue}
          size={220}
          bgColor="#ffffff"
          fgColor="#e6417d"
          level="H"
        />
        <p className="qr-note">Show this at checkout to earn rewards</p>
      </div>
    </div>
  );
};

export default Scan;
