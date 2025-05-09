import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Card, Row, Col, Button, Alert, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays, faCheckCircle, faMapMarkerAlt, faMoneyBill, faClock, faQrcode, faDownload } from '@fortawesome/free-solid-svg-icons';
import Navbar from '../../components/navbar/Navbar';
import Footer from '../../components/footer/Footer';
import './bookingDetails.css';

// Create a separate QRCode component using plain HTML/JS
const QRCode = ({ value, size = 256, bgColor = "#ffffff", fgColor = "#000000" }) => {
    const qrCodeRef = useRef(null);
    
    useEffect(() => {
        if (qrCodeRef.current && value) {
            // First check if QRCode is already loaded
            if (window.QRCode) {
                qrCodeRef.current.innerHTML = '';
                new window.QRCode(qrCodeRef.current, {
                    text: value,
                    width: size,
                    height: size,
                    colorDark: fgColor,
                    colorLight: bgColor,
                    correctLevel: 2  // Using numeric value (2 = QRCode.CorrectLevel.H)
                });
                return;
            }
            
            // If not loaded, add the script
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/qrcode@1.4.4/build/qrcode.min.js';
            script.onload = () => {
                if (window.QRCode && qrCodeRef.current) {
                    qrCodeRef.current.innerHTML = '';
                    new window.QRCode(qrCodeRef.current, {
                        text: value,
                        width: size,
                        height: size,
                        colorDark: fgColor,
                        colorLight: bgColor,
                        correctLevel: 2  // Using numeric value (2 = QRCode.CorrectLevel.H)
                    });
                }
            };
            document.body.appendChild(script);
            return () => {
                if (document.body.contains(script)) {
                    document.body.removeChild(script);
                }
            };
        }
    }, [value, size, bgColor, fgColor]);

    return <div ref={qrCodeRef}></div>;
};

