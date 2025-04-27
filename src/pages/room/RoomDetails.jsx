import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Badge, Button, Alert, Spinner, ListGroup, Form, Tab, Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faMapMarkerAlt, faWifi, faBed, faUser, faDollarSign, faHeart, faCheckCircle, faCalendarDays } from '@fortawesome/free-solid-svg-icons';
import Navbar from '../../components/navbar/Navbar';
import Footer from '../../components/footer/Footer';
import { API_BASE_URL } from '../../api/apiConfig';
import { getRoomDetails } from '../../api/roomApi';
import defaultHotelImg from '../../assets/images/default_hotel_img.jpeg';
import './roomDetails.css'; // We'll create this file next

const RoomDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState({
      id: "",
      name: "",
      description: "",
      numberOfAdults: 0,
      numberOfChildren: 0,
      numberOfBeds: 0,
      price: "",
      typeBed: "",
      roomImages: [],
      services: [],
      reviews: [],
      totalRating: 0,
      totalReviews: 0,
    });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingDates, setBookingDates] = useState({
    checkIn: '',
    checkOut: ''
  });
  const [guestCount, setGuestCount] = useState({
    adults: 1,
    children: 0
  });

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        setLoading(true);
        const response = await getRoomDetails(id);
        setRoom(response);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching room details:', error);
        setError('Không thể tải thông tin phòng. Vui lòng thử lại sau.');
        setLoading(false);
      }
    };

    fetchRoomDetails();
  }, [id]);

  const handleBookNow = () => {
    // Create booking object with room and booking details
    const booking = {
      room: room,
      bookingDates,
      guestCount,
    };

    // Navigate to booking page with the room data
    navigate('/booking-detail', {
      state: {
        selectedRooms: [room],
        hotel: room.hotel,
        bookingDates,
        guestCount
      }
    });
  };

  const handleBookingFormChange = (e) => {
    const { name, value } = e.target;
    if (name === 'daterange') {
      const dates = value.split(' - ');
      setBookingDates({
        checkIn: dates[0],
        checkOut: dates[1]
      });
    } else if (name === 'adults' || name === 'children') {
      setGuestCount({
        ...guestCount,
        [name]: parseInt(value)
      });
    }
  };

  const getImageUrl = (image) => {
    if (!image || !image.url) {
      return defaultHotelImg;
    }

    const imagePath = image.url;

    if (imagePath.startsWith('http')) {
      return imagePath;
    } else {
      return `${API_BASE_URL}/images/${imagePath}`;
    }
  };

  const existsFreeWifi = (services) => {
    // Check if services exists and is an array
    if (!services || !Array.isArray(services) || services.length === 0) {
      return false;
    }

    // Look for any service that might be referring to wifi
    return services.some(service => {
      // Guard against null or undefined service objects
      if (!service) return false;

      // Guard against missing name property
      const serviceName = service.name ? service.name.toLowerCase() : '';

      // Check for common wifi-related terms
      return serviceName.includes('wifi') ||
        serviceName.includes('wi-fi') ||
        serviceName.includes('internet');
    });
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <Container className="my-5 py-5 text-center">
          <Spinner animation="border" role="status" variant="primary" />
          <p className="mt-3">Đang tải thông tin phòng...</p>
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
      <div className="room-details-page">
        <Container>
          {/* Breadcrumb */}
          <div className="breadcrumb-top py-3">
            <span onClick={() => navigate('/')} className="breadcrumb-item cursor-pointer">Trang chủ</span>
            <span className="mx-2">/</span>
            <span onClick={() => navigate('/hotels')} className="breadcrumb-item cursor-pointer">Khách sạn</span>
            <span className="mx-2">/</span>
            {/* <span onClick={() => navigate(`/hotels/${room.hotel.id}`)} className="breadcrumb-item cursor-pointer">{room.hotel.name}</span>
            <span className="mx-2">/</span> */}
            <span className="breadcrumb-item active">{room.name}</span>
          </div>

          {/* Room Header */}
          <div className="room-header mb-4">
            <Row>
              <Col md={8}>
                <h1 className="room-title">{room.name}</h1>
                {/* <div className="hotel-name">
                  <Link to={`/hotels/${room.hotel.id}`} className="text-decoration-none">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="me-2 text-primary" />
                    {room.hotel.name}
                  </Link>
                </div> */}
                {room.totalReviews > 0 && (
                  <div className="room-rating mt-2">
                    <Badge bg="warning" className="p-2">
                      <FontAwesomeIcon icon={faStar} className="me-1" />
                      {room.totalRating || '4.5'}
                    </Badge>
                    <span className="ms-2">({room.totalReviews || '0'} Đánh giá)</span>
                  </div>
                )}
              </Col>
              <Col md={4} className="text-md-end">
                <Button variant="outline-primary" className="me-2">
                  <FontAwesomeIcon icon={faHeart} className="me-2" />
                  Lưu vào yêu thích
                </Button>
              </Col>
            </Row>
          </div>

          {/* Room Images Gallery */}
          <div className="room-images mb-4">
            <Row>
              <Col md={8}>
                <div className="main-image">
                  <img
                    src={room.roomImages && room.roomImages.length > 0 ? getImageUrl(room.roomImages[0]) : defaultHotelImg}
                    alt={room.name}
                    className="img-fluid rounded"
                  />
                </div>
              </Col>
              <Col md={4}>
                <Row>
                  {room.roomImages && room.roomImages.slice(1, 5).map((image, index) => (
                    <Col xs={6} className="mb-3" key={index}>
                      <img
                        src={getImageUrl(image)}
                        alt={`${room.name} - ${index + 1}`}
                        className="img-fluid rounded thumbnail"
                      />
                    </Col>
                  ))}
                  {room.roomImages && room.roomImages.length > 5 && (
                    <Col xs={6}>
                      <div className="more-images-overlay">
                        <div className="more-images-count">
                          +{room.roomImages.length - 5}
                        </div>
                      </div>
                    </Col>
                  )}
                </Row>
              </Col>
            </Row>
          </div>

          {/* Main Content Section */}
          <Row>
            <Col lg={8}>
              <Tab.Container defaultActiveKey="details">
                {/* Navigation Tabs */}
                <Row className="mb-4">
                  <Col>
                    <Nav variant="tabs" className="room-navigation">
                      <Nav.Item>
                        <Nav.Link eventKey="details">Thông tin phòng</Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="amenities">Tiện nghi</Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="reviews">Đánh giá</Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="policies">Chính sách</Nav.Link>
                      </Nav.Item>
                    </Nav>
                  </Col>
                </Row>

                {/* Tab Content */}
                <Tab.Content>
                  {/* Room Details Tab */}
                  <Tab.Pane eventKey="details">
                    <Card className="mb-4">
                      <Card.Body>
                        <h4>Thông tin chi tiết về {room.name}</h4>
                        <p className="mt-3">{room.description || 'Không có mô tả chi tiết cho phòng này.'}</p>

                        <div className="room-specifications mt-4">
                          <h5>Thông số phòng</h5>
                          <Row className="mt-3">
                            <Col md={6}>
                              <ListGroup variant="flush" className="room-specs">
                                <ListGroup.Item className="d-flex align-items-center">
                                  <FontAwesomeIcon icon={faBed} className="me-3 text-primary" />
                                  <div>
                                    <div className="spec-label">Loại phòng</div>
                                    <div className="spec-value">{room.type || 'Tiêu chuẩn'}</div>
                                  </div>
                                </ListGroup.Item>
                                <ListGroup.Item className="d-flex align-items-center">
                                  <FontAwesomeIcon icon={faUser} className="me-3 text-primary" />
                                  <div>
                                    <div className="spec-label">Sức chứa</div>
                                    <div className="spec-value">
                                      {room.numberOfAdults + room.numberOfChildren || 2} người
                                    </div>
                                  </div>
                                </ListGroup.Item>
                              </ListGroup>
                            </Col>
                            <Col md={6}>
                              <ListGroup variant="flush" className="room-specs">
                                <ListGroup.Item className="d-flex align-items-center">
                                  <FontAwesomeIcon icon={faBed} className="me-3 text-primary" />
                                  <div>
                                    <div className="spec-label">Loại giường</div>
                                    <div className="spec-value">{room.bedType || 'Chưa có thông tin'}</div>
                                  </div>
                                </ListGroup.Item>
                                <ListGroup.Item className="d-flex align-items-center">
                                  <FontAwesomeIcon icon={faDollarSign} className="me-3 text-primary" />
                                  <div>
                                    <div className="spec-label">Giá phòng</div>
                                    <div className="spec-value price-value">{room.price.toLocaleString('vi-VN')}đ / đêm</div>
                                  </div>
                                </ListGroup.Item>
                              </ListGroup>
                            </Col>
                          </Row>
                        </div>

                        <div className="room-location mt-4">
                          <h5>Vị trí</h5>
                          {/* <p className="mt-2">
                            <FontAwesomeIcon icon={faMapMarkerAlt} className="me-2 text-primary" />
                            {`${room.hotel.address.number || ''} ${room.hotel.address.street || ''}, ${room.hotel.address.district || ''}, ${room.hotel.address.city || ''}`}
                          </p> */}
                        </div>
                      </Card.Body>
                    </Card>
                  </Tab.Pane>

                  {/* Amenities Tab */}
                  <Tab.Pane eventKey="amenities">
                    <Card>
                      <Card.Body>
                        <h4 className="mb-4">Tiện nghi phòng</h4>

                        {room.services && room.services.length > 0 ? (
                          <Row>
                            {room.services.map((service, index) => (
                              <Col md={6} key={index} className="mb-3">
                                <div className="amenity-item">
                                  <FontAwesomeIcon icon={faCheckCircle} className="me-2 text-primary" />
                                  <span>{service.name}</span>
                                </div>
                              </Col>
                            ))}

                            {/* Add some default common amenities if needed */}
                            {existsFreeWifi(room.services) && (
                              <Col md={6} className="mb-3">
                                <div className="amenity-item">
                                  <FontAwesomeIcon icon={faWifi} className="me-2 text-primary" />
                                  <span>Wi-Fi miễn phí</span>
                                </div>
                              </Col>
                            )}
                          </Row>
                        ) : (
                          <Alert variant="info">
                            Không có thông tin về tiện nghi của phòng.
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
                            <p className="text-muted">Dựa trên {room.totalReviews || 0} đánh giá</p>
                          </div>
                          <div className="rating-overview">
                            <div className="rating-score">{room.totalRating || '0'}/5</div>
                            <div className="rating-stars">
                              {[...Array(5)].map((_, i) => (
                                <FontAwesomeIcon
                                  key={i}
                                  icon={faStar}
                                  className={i < Math.round(room.totalRating || 0) ? "text-warning" : "text-muted"}
                                />
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Review List */}
                        {room.reviews && room.reviews.length > 0 ? (
                          <div className="review-list">
                            {room.reviews.map((review, index) => (
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
                            Chưa có đánh giá nào cho phòng này.
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

                  {/* Policies Tab */}
                  <Tab.Pane eventKey="policies">
                    <Card>
                      <Card.Body>
                        <h4 className="mb-4">Chính sách phòng</h4>

                        <ListGroup variant="flush">
                          <ListGroup.Item>
                            <div className="policy-item">
                              <FontAwesomeIcon icon={faCheckCircle} className="me-3 text-primary" />
                              <div>
                                <div className="policy-label">Nhận phòng:</div>
                                <div className="policy-value">Từ 14:00</div>
                              </div>
                            </div>
                          </ListGroup.Item>
                          <ListGroup.Item>
                            <div className="policy-item">
                              <FontAwesomeIcon icon={faCheckCircle} className="me-3 text-primary" />
                              <div>
                                <div className="policy-label">Trả phòng:</div>
                                <div className="policy-value">Trước 12:00</div>
                              </div>
                            </div>
                          </ListGroup.Item>
                          <ListGroup.Item>
                            <div className="policy-item">
                              <FontAwesomeIcon icon={faCheckCircle} className="me-3 text-primary" />
                              <div>
                                <div className="policy-label">Hủy đặt phòng:</div>
                                <div className="policy-value">Miễn phí hủy trước 3 ngày khi nhận phòng</div>
                              </div>
                            </div>
                          </ListGroup.Item>
                          <ListGroup.Item>
                            <div className="policy-item">
                              <FontAwesomeIcon icon={faCheckCircle} className="me-3 text-primary" />
                              <div>
                                <div className="policy-label">Trẻ em và giường phụ:</div>
                                <div className="policy-value">Trẻ em dưới 6 tuổi được ở miễn phí khi dùng chung giường với người lớn</div>
                              </div>
                            </div>
                          </ListGroup.Item>
                          <ListGroup.Item>
                            <div className="policy-item">
                              <FontAwesomeIcon icon={faCheckCircle} className="me-3 text-primary" />
                              <div>
                                <div className="policy-label">Thú cưng:</div>
                                <div className="policy-value">Không được phép mang theo thú cưng</div>
                              </div>
                            </div>
                          </ListGroup.Item>
                        </ListGroup>
                      </Card.Body>
                    </Card>
                  </Tab.Pane>
                </Tab.Content>
              </Tab.Container>
            </Col>

            {/* Sidebar */}
            <Col lg={4}>
              {/* Booking Card */}
              <Card className="mb-4 booking-summary sticky-top" style={{ top: '20px' }}>
                <Card.Header className="bg-success text-white">
                  <h4 className="mb-0">Đặt phòng</h4>
                </Card.Header>
                <Card.Body>
                  <div className="price-info mb-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <span>Giá phòng</span>
                      <span className="price">
                        <FontAwesomeIcon icon={faDollarSign} className="me-1" />
                        <span className="price-value">{room.price.toLocaleString('vi-VN')}đ</span>
                      </span>
                    </div>
                    <div className="text-muted small">Giá một đêm / phòng</div>
                  </div>

                  <Form className="booking-form">
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <FontAwesomeIcon icon={faCalendarDays} className="me-2" />
                        Ngày nhận - trả phòng
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="daterange"
                        placeholder="DD/MM/YYYY - DD/MM/YYYY"
                        onChange={handleBookingFormChange}
                      />
                    </Form.Group>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            <FontAwesomeIcon icon={faUser} className="me-2" />
                            Người lớn
                          </Form.Label>
                          <Form.Select name="adults" onChange={handleBookingFormChange}>
                            {[...Array(room.capacity || 4)].map((_, i) => (
                              <option key={i} value={i + 1}>
                                {i + 1} người lớn
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Trẻ em (0-10 tuổi)</Form.Label>
                          <Form.Select name="children" onChange={handleBookingFormChange}>
                            <option value="0">Không có trẻ em</option>
                            {[...Array(3)].map((_, i) => (
                              <option key={i} value={i + 1}>
                                {i + 1} trẻ em
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>

                    <div className="total-calculation mt-3 pt-3 border-top">
                      <div className="d-flex justify-content-between">
                        <span>Giá phòng (1 đêm)</span>
                        <span>{room.price.toLocaleString('vi-VN')}đ</span>
                      </div>
                      <div className="d-flex justify-content-between mt-2">
                        <span>Thuế và phí</span>
                        <span>{(room.price * 0.1).toLocaleString('vi-VN')}đ</span>
                      </div>
                      <div className="d-flex justify-content-between mt-3 pt-2 border-top">
                        <strong>Tổng tiền</strong>
                        <strong className="price-value">{(room.price * 1.1).toLocaleString('vi-VN')}đ</strong>
                      </div>
                    </div>

                    <div className="booking-actions mt-4">
                      <Button
                        variant="success"
                        className="w-100 mb-3"
                        onClick={handleBookNow}
                      >
                        Đặt ngay
                      </Button>
                      <Button variant="outline-primary" className="w-100">
                        <FontAwesomeIcon icon={faHeart} className="me-2" />
                        Thêm vào danh sách yêu thích
                      </Button>
                    </div>
                  </Form>
                </Card.Body>
              </Card>

              {/* Hotel Info */}
              <Card className="mb-4">
                <Card.Header>
                  <h5 className="mb-0">Thông tin khách sạn</h5>
                </Card.Header>
                <Card.Body>
                  <div className="hotel-info">
                    <div className="hotel-name-link mb-3">
                      {/* <Link to={`/hotels/${room.hotel.id}`} className="text-decoration-none">
                        <h5>{room.hotel.name}</h5>
                      </Link>
                      <div>
                        <FontAwesomeIcon icon={faMapMarkerAlt} className="me-2 text-primary" />
                        {`${room.hotel.address.district || ''}, ${room.hotel.address.city || ''}`}
                      </div> */}
                    </div>

                    <div className="quick-details">
                      {existsFreeWifi(room.services || []) && (
                        <div className="mb-2">
                          <FontAwesomeIcon icon={faWifi} className="me-2 text-primary" />
                          <span>Wi-Fi miễn phí</span>
                        </div>
                      )}
                      <div className="mb-2">
                        <FontAwesomeIcon icon={faCheckCircle} className="me-2 text-primary" />
                        <span>Nhận phòng từ 14:00</span>
                      </div>
                      <div>
                        <FontAwesomeIcon icon={faCheckCircle} className="me-2 text-primary" />
                        <span>Trả phòng trước 12:00</span>
                      </div>
                    </div>

                    <div className="text-center mt-3">
                      {/* <Link to={`/hotels/${room.hotel.id}`} className="btn btn-outline-primary">
                        Xem thông tin khách sạn
                      </Link> */}
                    </div>
                  </div>
                </Card.Body>
              </Card>

              {/* Related Rooms */}
              <Card>
                <Card.Header>
                  <h5 className="mb-0">Phòng tương tự</h5>
                </Card.Header>
                <ListGroup variant="flush">
                  {[...Array(3)].map((_, index) => (
                    <ListGroup.Item key={index} className="related-room-item">
                      <div className="d-flex">
                        <div className="related-room-img">
                          <img
                            src={defaultHotelImg}
                            alt={`Related Room ${index + 1}`}
                            className="img-fluid rounded"
                          />
                        </div>
                        <div className="related-room-info ms-3">
                          <h6>Phòng {room.type || 'Standard'} {index + 1}</h6>
                          <div className="small">
                            <FontAwesomeIcon icon={faUser} className="me-1" />
                            {(room.numberOfAdults + room.numberOfChildren || 2) + index} người
                          </div>
                          <div className="price-info mt-1">
                            <strong>{(room.price + index * 100000).toLocaleString('vi-VN')}đ</strong>
                          </div>
                        </div>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
                <Card.Footer className="text-center">
                  {/* <Link to={`/hotels/${room.hotel.id}`} className="text-decoration-none">
                    Xem tất cả phòng
                  </Link> */}
                </Card.Footer>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
      <Footer />
    </>
  );
};

export default RoomDetails;