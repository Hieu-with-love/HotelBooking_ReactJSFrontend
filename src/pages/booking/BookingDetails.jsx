import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays, faMapMarkerAlt, faUser, faCheck, faMoneyBill } from '@fortawesome/free-solid-svg-icons';
import Navbar from '../../components/navbar/Navbar';
import Footer from '../../components/footer/Footer';
import { API_URL } from '../../api/apiConfig';
import axios from 'axios';
import './bookingDetails.css';
import { createBooking } from '../../api/bookingApi';
import default_room_img from '../../assets/images/default_room.jpg'
import default_hotel_img from '../../assets/images/default_hotel_img.jpeg'  
import { de } from 'date-fns/locale';

const BookingDetails = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const { selectedRooms, hotel } = location.state || { selectedRooms: [], hotel: {} };
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(''); // 'counter' or 'vnpay'
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Check if we have valid check-in/check-out dates from previous page
    const [checkInDate, setCheckInDate] = useState(
        location.state?.checkInDate || new Date().toISOString().split('T')[0]
    );
    const [checkOutDate, setCheckOutDate] = useState(
        location.state?.checkOutDate || new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    );

    // Calculate total price
    const totalPrice = selectedRooms.reduce((total, room) => total + room.price, 0);

    // Get image URL for a room
    const getImageUrl = (room) => {
        if (!room.images || room.images.length === 0) {
            if (!hotel.images || hotel.images.length === 0) {
                return default_hotel_img; // Default image path
            } else {
                return default_room_img;
            }
        }else {
            return room.images[0].url;
        }
        
    };

    // Handle book with payment method
    const handleBookWithPayment = async () => {
        console.log("Selected Payment Method:", selectedPaymentMethod);
        if (!selectedPaymentMethod) {
            setError("Please select a payment method");
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem('jwt');
            if (!token) {
                navigate('/login', { state: { redirectTo: location.pathname, state: location.state } });
                return;
            }

            // Prepare booking data
            const bookingData = {
                hotelId: hotel.id,
                checkInDate: checkInDate,
                checkOutDate: checkOutDate,
                price: totalPrice,
                paymentMethod: {
                    id: selectedPaymentMethod === 'counter' ? 1 : 2, // Assuming 1 is for counter and 2 is for VNPay
                    type: selectedPaymentMethod === 'counter' ? 'CASH' : 'ONLINE',
                },
                status: selectedPaymentMethod === 'counter' ? 'PENDING' : 'PROCESSING',
                rooms:
                    selectedRooms.map((room) => ({
                        id: room.id,
                        price: room.price,
                        name: room.name,
                        description: room.description,
                        numberOfAdults: room.numberOfAdults,
                        numberOfChildren: room.numberOfChildren,
                        numberOfBeds: room.numberOfBeds,
                        services: room.services
                    }))
            };

            const bookingJsonData = JSON.stringify(bookingData);
            console.log("Booking JSON Data:", bookingJsonData);

            // Send booking request to the backend
            const response = await createBooking(bookingJsonData);

            console.log("Booking Response:", response);

            // Handle VNPay redirect if needed
            if (selectedPaymentMethod === 'vnpay' && response.data.paymentUrl) {
                // Store booking information in session storage before redirecting to VNPay
                sessionStorage.setItem('pendingBookingData', JSON.stringify({
                    bookingId: response.data.id,
                    paymentMethod: selectedPaymentMethod,
                    totalAmount: response.data.totalPrice,
                    hotel: hotel,
                    selectedRooms: response.data.selectedRooms,
                    checkInDate: response.data.checkInDate,
                    checkOutDate: response.data.checkOutDate
                }));
                // Redirect to VNPay payment page
                window.location.href = response.data.paymentUrl;
                return;
            }

            const bookingConfimation = {
                bookingId: response.bookingId,
                paymentMethod: selectedPaymentMethod,
                totalAmount: response.totalPrice,
                hotel: hotel,
                selectedRooms: response.selectedRooms,
                checkInDate: response.checkInDate,
                checkOutDate: response.checkOutDate,
                user: response.user
            }

            // Navigate to booking confirmation page
            navigate('/booking-confirmation', {
                state: {bookingConfimation, hotel: hotel, selectedRooms: selectedRooms}
            });

        } catch (err) {
            console.error("Error creating booking:", err);
            setError(err.response?.data?.message || "Failed to create booking. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Calculate nights of stay
    const calculateNights = () => {
        const start = new Date(checkInDate);
        const end = new Date(checkOutDate);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays || 1; // Ensure at least 1 night
    };

    return (
        <>
            <Navbar />
            <div className="booking-details-page">
                <Container className="py-5">
                    {/* Breadcrumb */}
                    <div className="breadcrumb-top py-3 mb-4">
                        <span onClick={() => navigate('/')} className="breadcrumb-item cursor-pointer">Trang chủ</span>
                        <span className="mx-2">/</span>
                        <span onClick={() => navigate('/hotels')} className="breadcrumb-item cursor-pointer">Khách sạn</span>
                        <span className="mx-2">/</span>
                        <span onClick={() => navigate(-1)} className="breadcrumb-item cursor-pointer">{hotel.name}</span>
                        <span className="mx-2">/</span>
                        <span className="breadcrumb-item active">Xác nhận đặt phòng</span>
                    </div>

                    {/* Error message if any */}
                    {error && (
                        <Alert variant="danger" className="mb-4">
                            {error}
                        </Alert>
                    )}

                    <Row>
                        {/* Booking Details Section */}
                        <Col lg={8}>
                            <Card className="mb-4 shadow-sm">
                                <Card.Header className="bg-white">
                                    <h4 className="mb-0">Thông tin đặt phòng</h4>
                                </Card.Header>
                                <Card.Body>
                                    {/* Hotel Information */}
                                    <div className="hotel-info mb-4">
                                        <h5>{hotel.name}</h5>
                                        <p className="text-muted mb-2">
                                            <FontAwesomeIcon icon={faMapMarkerAlt} className="me-2 text-primary" />
                                            {`${hotel.address?.number || ''} ${hotel.address?.street || ''}, ${hotel.address?.district || ''}, ${hotel.address?.city || ''}`}
                                        </p>
                                    </div>

                                    {/* Date Selection */}
                                    <div className="booking-dates mb-4">
                                        <h5>Thời gian lưu trú</h5>
                                        <Row>
                                            <Col md={6} className="mb-3">
                                                <Form.Group>
                                                    <Form.Label>
                                                        <FontAwesomeIcon icon={faCalendarDays} className="me-2 text-primary" /> 
                                                        Ngày nhận phòng
                                                    </Form.Label>
                                                    <Form.Control
                                                        type="date"
                                                        value={checkInDate}
                                                        onChange={(e) => setCheckInDate(e.target.value)}
                                                        min={new Date().toISOString().split('T')[0]}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6} className="mb-3">
                                                <Form.Group>
                                                    <Form.Label>
                                                        <FontAwesomeIcon icon={faCalendarDays} className="me-2 text-primary" /> 
                                                        Ngày trả phòng
                                                    </Form.Label>
                                                    <Form.Control
                                                        type="date"
                                                        value={checkOutDate}
                                                        onChange={(e) => setCheckOutDate(e.target.value)}
                                                        min={checkInDate}
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                    </div>

                                    {/* Selected Rooms */}
                                    <div className="selected-rooms mb-4">
                                        <h5>Phòng đã chọn</h5>
                                        {selectedRooms.length === 0 ? (
                                            <Alert variant="warning">
                                                Không có phòng nào được chọn. Vui lòng chọn ít nhất một phòng để tiếp tục.
                                            </Alert>
                                        ) : (
                                            selectedRooms.map((room, index) => (
                                                <Card className="mb-3 room-card-item" key={index}>
                                                    <Card.Body>
                                                        <Row>
                                                            <Col md={3}>
                                                                <img
                                                                    src={getImageUrl(room)}
                                                                    alt={room.name}
                                                                    className="img-fluid rounded room-thumbnail"
                                                                />
                                                            </Col>
                                                            <Col md={9}>
                                                                <div className="d-flex justify-content-between">
                                                                    <h5>{room.name}</h5>
                                                                    <h5 className="text-primary">{room.price.toLocaleString('vi-VN')}đ</h5>
                                                                </div>
                                                                <p className="text-muted mb-2">{room.description}</p>
                                                                <div className="room-specs">
                                                                    <span className="me-3">
                                                                        <FontAwesomeIcon icon={faUser} className="me-1" />
                                                                        {room.numberOfAdults} người lớn
                                                                    </span>
                                                                    {room.numberOfChildren > 0 && (
                                                                        <span className="me-3">
                                                                            <FontAwesomeIcon icon={faUser} className="me-1" />
                                                                            {room.numberOfChildren} trẻ em
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                {room.services && room.services.length > 0 && (
                                                                    <div className="mt-2">
                                                                        <div className="room-amenities">
                                                                            {room.services.slice(0, 3).map((service, i) => (
                                                                                <span key={i} className="badge bg-light text-dark me-1 mb-1">
                                                                                    <FontAwesomeIcon icon={faCheck} className="text-success me-1" />
                                                                                    {service.name}
                                                                                </span>
                                                                            ))}
                                                                            {room.services.length > 3 && (
                                                                                <span className="badge bg-light text-dark">
                                                                                    +{room.services.length - 3} dịch vụ khác
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </Col>
                                                        </Row>
                                                    </Card.Body>
                                                </Card>
                                            ))
                                        )}
                                    </div>

                                    {/* Payment Methods */}
                                    <div className="payment-methods mb-4">
                                        <h5>Phương thức thanh toán</h5>
                                        <div className="payment-options mt-3">
                                            <div 
                                                className={`payment-option mb-3 ${selectedPaymentMethod === 'counter' ? 'selected' : ''}`}
                                                onClick={() => setSelectedPaymentMethod('counter')}
                                            >
                                                <div className="payment-radio">
                                                    <input
                                                        type="radio"
                                                        name="payment-method"
                                                        id="counter-payment"
                                                        checked={selectedPaymentMethod === 'counter'}
                                                        onChange={() => setSelectedPaymentMethod('counter')}
                                                    />
                                                    <label htmlFor="counter-payment"></label>
                                                </div>
                                                <div className="payment-content">
                                                    <h6 className="mb-1">Thanh toán tại quầy</h6>
                                                    <p className="text-muted mb-0">Thanh toán khi bạn đến khách sạn</p>
                                                </div>
                                                <div className="payment-logo">
                                                    <FontAwesomeIcon icon={faMoneyBill} size="lg" />
                                                </div>
                                            </div>

                                            <div 
                                                className={`payment-option ${selectedPaymentMethod === 'vnpay' ? 'selected' : ''}`}
                                                onClick={() => setSelectedPaymentMethod('vnpay')}
                                            >
                                                <div className="payment-radio">
                                                    <input
                                                        type="radio"
                                                        name="payment-method"
                                                        id="vnpay-payment"
                                                        checked={selectedPaymentMethod === 'vnpay'}
                                                        onChange={() => setSelectedPaymentMethod('vnpay')}
                                                    />
                                                    <label htmlFor="vnpay-payment"></label>
                                                </div>
                                                <div className="payment-content">
                                                    <h6 className="mb-1">VNPay</h6>
                                                    <p className="text-muted mb-0">Thanh toán trực tuyến qua VNPay</p>
                                                </div>
                                                <div className="payment-logo">
                                                    <img src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Icon-VNPAY-QR.png" alt="VNPay" style={{ height: '30px' }} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>

                        {/* Booking Summary Section */}
                        <Col lg={4}>
                            <Card className="booking-summary shadow-sm">
                                <Card.Header className="bg-white">
                                    <h4 className="mb-0">Tóm tắt đơn đặt phòng</h4>
                                </Card.Header>
                                <Card.Body>
                                    <ul className="booking-summary-list">
                                        <li className="d-flex justify-content-between align-items-center">
                                            <span>Ngày nhận phòng</span>
                                            <span>{new Date(checkInDate).toLocaleDateString()}</span>
                                        </li>
                                        <li className="d-flex justify-content-between align-items-center">
                                            <span>Ngày trả phòng</span>
                                            <span>{new Date(checkOutDate).toLocaleDateString()}</span>
                                        </li>
                                        <li className="d-flex justify-content-between align-items-center">
                                            <span>Số đêm</span>
                                            <span>{calculateNights()} đêm</span>
                                        </li>
                                        <li className="d-flex justify-content-between align-items-center">
                                            <span>Số phòng</span>
                                            <span>{selectedRooms.length} phòng</span>
                                        </li>
                                        <li className="summary-divider"></li>
                                        <li className="d-flex justify-content-between align-items-center total-price">
                                            <span>Tổng cộng</span>
                                            <span className="price">{totalPrice.toLocaleString('vi-VN')}đ</span>
                                        </li>
                                    </ul>

                                    <Button
                                        variant="primary"
                                        className="w-100 mt-3 booking-button"
                                        onClick={handleBookWithPayment}
                                        disabled={loading || selectedRooms.length === 0 || !selectedPaymentMethod}
                                    >
                                        {loading ? (
                                            <>
                                                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                                                Đang xử lý...
                                            </>
                                        ) : (
                                            'Xác nhận đặt phòng'
                                        )}
                                    </Button>
                                    <Button
                                        variant="outline-secondary"
                                        className="w-100 mt-3"
                                        onClick={() => navigate(-1)}
                                    >
                                        Quay lại
                                    </Button>
                                </Card.Body>
                            </Card>

                            <Card className="mt-4 shadow-sm">
                                <Card.Body>
                                    <h5>Lưu ý quan trọng</h5>
                                    <ul className="important-notes">
                                        <li>Giờ nhận phòng thường từ 14:00</li>
                                        <li>Giờ trả phòng thường trước 12:00</li>
                                        <li>Vui lòng mang theo giấy tờ tùy thân khi nhận phòng</li>
                                        <li>Nếu thanh toán tại quầy, phòng chỉ được giữ đến 18:00 ngày nhận phòng</li>
                                    </ul>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
            <Footer />
        </>
    )
}

export default BookingDetails