const BookingConfirmation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [bookingConfirmation, setBookingConfirmation] = useState(null);
    const [error, setError] = useState(null);
    const [showQRModal, setShowQRModal] = useState(false);
    const qrCodeRef = useRef(null);

    useEffect(() => {
        document.title = "Xác nhận đặt phòng thành công";
        
        // Get booking confirmation data from navigation state
        if (location.state && location.state.bookingConfirmation) {
            setBookingConfirmation(location.state.bookingConfirmation);
        } else {
            setError("Không tìm thấy thông tin đặt phòng. Vui lòng thử lại.");
        }
    }, [location.state]);

    // Format date for display
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    };

    // Calculate number of nights
    const calculateNights = () => {
        if (!bookingConfirmation) return 0;
        
        const checkIn = new Date(bookingConfirmation.checkInDate);
        const checkOut = new Date(bookingConfirmation.checkOutDate);
        const diffTime = Math.abs(checkOut - checkIn);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays || 1;
    };

    // Format time for display
    const formatTime = (date) => {
        return new Date(date).toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Get current date and time
    const getCurrentDateTime = () => {
        return new Date().toLocaleString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <>
            <Navbar />
            <div className="booking-confirmation-page">
                <Container className="py-5">
                    {/* Breadcrumb */}
                    <div className="breadcrumb-top py-3 mb-4">
                        <span onClick={() => navigate('/')} className="breadcrumb-item cursor-pointer">Trang chủ</span>
                        <span className="mx-2">/</span>
                        <span className="breadcrumb-item active">Xác nhận đặt phòng thành công</span>
                    </div>

                    {error ? (
                        <Alert variant="danger" className="mb-4">
                            {error}
                        </Alert>
                    ) : bookingConfirmation ? (
                        <>
                            {/* Success Message */}
                            <div className="text-center confirmation-header mb-4">
                                <FontAwesomeIcon icon={faCheckCircle} className="text-success mb-3" size="3x" />
                                <h2>Đặt phòng thành công!</h2>
                                <p className="lead">Cảm ơn bạn đã đặt phòng tại {bookingConfirmation.hotel?.name}</p>
                                <p className="text-muted">
                                    <FontAwesomeIcon icon={faClock} className="me-2" />
                                    Xác nhận vào: {getCurrentDateTime()}
                                </p>
                            </div>

                            <Row>
                                <Col lg={8}>
                                    {/* Booking Details */}
                                    <Card className="mb-4 shadow-sm">
                                        <Card.Header className="bg-white">
                                            <h4 className="mb-0">Thông tin đặt phòng</h4>
                                        </Card.Header>
                                        <Card.Body>
                                            {/* Booking ID */}
                                            <div className="booking-id-section py-2 px-3 bg-light rounded mb-4">
                                                <Row>
                                                    <Col md={6}>
                                                        <p className="mb-0"><strong>Mã đặt phòng:</strong> #{bookingConfirmation.bookingId}</p>
                                                    </Col>
                                                    <Col md={6} className="text-md-end">
                                                        <p className="mb-0">
                                                            <strong>Trạng thái:</strong> 
                                                            <span className="badge bg-success ms-2">Đã xác nhận</span>
                                                        </p>
                                                    </Col>
                                                </Row>
                                            </div>

                                            {/* Hotel Information */}
                                            <div className="hotel-info mb-4">
                                                <h5>{bookingConfirmation.hotel?.name}</h5>
                                                <p className="text-muted mb-2">
                                                    <FontAwesomeIcon icon={faMapMarkerAlt} className="me-2 text-primary" />
                                                    {bookingConfirmation.hotel?.address?.street}, {bookingConfirmation.hotel?.address?.district}, {bookingConfirmation.hotel?.address?.city}
                                                </p>
                                            </div>

                                            {/* Date Information */}
                                            <div className="booking-dates mb-4">
                                                <h5>Thời gian lưu trú</h5>
                                                <Row>
                                                    <Col md={4} className="mb-3">
                                                        <div className="date-box p-3 bg-light rounded text-center">
                                                            <div className="mb-2">
                                                                <FontAwesomeIcon icon={faCalendarDays} className="text-primary" />
                                                                <span className="ms-2">Nhận phòng</span>
                                                            </div>
                                                            <h5 className="mb-0">{formatDate(bookingConfirmation.checkInDate)}</h5>
                                                            <small className="text-muted">Sau 14:00</small>
                                                        </div>
                                                    </Col>
                                                    <Col md={4} className="mb-3">
                                                        <div className="date-box p-3 bg-light rounded text-center">
                                                            <div className="mb-2">
                                                                <FontAwesomeIcon icon={faCalendarDays} className="text-primary" />
                                                                <span className="ms-2">Trả phòng</span>
                                                            </div>
                                                            <h5 className="mb-0">{formatDate(bookingConfirmation.checkOutDate)}</h5>
                                                            <small className="text-muted">Trước 12:00</small>
                                                        </div>
                                                    </Col>
                                                    <Col md={4} className="mb-3">
                                                        <div className="date-box p-3 bg-light rounded text-center">
                                                            <div className="mb-2">
                                                                <span>Thời gian lưu trú</span>
                                                            </div>
                                                            <h5 className="mb-0">{calculateNights()} đêm</h5>
                                                            <small className="text-muted">{bookingConfirmation.selectedRooms?.length || 0} phòng</small>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </div>

                                            {/* Selected Rooms */}
                                            <div className="selected-rooms mb-4">
                                                <h5>Phòng đã đặt</h5>
                                                {bookingConfirmation.selectedRooms && bookingConfirmation.selectedRooms.map((room, index) => (
                                                    <Card className="mb-3 room-card-item" key={index}>
                                                        <Card.Body>
                                                            <Row>
                                                                <Col>
                                                                    <h6>{room.name}</h6>
                                                                    <p className="text-muted mb-1">{room.description}</p>
                                                                    <div className="d-flex align-items-center justify-content-between">
                                                                        <div className="room-specs">
                                                                            <span className="me-3">
                                                                                {room.numberOfAdults} người lớn
                                                                            </span>
                                                                            {room.numberOfChildren > 0 && (
                                                                                <span className="me-3">
                                                                                    {room.numberOfChildren} trẻ em
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                        <div className="room-price text-primary">
                                                                            {room.price?.toLocaleString('vi-VN')}đ
                                                                        </div>
                                                                    </div>
                                                                </Col>
                                                            </Row>
                                                        </Card.Body>
                                                    </Card>
                                                ))}
                                            </div>

                                            {/* Guest Information */}
                                            {bookingConfirmation.user && (
                                                <div className="guest-info mb-4">
                                                    <h5>Thông tin khách hàng</h5>
                                                    <Card className="bg-light">
                                                        <Card.Body>
                                                            <p className="mb-1"><strong>Họ tên:</strong> {bookingConfirmation.user.fullName || bookingConfirmation.user.name}</p>
                                                            <p className="mb-1"><strong>Email:</strong> {bookingConfirmation.user.email}</p>
                                                            <p className="mb-0"><strong>Số điện thoại:</strong> {bookingConfirmation.user.phone || "Chưa cung cấp"}</p>
                                                        </Card.Body>
                                                    </Card>
                                                </div>
                                            )}

                                            {/* Payment Information */}
                                            <div className="payment-info">
                                                <h5>Thông tin thanh toán</h5>
                                                <Card className="bg-light">
                                                    <Card.Body>
                                                        <div className="d-flex align-items-center mb-3">
                                                            <div className="payment-logo me-3">
                                                                <FontAwesomeIcon icon={faMoneyBill} size="lg" />
                                                            </div>
                                                            <div className="payment-content">
                                                                <h6 className="mb-1">Thanh toán tại quầy</h6>
                                                                <p className="text-muted mb-0">Thanh toán khi bạn đến khách sạn</p>
                                                            </div>
                                                        </div>
                                                        <hr />
                                                        <div className="d-flex justify-content-between align-items-center">
                                                            <h6 className="mb-0">Tổng thanh toán:</h6>
                                                            <h5 className="text-primary mb-0">{bookingConfirmation.totalAmount?.toLocaleString('vi-VN')}đ</h5>
                                                        </div>
                                                    </Card.Body>
                                                </Card>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>

                                <Col lg={4}>
                                    {/* Important Notes */}
                                    <Card className="shadow-sm mb-4">
                                        <Card.Header className="bg-white">
                                            <h5 className="mb-0">Lưu ý quan trọng</h5>
                                        </Card.Header>
                                        <Card.Body>
                                            <ul className="important-notes mb-0">
                                                <li>Giờ nhận phòng: <strong>từ 14:00</strong></li>
                                                <li>Giờ trả phòng: <strong>trước 12:00</strong></li>
                                                <li>Vui lòng mang theo giấy tờ tùy thân khi nhận phòng</li>
                                                <li>Đặt phòng của bạn chỉ được giữ đến 18:00 trong ngày nhận phòng</li>
                                                <li>Nếu quý khách cần hỗ trợ, vui lòng liên hệ với khách sạn theo số điện thoại được cung cấp</li>
                                            </ul>
                                        </Card.Body>
                                    </Card>

                                    {/* Actions */}
                                    <Card className="shadow-sm mb-4">
                                        <Card.Body>
                                            <Button variant="outline-primary" className="w-100 mb-3" onClick={() => window.print()}>
                                                In phiếu xác nhận
                                            </Button>
                                            <Button variant="primary" className="w-100" onClick={() => navigate('/')}>
                                                Quay về trang chủ
                                            </Button>
                                            <Button variant="outline-secondary" className="w-100 mt-3" onClick={() => setShowQRModal(true)}>
                                                <FontAwesomeIcon icon={faQrcode} className="me-2" />
                                                Hiển thị mã QR
                                            </Button>
                                        </Card.Body>
                                    </Card>

                                    {/* Contact Info */}
                                    <Card className="shadow-sm">
                                        <Card.Header className="bg-white">
                                            <h5 className="mb-0">Thông tin liên hệ</h5>
                                        </Card.Header>
                                        <Card.Body>
                                            <p className="mb-2"><strong>Khách sạn:</strong> {bookingConfirmation.hotel?.name}</p>
                                            <p className="mb-2">
                                                <strong>Địa chỉ:</strong> {bookingConfirmation.hotel?.address?.street}, {bookingConfirmation.hotel?.address?.district}, {bookingConfirmation.hotel?.address?.city}
                                            </p>
                                            <p className="mb-0"><strong>Số điện thoại:</strong> {bookingConfirmation.hotel?.phone || "Liên hệ với chúng tôi để biết thêm chi tiết"}</p>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        </>
                    ) : (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <p className="mt-3">Đang tải thông tin đặt phòng...</p>
                        </div>
                    )}
                </Container>
            </div>
            <Footer />

            {/* QR Code Modal */}
            <Modal show={showQRModal} onHide={() => setShowQRModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Mã QR của bạn</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    {bookingConfirmation && (
                        <QRCode value={bookingConfirmation.bookingId} size={256} />
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowQRModal(false)}>
                        Đóng
                    </Button>                    <Button variant="primary" onClick={() => {
                        // Get the QR code element from the modal
                        const qrCodeContainer = document.querySelector('.modal-body > div');
                        if (qrCodeContainer) {
                            const canvas = qrCodeContainer.querySelector('canvas');
                            if (canvas) {
                                const link = document.createElement('a');
                                link.href = canvas.toDataURL('image/png');
                                link.download = `QRCode_${bookingConfirmation.bookingId}.png`;
                                link.click();
                            }
                        }
                    }}>
                        <FontAwesomeIcon icon={faDownload} className="me-2" />
                        Tải xuống
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default BookingConfirmation