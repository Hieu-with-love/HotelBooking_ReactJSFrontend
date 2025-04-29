import React, { useState, useEffect, useRef, use } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import './bookingDetails.css';
import Navbar from '../../components/navbar/Navbar';
import Footer from '../../components/footer/Footer';
import AuthApi from '../../api/authApi';
import { set } from 'date-fns';
import { ca } from 'date-fns/locale';
import { useAuth } from '../../context/AuthContext';

const BookingConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const qrRef = useRef();
  const { bookingConfimation, hotel, selectedRooms } = location.state
    || { bookingConfimation: {}, hotel: {}, selectedRooms: [] };

  useEffect(() => {
    console.log('Booking Confirmation:', bookingConfimation);
  }, []);

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const downloadQRCode = () => {
    const svg = qrRef.current.querySelector('svg');
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');

      // Download the PNG
      const downloadLink = document.createElement('a');
      downloadLink.download = `booking-qr-${bookingConfimation.bookingId}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  const goToHomePage = () => {
    navigate('/');
  };

  return (
    <div>
      <Navbar />
      <div className="booking-confirmation-container">
        <div className="booking-confirmation-card">
          <div className="booking-header">
            <h1>Thank You for Your Booking!</h1>
            <p>Your reservation has been confirmed and we're looking forward to your stay.</p>
          </div>

          <div className="booking-details">
            <h2>Booking Details</h2>
            <div className="booking-info-grid">
              <div className="booking-info-item">
                <span className="info-label">Booking Reference:</span>
                <span className="info-value">{bookingConfimation.bookingId}</span>
              </div>
              <div className="booking-info-item">
                <span className="info-label">Hotel:</span>
                <span className="info-value">{hotel.name}</span>
              </div>
              {
                selectedRooms.length > 0 &&
                selectedRooms.map((room, index) => (
                  <div className="booking-info-item">
                    <span className="info-label">Room Type:</span>
                    <span className="info-value">{room.type}</span>
                  </div>
                ))
              }
              <div className="booking-info-item">
                <span className="info-label">Check-in:</span>
                <span className="info-value">{formatDate(bookingConfimation.checkIn)}</span>
              </div>
              <div className="booking-info-item">
                <span className="info-label">Check-out:</span>
                <span className="info-value">{formatDate(bookingConfimation.checkOut)}</span>
              </div>
              <div className="booking-info-item">
                <span className="info-label">Guest Name:</span>
                <span className="info-value">{bookingConfimation.user.firstName} {bookingConfimation.user.lastName}</span>
              </div>
              <div className="booking-info-item">
                <span className="info-label">Email:</span>
                <span className="info-value">{bookingConfimation.user.email}</span>
              </div>
              <div className="booking-info-item">
                <span className="info-label">Total Amount:</span>
                <span className="info-value">{bookingConfimation.totalAmount}</span>
              </div>
              <div className="booking-info-item">
                <span className="info-label">Payment Status:</span>
                <span className="info-value">{bookingConfimation.paymentStatus}</span>
              </div>
            </div>
          </div>

          <div className="qr-code-section">
            <h2>Fast Check-in QR Code</h2>
            <p>Present this QR code upon arrival for a faster check-in experience.</p>
            <div className="qr-code-container" ref={qrRef}>
              <QRCodeSVG
                value={JSON.stringify({
                  bookingId: bookingConfimation.bookingId,
                  firstName: bookingConfimation.user.firstName,
                  lastName: bookingConfimation.user.lastName,
                  checkIn: bookingConfimation.checkIn,
                  checkOut: bookingConfimation.checkOut
                })}
                size={200}
                bgColor={"#ffffff"}
                fgColor={"#000000"}
                level={"H"}
                includeMargin={true}
              />
            </div>
          </div>

          <div className="booking-actions">
            <button
              className="download-qr-button"
              onClick={downloadQRCode}
            >
              Download QR Code
            </button>
            <button
              className="go-home-button"
              onClick={goToHomePage}
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BookingConfirmation;