import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Container, Row, Col, Card, Badge, Button, Form, ListGroup, Tab, Nav, Alert, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faMapMarkerAlt, faWifi, faBed, faUser, faCalendarDays, faDollarSign, faHeart } from '@fortawesome/free-solid-svg-icons';
import { getHotelDetailsById, searchRoomsByCriteria } from '../../api/hotelApi';
import Navbar from '../../components/navbar/Navbar';
import Footer from '../../components/footer/Footer';
import { API_BASE_URL } from '../../api/apiConfig';
import defaultHotelImg from '../../assets/images/default_hotel_img.jpeg';
import './hotelDetails.css';

const HotelDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [selectedRooms, setSelectedRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hotelDetails, setHotelDetails] = useState({
        name: '',
        businessName: '',
        address: {
            number: '',
            street: '',
            district: '',
            city: ''
        },
        description: '',
        phone: '',
        email: '',
        website: '',
        facebook: '',
        instagram: '',
        twitter: '',
        linkedin: '',
        tiktok: '',
        images: [],
        rooms: [],
        services: [],
        reviews: [],
        totalRatings: 0,
        totalReviews: 0,
    });

    // Add new state variables for search
    const [filteredRooms, setFilteredRooms] = useState([]);
    const [searchCriteria, setSearchCriteria] = useState({
        dateRange: '',
        roomCount: 0,
        adults: 0,
        children: 0
    });
    const [isSearchApplied, setIsSearchApplied] = useState(false);

    // Room selection handler
    const handleRoomSelection = (room) => {
        // Check if the room is already selected
        const isRoomSelected = selectedRooms.some(selectedRoom => selectedRoom.id === room.id);

        if (isRoomSelected) {
            // Remove from selected rooms if already selected
            setSelectedRooms(selectedRooms.filter(selectedRoom => selectedRoom.id !== room.id));
        } else {
            // Add to selected rooms if not already selected (limit to 5 rooms)
            if (selectedRooms.length < 5) {
                setSelectedRooms([...selectedRooms, room]);
            } else {
                alert("Bạn chỉ có thể chọn tối đa 5 phòng cùng một lúc.");
            }
        }
    };

    // Function to proceed to booking details
    const handleProceedToBooking = () => {
        if (selectedRooms.length > 0) {
            // Navigate to booking details page with the selected room data
            navigate('/booking-details', { state: { selectedRooms, hotel: hotelDetails } });
        } else {
            alert("Vui lòng chọn ít nhất một phòng để tiếp tục.");
        }
    };

    useEffect(() => {
        const fetchHotelDetails = async () => {
            try {
                setLoading(true);
                const response = await getHotelDetailsById(id);
                setHotelDetails(response);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching hotel details:', error);
                setError('Không thể tải thông tin khách sạn. Vui lòng thử lại sau.');
                setLoading(false);
            }
        }

        fetchHotelDetails();
    }, [id]);

    const getImageUrl = (room) => {
        if (!room.images || room.images.length === 0) {
            if (!hotelDetails.images || hotelDetails.images.length === 0) {
                return defaultHotelImg; // Default image
            } else {
                // Use the hotel image directly if it's a full URL (Cloudinary)
                const hotelImage = hotelDetails.images[0].url;
                return hotelImage.startsWith('http') ? hotelImage : defaultHotelImg;
            }
        }

        const imagePath = room.images[0].url;

        // If it's already a full URL (likely Cloudinary), use it directly
        return imagePath.startsWith('http') ? imagePath : defaultHotelImg;
    }

    const getHotelImageUrl = (index = 0) => {
        if (!hotelDetails.images || hotelDetails.images.length === 0) {
            return defaultHotelImg;
        }
        
        const imagePath = hotelDetails.images[index].url;
        
        // If it's already a full URL (likely Cloudinary), use it directly
        return imagePath.startsWith('http') ? imagePath : defaultHotelImg;
    }

    const existsFreeWifi = (services) => {
        // Check if services exists and is an array
        if (!services || !Array.isArray(services) || services.length === 0) {
            return false;
        }

        // Look for any service that might be referring to wifi
        return services.some(service => {
            // Guard against null or undefined service names
            if (!service || !service.name) return false;

            const serviceName = service.name.toLowerCase();
            // Check for common wifi-related terms
            return serviceName.includes('wifi') ||
                serviceName.includes('wi-fi') ||
                serviceName.includes('internet');
        });
    }

    // Handle search rooms by form submit
    const [searchRoomsForm, setSearchRoomsForm] = useState({
        checkIn: '',
        checkOut: '',
        adults: 1,
        children: 0,
        bedType: ''
    });
    
    const handleSearchRoomsFormChange = (e) => {
        const { name, value } = e.target;
        if (name === 'daterange') {
            const dates = value.split(' - ');
            setSearchRoomsForm({
                ...searchRoomsForm,
                checkIn: dates[0],
                checkOut: dates[1]
            });
        } else {
            setSearchRoomsForm({
                ...searchRoomsForm,
                [name]: value
            });
        }
    }

    const handleSearchFormSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsSearchApplied(true);
            const data = await searchRoomsByCriteria(searchRoomsForm);
            if (data && Array.isArray(data)) {
                setFilteredRooms(data);
                console.log("Filtered rooms:", data);
            } else {
                setFilteredRooms([]);
                console.log("No rooms found matching criteria");
            }
        } catch (error) {
            console.error('Error fetching rooms:', error);
            setFilteredRooms([]);
        }
    }

    if (loading) {
        return (
            <>
                <Navbar />
                <Container className="my-5 py-5 text-center">
                    <Spinner animation="border" role="status" variant="primary" />
                    <p className="mt-3">Đang tải thông tin khách sạn...</p>
                </Container>
                <Footer />
            </>
        );
    }

    if (error) {
        return (
            <>
                <Navbar />
                <Container className="my-5 py-5 text-center">
                    <Alert variant="danger">{error}</Alert>
                    <Button variant="primary" onClick={() => navigate('/')} className="mt-3">
                        Trở về trang chủ
                    </Button>
                </Container>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="hotel-details-page">
                <Container>
                    {/* Breadcrumb */}
                    <div className="breadcrumb-top py-3">
                        <span onClick={() => navigate('/')} className="breadcrumb-item cursor-pointer">Trang chủ</span>
                        <span className="mx-2">/</span>
                        <span onClick={() => navigate('/hotels')} className="breadcrumb-item cursor-pointer">Khách sạn</span>
                        <span className="mx-2">/</span>
                        <span className="breadcrumb-item active">{hotelDetails.name}</span>
                    </div>

                    {/* Hotel Header */}
                    <div className="hotel-header mb-4">
                        <Row>
                            <Col md={8}>
                                <h1 className="hotel-title">{hotelDetails.name}</h1>
                                <div className="hotel-location">
                                    <FontAwesomeIcon icon={faMapMarkerAlt} className="me-2 text-primary" />
                                    {`${hotelDetails.address.number || ''} ${hotelDetails.address.street || ''}, ${hotelDetails.address.district || ''}, ${hotelDetails.address.city || ''}`}
                                </div>
                                <div className="hotel-rating mt-2">
                                    <Badge bg="warning" className="p-2">
                                        <FontAwesomeIcon icon={faStar} className="me-1" />
                                        {hotelDetails.totalRatings || '4.5'}
                                    </Badge>
                                    <span className="ms-2">({hotelDetails.totalReviews || '0'} Đánh giá)</span>
                                </div>
                            </Col>
                            <Col md={4} className="text-md-end">
                                <Button variant="outline-primary" className="me-2">
                                    <FontAwesomeIcon icon={faHeart} className="me-2" />
                                    Lưu vào yêu thích
                                </Button>
                            </Col>
                        </Row>
                    </div>

                    {/* Hotel Images Gallery */}
                    <div className="hotel-images mb-4">
                        <Row>
                            <Col md={8}>
                                <div className="main-image">
                                    <img 
                                        src={getHotelImageUrl(0)} 
                                        alt={hotelDetails.name} 
                                        className="img-fluid rounded"
                                    />
                                </div>
                            </Col>
                            <Col md={4}>
                                <Row>
                                    {hotelDetails.images && hotelDetails.images.slice(1, 5).map((image, index) => (
                                        <Col xs={6} className="mb-3" key={index}>
                                            <img 
                                                src={`${API_BASE_URL}/images/${image.url}`} 
                                                alt={`${hotelDetails.name} - ${index + 1}`}
                                                className="img-fluid rounded thumbnail"
                                            />
                                        </Col>
                                    ))}
                                    {hotelDetails.images && hotelDetails.images.length > 5 && (
                                        <Col xs={6}>
                                            <div className="more-images-overlay">
                                                <div className="more-images-count">
                                                    +{hotelDetails.images.length - 5}
                                                </div>
                                            </div>
                                        </Col>
                                    )}
                                </Row>
                            </Col>
                        </Row>
                    </div>

                    {/* Main Content Section */}
                    <Tab.Container defaultActiveKey="rooms">
                        {/* Navigation Tabs */}
                        <Row className="mb-4">
                            <Col>
                                <Nav variant="tabs" className="hotel-navigation">
                                    <Nav.Item>
                                        <Nav.Link eventKey="rooms">Phòng & Đặt chỗ</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="about">Thông tin khách sạn</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="amenities">Tiện nghi</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="reviews">Đánh giá</Nav.Link>
                                    </Nav.Item>
                                </Nav>
                            </Col>
                        </Row>

                        {/* Tab Content */}
                        <Row>
                            <Col lg={8}>
                                <Tab.Content>
                                    {/* Rooms Tab */}
                                    <Tab.Pane eventKey="rooms">
                                        <Card className="mb-4">
                                            <Card.Header className="bg-primary text-white">
                                                <h4 className="mb-0">Tìm kiếm phòng trống</h4>
                                            </Card.Header>
                                            <Card.Body>
                                                <Form onSubmit={handleSearchFormSubmit}>
                                                    <Row>
                                                        <Col md={6} className="mb-3">
                                                            <Form.Group>
                                                                <Form.Label>Ngày nhận - trả phòng</Form.Label>
                                                                <Form.Control 
                                                                    type="text" 
                                                                    name="daterange"
                                                                    placeholder="DD/MM/YYYY - DD/MM/YYYY"
                                                                    onChange={handleSearchRoomsFormChange}
                                                                />
                                                            </Form.Group>
                                                        </Col>
                                                        <Col md={6} className="mb-3">
                                                            <Form.Group>
                                                                <Form.Label>Loại giường</Form.Label>
                                                                <Form.Select name="bedType" onChange={handleSearchRoomsFormChange}>
                                                                    <option value="">Tất cả loại giường</option>
                                                                    <option value="SINGLE">Giường đơn</option>
                                                                    <option value="DOUBLE">Giường đôi</option>
                                                                    <option value="QUEEN">Giường Queen</option>
                                                                    <option value="KING">Giường King</option>
                                                                </Form.Select>
                                                            </Form.Group>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col md={6} className="mb-3">
                                                            <Form.Group>
                                                                <Form.Label>Người lớn</Form.Label>
                                                                <Form.Select name="adults" onChange={handleSearchRoomsFormChange}>
                                                                    {[...Array(10)].map((_, i) => (
                                                                        <option key={i} value={i + 1}>
                                                                            {i + 1} người lớn
                                                                        </option>
                                                                    ))}
                                                                </Form.Select>
                                                            </Form.Group>
                                                        </Col>
                                                        <Col md={6} className="mb-3">
                                                            <Form.Group>
                                                                <Form.Label>Trẻ em (0-10 tuổi)</Form.Label>
                                                                <Form.Select name="children" onChange={handleSearchRoomsFormChange}>
                                                                    <option value="0">Không có trẻ em</option>
                                                                    {[...Array(5)].map((_, i) => (
                                                                        <option key={i} value={i + 1}>
                                                                            {i + 1} trẻ em
                                                                        </option>
                                                                    ))}
                                                                </Form.Select>
                                                            </Form.Group>
                                                        </Col>
                                                    </Row>
                                                    <Button variant="primary" type="submit" className="w-100">
                                                        Tìm kiếm phòng trống
                                                    </Button>
                                                </Form>
                                            </Card.Body>
                                        </Card>

                                        {/* Room List Section */}
                                        <div className="room-list">
                                            <h4 className="mb-3">Phòng có sẵn</h4>
                                            
                                            {isSearchApplied ? (
                                                filteredRooms.length > 0 ? 
                                                filteredRooms.map((room) => (
                                                    <RoomCard 
                                                        key={room.id} 
                                                        room={room} 
                                                        onSelect={handleRoomSelection}
                                                        isSelected={selectedRooms.some(selectedRoom => selectedRoom.id === room.id)}
                                                        getImageUrl={getImageUrl}
                                                        existsFreeWifi={existsFreeWifi}
                                                    />
                                                )) : 
                                                <Alert variant="info">
                                                    Không tìm thấy phòng phù hợp với tiêu chí tìm kiếm. Vui lòng thử lại với tiêu chí khác.
                                                </Alert>
                                            ) : (
                                                hotelDetails.rooms && hotelDetails.rooms.length > 0 ?
                                                hotelDetails.rooms.map((room) => (
                                                    <RoomCard 
                                                        key={room.id} 
                                                        room={room} 
                                                        onSelect={handleRoomSelection}
                                                        isSelected={selectedRooms.some(selectedRoom => selectedRoom.id === room.id)}
                                                        getImageUrl={getImageUrl}
                                                        existsFreeWifi={existsFreeWifi}
                                                    />
                                                )) :
                                                <Alert variant="info">
                                                    Hiện tại khách sạn này chưa có thông tin phòng.
                                                </Alert>
                                            )}
                                            
                                            {selectedRooms.length > 0 && (
                                                <div className="selected-rooms-actions text-center mt-4">
                                                    <p>Đã chọn {selectedRooms.length} phòng</p>
                                                    <Button 
                                                        variant="success" 
                                                        size="lg"
                                                        onClick={handleProceedToBooking}
                                                    >
                                                        Tiến hành đặt phòng
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </Tab.Pane>

                                    {/* About Hotel Tab */}
                                    <Tab.Pane eventKey="about">
                                        <Card>
                                            <Card.Body>
                                                <h4>Giới thiệu về {hotelDetails.name}</h4>
                                                <p className="mt-3">{hotelDetails.description || 'Không có mô tả cho khách sạn này.'}</p>

                                                <h5 className="mt-4">Thông tin liên hệ</h5>
                                                <ListGroup variant="flush" className="contact-info">
                                                    {hotelDetails.phone && (
                                                        <ListGroup.Item>
                                                            <i className="bi bi-telephone me-2"></i> {hotelDetails.phone}
                                                        </ListGroup.Item>
                                                    )}
                                                    {hotelDetails.email && (
                                                        <ListGroup.Item>
                                                            <i className="bi bi-envelope me-2"></i> {hotelDetails.email}
                                                        </ListGroup.Item>
                                                    )}
                                                    {hotelDetails.website && (
                                                        <ListGroup.Item>
                                                            <i className="bi bi-globe me-2"></i> {hotelDetails.website}
                                                        </ListGroup.Item>
                                                    )}
                                                    <ListGroup.Item>
                                                        <i className="bi bi-geo-alt me-2"></i> 
                                                        {`${hotelDetails.address.number || ''} ${hotelDetails.address.street || ''}, ${hotelDetails.address.district || ''}, ${hotelDetails.address.city || ''}`}
                                                    </ListGroup.Item>
                                                </ListGroup>

                                                {/* Social Media Links */}
                                                {(hotelDetails.facebook || hotelDetails.instagram || hotelDetails.twitter) && (
                                                    <>
                                                        <h5 className="mt-4">Kết nối mạng xã hội</h5>
                                                        <div className="social-links">
                                                            {hotelDetails.facebook && (
                                                                <a href={hotelDetails.facebook} target="_blank" rel="noopener noreferrer" className="social-link">
                                                                    <i className="bi bi-facebook"></i>
                                                                </a>
                                                            )}
                                                            {hotelDetails.instagram && (
                                                                <a href={hotelDetails.instagram} target="_blank" rel="noopener noreferrer" className="social-link">
                                                                    <i className="bi bi-instagram"></i>
                                                                </a>
                                                            )}
                                                            {hotelDetails.twitter && (
                                                                <a href={hotelDetails.twitter} target="_blank" rel="noopener noreferrer" className="social-link">
                                                                    <i className="bi bi-twitter"></i>
                                                                </a>
                                                            )}
                                                            {hotelDetails.linkedin && (
                                                                <a href={hotelDetails.linkedin} target="_blank" rel="noopener noreferrer" className="social-link">
                                                                    <i className="bi bi-linkedin"></i>
                                                                </a>
                                                            )}
                                                            {hotelDetails.tiktok && (
                                                                <a href={hotelDetails.tiktok} target="_blank" rel="noopener noreferrer" className="social-link">
                                                                    <i className="bi bi-tiktok"></i>
                                                                </a>
                                                            )}
                                                        </div>
                                                    </>
                                                )}
                                            </Card.Body>
                                        </Card>
                                    </Tab.Pane>

                                    {/* Amenities Tab */}
                                    <Tab.Pane eventKey="amenities">
                                        <Card>
                                            <Card.Body>
                                                <h4 className="mb-4">Tiện nghi khách sạn</h4>
                                                
                                                {hotelDetails.services && hotelDetails.services.length > 0 ? (
                                                    <Row>
                                                        {hotelDetails.services.map((service, index) => (
                                                            <Col md={6} key={index} className="mb-3">
                                                                <div className="amenity-item">
                                                                    {/* <i className={`bi ${getAmenityIcon(service.name)}`}></i> */}
                                                                    <span>{service.name}</span>
                                                                </div>
                                                            </Col>
                                                        ))}
                                                    </Row>
                                                ) : (
                                                    <Alert variant="info">
                                                        Không có thông tin về tiện nghi của khách sạn.
                                                    </Alert>
                                                )}
                                            </Card.Body>
                                        </Card>
                                    </Tab.Pane>

                                    {/* Reviews Tab */}
                                    <Tab.Pane eventKey="reviews">
                                        <Card>
                                            <Card.Body>
                                                <div className="review-summary d-flex justify-content-between align-items-center mb-4">
                                                    <div>
                                                        <h4 className="mb-1">Đánh giá từ khách hàng</h4>
                                                        <p className="text-muted">Dựa trên {hotelDetails.totalReviews || 0} đánh giá</p>
                                                    </div>
                                                    <div className="rating-overview">
                                                        <div className="rating-score">{hotelDetails.totalRatings || '0'}/5</div>
                                                        <div className="rating-stars">
                                                            {[...Array(5)].map((_, i) => (
                                                                <FontAwesomeIcon 
                                                                    key={i}
                                                                    icon={faStar}
                                                                    className={i < Math.round(hotelDetails.totalRatings || 0) ? "text-warning" : "text-muted"}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Review List */}
                                                {hotelDetails.reviews && hotelDetails.reviews.length > 0 ? (
                                                    <div className="review-list">
                                                        {hotelDetails.reviews.map((review, index) => (
                                                            <div key={index} className="review-item mb-4">
                                                                <div className="review-header d-flex justify-content-between">
                                                                    <div className="reviewer-info">
                                                                        <h5>{review.userName || 'Khách hàng ẩn danh'}</h5>
                                                                        <p className="text-muted">{new Date(review.createdAt).toLocaleDateString()}</p>
                                                                    </div>
                                                                    <div className="review-rating">
                                                                        {[...Array(5)].map((_, i) => (
                                                                            <FontAwesomeIcon 
                                                                                key={i}
                                                                                icon={faStar}
                                                                                className={i < review.rating ? "text-warning" : "text-muted"}
                                                                            />
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                                <div className="review-content mt-2">
                                                                    <p>{review.comment}</p>
                                                                </div>
                                                                {review.hotelResponse && (
                                                                    <div className="hotel-response">
                                                                        <p className="text-primary mb-1">Phản hồi từ khách sạn:</p>
                                                                        <p>{review.hotelResponse}</p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <Alert variant="info">
                                                        Chưa có đánh giá nào cho khách sạn này.
                                                    </Alert>
                                                )}

                                                {/* Write Review Form */}
                                                <div className="write-review mt-4 pt-4 border-top">
                                                    <h5>Viết đánh giá của bạn</h5>
                                                    <Form>
                                                        <Form.Group className="mb-3">
                                                            <Form.Label>Đánh giá</Form.Label>
                                                            <div className="rating-input d-flex gap-2">
                                                                {[...Array(5)].map((_, i) => (
                                                                    <FontAwesomeIcon 
                                                                        key={i}
                                                                        icon={faStar}
                                                                        className="rating-star text-muted"
                                                                    />
                                                                ))}
                                                            </div>
                                                        </Form.Group>
                                                        <Form.Group className="mb-3">
                                                            <Form.Label>Bình luận</Form.Label>
                                                            <Form.Control as="textarea" rows={4} placeholder="Viết đánh giá của bạn ở đây" />
                                                        </Form.Group>
                                                        <Button variant="primary">
                                                            Gửi đánh giá
                                                        </Button>
                                                    </Form>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </Tab.Pane>
                                </Tab.Content>
                            </Col>

                            {/* Sidebar */}
                            <Col lg={4}>
                                {/* Price Summary Card */}
                                <Card className="mb-4 booking-summary sticky-top" style={{ top: '20px' }}>
                                    <Card.Header className="bg-success text-white">
                                        <h4 className="mb-0">Tóm tắt đặt phòng</h4>
                                    </Card.Header>
                                    <Card.Body>
                                        <div className="price-info mb-3">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <span>Giá từ</span>
                                                <span className="price">
                                                    <FontAwesomeIcon icon={faDollarSign} className="me-1" />
                                                    {hotelDetails.rooms && hotelDetails.rooms.length > 0 
                                                        ? `${Math.min(...hotelDetails.rooms.map(room => room.price)).toLocaleString('vi-VN')}đ` 
                                                        : 'Liên hệ'}
                                                </span>
                                            </div>
                                            <div className="text-muted small">Giá một đêm / phòng</div>
                                        </div>

                                        <div className="selected-summary">
                                            <h6 className="mb-3">Phòng đã chọn ({selectedRooms.length})</h6>
                                            {selectedRooms.length > 0 ? (
                                                <>
                                                    {selectedRooms.map((room, index) => (
                                                        <div key={index} className="selected-room-item d-flex align-items-center justify-content-between mb-2">
                                                            <div>
                                                                <div className="room-name">{room.name}</div>
                                                                <div className="text-muted small">{room.type}</div>
                                                            </div>
                                                            <div className="room-price">{room.price.toLocaleString('vi-VN')}đ</div>
                                                        </div>
                                                    ))}
                                                    <div className="total-price d-flex justify-content-between mt-3 pt-3 border-top">
                                                        <strong>Tổng tiền</strong>
                                                        <strong>
                                                            {selectedRooms.reduce((sum, room) => sum + room.price, 0).toLocaleString('vi-VN')}đ
                                                        </strong>
                                                    </div>
                                                </>
                                            ) : (
                                                <p className="text-muted">Chưa có phòng nào được chọn</p>
                                            )}
                                        </div>

                                        <div className="booking-actions mt-4">
                                            <Button 
                                                variant="success" 
                                                className="w-100 mb-3"
                                                onClick={handleProceedToBooking}
                                                disabled={selectedRooms.length === 0}
                                            >
                                                Đặt ngay
                                            </Button>
                                            <Button variant="outline-primary" className="w-100">
                                                <FontAwesomeIcon icon={faHeart} className="me-2" />
                                                Thêm vào danh sách yêu thích
                                            </Button>
                                        </div>
                                    </Card.Body>
                                </Card>

                                {/* Hotel Policies */}
                                <Card className="mb-4">
                                    <Card.Header>
                                        <h5 className="mb-0">Chính sách khách sạn</h5>
                                    </Card.Header>
                                    <ListGroup variant="flush">
                                        <ListGroup.Item>
                                            <div className="policy-item">
                                                <i className="bi bi-clock me-2"></i>
                                                <div>
                                                    <div>Nhận phòng: từ 14:00</div>
                                                    <div>Trả phòng: trước 12:00</div>
                                                </div>
                                            </div>
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            <div className="policy-item">
                                                <i className="bi bi-credit-card me-2"></i>
                                                <div>
                                                    <div>Đặt cọc trước khi nhận phòng</div>
                                                </div>
                                            </div>
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            <div className="policy-item">
                                                <i className="bi bi-x-circle me-2"></i>
                                                <div>
                                                    <div>Chính sách hủy:</div>
                                                    <div className="small text-muted">Hủy miễn phí trước 3 ngày khi nhận phòng</div>
                                                </div>
                                            </div>
                                        </ListGroup.Item>
                                    </ListGroup>
                                </Card>

                                {/* Map Section */}
                                <Card>
                                    <Card.Header>
                                        <h5 className="mb-0">Vị trí khách sạn</h5>
                                    </Card.Header>
                                    <Card.Body className="p-0">
                                        <div className="location-placeholder">
                                            <div className="map-placeholder text-center p-5">
                                                <i className="bi bi-geo-alt display-1 text-muted"></i>
                                                <p className="mt-2">
                                                    {`${hotelDetails.address.number || ''} ${hotelDetails.address.street || ''}, ${hotelDetails.address.district || ''}, ${hotelDetails.address.city || ''}`}
                                                </p>
                                            </div>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Tab.Container>

                    {/* Related Hotels Section */}
                    <div className="related-hotels mt-5">
                        <h3 className="mb-4">Khách sạn tương tự</h3>
                        <Row xs={1} md={2} lg={4} className="g-4">
                            {[...Array(4)].map((_, index) => (
                                <Col key={index}>
                                    <Card className="hotel-card h-100">
                                        <div className="hotel-img-container">
                                            <Card.Img variant="top" src={defaultHotelImg} />
                                        </div>
                                        <Card.Body>
                                            <Card.Title>Khách sạn gợi ý {index + 1}</Card.Title>
                                            <div className="location">
                                                <FontAwesomeIcon icon={faMapMarkerAlt} className="me-1 text-primary" />
                                                <span>Thành phố Hồ Chí Minh</span>
                                            </div>
                                            <div className="d-flex justify-content-between align-items-center mt-3">
                                                <div className="price">
                                                    <span className="text-muted">Từ </span>
                                                    <span className="fw-bold">{(1000000 + index * 100000).toLocaleString('vi-VN')}đ</span>
                                                </div>
                                                <div className="rating">
                                                    <FontAwesomeIcon icon={faStar} className="text-warning me-1" />
                                                    <span>{4.0 + index * 0.2}</span>
                                                </div>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </div>
                </Container>
            </div>
            <Footer />
        </>
    )
}

// RoomCard Component
const RoomCard = ({ room, onSelect, isSelected, getImageUrl, existsFreeWifi }) => {
    return (
        <Card className={`room-card mb-4 ${isSelected ? 'selected' : ''}`}>
            <Row className="g-0">
                <Col md={4}>
                    <div className="room-img-container">
                        <img src={getImageUrl(room)} className="img-fluid rounded-start" alt={room.name} />
                    </div>
                </Col>
                <Col md={8}>
                    <Card.Body>
                        <div className="d-flex justify-content-between align-items-start">
                            <Card.Title>{room.name}</Card.Title>
                            <div className="room-price">
                                <span className="price-label">1 đêm</span>
                                <span className="price-value">{room.price.toLocaleString('vi-VN')}đ</span>
                            </div>
                        </div>
                        <Card.Text className="room-description">
                            {room.description || 'Không có mô tả chi tiết cho phòng này.'}
                        </Card.Text>
                        <div className="room-features">
                            <Badge bg="light" text="dark" className="me-2">
                                <FontAwesomeIcon icon={faBed} className="me-1" />
                                {room.type || 'Standard'}
                            </Badge>
                            <Badge bg="light" text="dark" className="me-2">
                                <FontAwesomeIcon icon={faUser} className="me-1" />
                                {room.capacity || 2} người
                            </Badge>
                            {existsFreeWifi(room.services) && (
                                <Badge bg="light" text="dark">
                                    <FontAwesomeIcon icon={faWifi} className="me-1" />
                                    Wi-Fi miễn phí
                                </Badge>
                            )}
                        </div>
                        <div className="room-actions mt-3 d-flex justify-content-between align-items-center">
                            <div>
                                <Button 
                                    variant={isSelected ? "success" : "outline-primary"} 
                                    onClick={() => onSelect(room)}
                                    className="select-room-btn"
                                >
                                    {isSelected ? 'Đã chọn' : 'Chọn phòng'}
                                </Button>
                            </div>
                            <div className="room-details-link">
                                <Link to={`/hotels/rooms/${room.id}`} className="text-decoration-none">Chi tiết phòng</Link>
                            </div>
                        </div>
                    </Card.Body>
                </Col>
            </Row>
        </Card>
    );
};

// Helper function to get appropriate icon for amenities
// const getAmenityIcon = (amenityName) => {
//     // Check if amenityName is undefined, null, or not a string
//     if (!amenityName || typeof amenityName !== 'string') return 'bi-check-circle'; 
    
//     const name = amenityName.toLowerCase();
//     if (name.includes('wifi') || name.includes('internet')) return 'bi-wifi';
//     if (name.includes('breakfast') || name.includes('ăn sáng')) return 'bi-cup-hot';
//     if (name.includes('parking') || name.includes('đậu xe')) return 'bi-car-front';
//     if (name.includes('pool') || name.includes('bơi')) return 'bi-water';
//     if (name.includes('gym') || name.includes('fitness')) return 'bi-bicycle';
//     if (name.includes('spa')) return 'bi-brightness-high';
//     if (name.includes('air') || name.includes('conditioning') || name.includes('điều hòa')) return 'bi-snow';
//     if (name.includes('tv') || name.includes('television')) return 'bi-tv';
//     if (name.includes('bar')) return 'bi-cup-straw';
//     if (name.includes('restaurant') || name.includes('nhà hàng')) return 'bi-shop';
//     return 'bi-check-circle'; // Default icon
// };

export default HotelDetails