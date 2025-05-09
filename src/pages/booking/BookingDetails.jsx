import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays, faMapMarkerAlt, faUser, faCheck, faMoneyBill } from '@fortawesome/free-solid-svg-icons';
import Navbar from '../../components/navbar/Navbar';
import Footer from '../../components/footer/Footer';
import './bookingDetails.css';
import { createBooking } from '../../api/bookingApi';
import default_room_img from '../../assets/images/default_room.jpg'
import default_hotel_img from '../../assets/images/default_hotel_img.jpeg'

const BookingDetails = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { selectedRooms, hotel } = location.state || { selectedRooms: [], hotel: {} };
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        document.title = "Xác nhận đặt phòng";
    }, [])

    // Calculate the base price (price per night for all rooms)
    const calculateBasePrice = () => {
        return selectedRooms.reduce((total, room) => total + room.price, 0);
    };

    // Check if we have valid check-in/check-out dates from previous page
    const [checkInDate, setCheckInDate] = useState(
        location.state?.checkInDate || new Date().toISOString().split('T')[0]
    );
    const [checkOutDate, setCheckOutDate] = useState(
        location.state?.checkOutDate || new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    );
    // Store base price (per night) separately
    const [basePrice] = useState(calculateBasePrice());
    const [totalPrice, setTotalPrice] = useState(calculateBasePrice());

    // Calculate nights of stay
    const calculateNights = () => {
        const start = new Date(checkInDate);
        const end = new Date(checkOutDate);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays || 1; // Ensure at least 1 night
    };

    // Update total price based on nights
    const updateTotalPrice = () => {
        const nights = calculateNights();
        setTotalPrice(basePrice * nights);
    };    // Effect to update price when dates change
    useEffect(() => {
        updateTotalPrice();
    }, [checkInDate, checkOutDate, basePrice]);

    const handleChangeCheckInDate = (e) => {
        const newCheckInDate = e.target.value;

        if (new Date() > new Date(newCheckInDate)) {
            alert("Ngày nhận phòng không được trước ngày hiện tại");
            return;
        }else if (new Date(newCheckInDate) >= new Date(checkOutDate)) {
            alert("Ngày nhận phòng không được lớn hơn hoặc bằng ngày trả phòng");
            return;
        }

        setCheckInDate(newCheckInDate);
    }

    const handleChangeCheckOutDate = (e) => {
        const newCheckOutDate = e.target.value;

        if (new Date(newCheckOutDate) <= new Date(checkInDate)) {
            alert("Ngày trả phòng không được nhỏ hơn hoặc bằng ngày nhận phòng");
            return;
        }

        setCheckOutDate(newCheckOutDate);
    }

    // Get image URL for a room
    const getImageUrl = (room) => {
        if (!room.images || room.images.length === 0) {
            if (!hotel.images || hotel.images.length === 0) {
                return default_hotel_img; // Default image path
            } else {
                return default_room_img;
            }
        } else {
            return room.images[0].url;
        }
    };

    // Handle booking confirmation
    const handleBookConfirmation = async () => {
        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem('jwt');
            if (!token) {
                navigate('/login', { state: { redirectTo: location.pathname, state: location.state } });
                return;
            }

            // Prepare booking data with counter payment
            const bookingData = {
                hotelId: hotel.id,
                checkInDate: checkInDate,
                checkOutDate: checkOutDate,
                price: totalPrice,
                paymentMethod: {
                    id: 1, // Counter payment
                    type: 'CASH',
                },
                status: 'PENDING',
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

            if ((response.status === 400 || response.status === 401) && response.data.message.includes("User")) {
                console.log("Chưa đăng nhập khi booking")
                alert("Bạn cần đăng nhập để thực hiện đặt phòng");
                navigate('/login', { state: { redirectTo: location.pathname, state: location.state } });
            } else {
                const bookingConfirmation = {
                    bookingId: response.bookingId,
                    paymentMethod: 'counter',
                    totalAmount: response.totalPrice,
                    hotel: hotel,
                    selectedRooms: response.selectedRooms,
                    checkInDate: response.checkInDate,
                    checkOutDate: response.checkOutDate,
                    user: response.user
                }

                // Navigate to booking confirmation page
                navigate('/booking-confirmation', {
                    state: { bookingConfirmation, hotel: hotel, selectedRooms: selectedRooms }
                });
            }

        } catch (err) {
            console.error("Error creating booking:", err);
            setError(err.response?.data?.message || "Failed to create booking. Please try again.");
        } finally {
            setLoading(false);
        }
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
                                                        onChange={handleChangeCheckInDate}
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
                                                        onChange={handleChangeCheckOutDate}
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

                                    {/* Payment Information */}
                                    <div className="payment-info mb-4">
                                        <h5>Phương thức thanh toán</h5>
                                        <div className="payment-option-info mt-3">
                                            <div className="d-flex align-items-center">
                                                <div className="payment-logo me-3">
                                                    <FontAwesomeIcon icon={faMoneyBill} size="lg" />
                                                </div>
                                                <div className="payment-content">
                                                    <h6 className="mb-1">Thanh toán tại quầy</h6>
                                                    <p className="text-muted mb-0">Thanh toán khi bạn đến khách sạn</p>
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
                                        onClick={handleBookConfirmation}
                                        disabled={loading || selectedRooms.length === 0}
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
                                        <li>Phòng chỉ được giữ đến 18:00 ngày nhận phòng</li>
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