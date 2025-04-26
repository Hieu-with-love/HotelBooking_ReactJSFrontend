import React, { useState, useEffect } from 'react';
import { Card, Button, Row, Col, Container, Badge, Spinner, Pagination } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faMapMarkerAlt, faHotel } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import './hotelList.css';
import { getHotels, getHotelsFromCustomer } from '../../api/hotelApi';
import defaultHotelImg from '../../assets/images/default_hotel_img.jpeg'; // Fixed import
import { API_BASE_URL } from '../../api/apiConfig';

const HotelList = () => {
    // State for hotels data
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [numberOfElements, setNumberOfElements] = useState(0);

    // For demo pagination with sample data
    const paginate = (items, page, size) => {
        const startIndex = page * size;
        return {
            content: items.slice(startIndex, startIndex + size),
            totalPages: Math.ceil(items.length / size),
            totalElements: items.length,
            numberOfElements: Math.min(size, items.length - startIndex)
        };
    };

    // Fetch hotels data
    useEffect(() => {
        // Call the API to fetch real hotel data
        fetchHotels(currentPage, pageSize);
    }, [currentPage, pageSize]); // Re-fetch when page or size changes

    // Function to fetch hotels data from API
    const fetchHotels = async () => {
        setLoading(true);
        try {
            // Replace with your actual API endpoint
            const response = await getHotelsFromCustomer(currentPage, pageSize);
            // Get pagination data
            setTotalPages(response.totalPages);
            setTotalElements(response.totalElements);
            setNumberOfElements(response.numberOfElements);
            // Get hotels data
            setHotels(response.content);
            setError(null);
            console.log(response);
        } catch (err) {
            console.error('Error fetching hotel data:', err);
            setError('Failed to fetch hotel data. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    // Show image url or default image
    const getImageUrl = (hotel) => {
        if (!hotel.images || hotel.images.length === 0){
            return defaultHotelImg; // Default image
        }else {
            const imagePath = hotel.images[0].url;
            // Check if the path already includes the base URL
            if (imagePath.startsWith('http')) {
                return imagePath;
            }
            // Construct the full URL to the uploaded image
            return `${API_BASE_URL}/images/${imagePath}`;
        }
    }

    // Get safe text value (prevent rendering objects directly)
    const getSafeValue = (value, defaultValue = "N/A") => {
        if (value === null || value === undefined) {
            return defaultValue;
        }
        if (typeof value === 'object' && !Array.isArray(value)) {
            return defaultValue;
        }
        return value;
    };

    // Get room count properly regardless of data format
    const getRoomCount = (hotel) => {
        if (!hotel) return 0;
        
        // If rooms is a number, return it directly
        if (typeof hotel.rooms === 'number') {
            return hotel.rooms;
        }
        
        // If rooms is an array, return the array length
        if (Array.isArray(hotel.rooms)) {
            return hotel.rooms.length;
        }
        
        // If there's a roomCount property, use that
        if (typeof hotel.roomCount === 'number') {
            return hotel.roomCount;
        }
        
        // If there's a rooms object with a length property
        if (hotel.rooms && typeof hotel.rooms === 'object' && hotel.rooms.length) {
            return hotel.rooms.length;
        }
        
        // Default to 0 if we can't find room information
        return 0;
    };

    // Handle page change
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Create pagination items
    const renderPaginationItems = () => {
        let items = [];
        
        // Add first page
        items.push(
            <Pagination.First 
                key="first" 
                onClick={() => handlePageChange(0)}
                disabled={currentPage === 0} 
            />
        );
        
        // Add previous page
        items.push(
            <Pagination.Prev 
                key="prev" 
                onClick={() => handlePageChange(Math.max(0, currentPage - 1))}
                disabled={currentPage === 0} 
            />
        );

        // Determine the range of page numbers to show
        let startPage = Math.max(0, currentPage - 2);
        let endPage = Math.min(totalPages - 1, currentPage + 2);
        
        // Ensure we always show at least 5 pages if available
        if (endPage - startPage < 4 && totalPages > 5) {
            if (currentPage < 2) {
                // We're at the start, so show more pages after
                endPage = Math.min(totalPages - 1, 4);
            } else if (currentPage > totalPages - 3) {
                // We're at the end, so show more pages before
                startPage = Math.max(0, totalPages - 5);
            }
        }
        
        // Add page numbers
        for (let number = startPage; number <= endPage; number++) {
            items.push(
                <Pagination.Item
                    key={number}
                    active={number === currentPage}
                    onClick={() => handlePageChange(number)}
                >
                    {number + 1}
                </Pagination.Item>
            );
        }
        
        // Add next page
        items.push(
            <Pagination.Next
                key="next"
                onClick={() => handlePageChange(Math.min(totalPages - 1, currentPage + 1))}
                disabled={currentPage === totalPages - 1 || totalPages === 0}
            />
        );
        
        // Add last page
        items.push(
            <Pagination.Last
                key="last"
                onClick={() => handlePageChange(totalPages - 1)}
                disabled={currentPage === totalPages - 1 || totalPages === 0}
            />
        );
        
        return items;
    };

    return (
        <Container className="hotel-list-container mt-4 mb-5">
            <h2 className="section-title mb-4">Khách sạn nổi bật</h2>

            {loading ? (
                <div className="text-center my-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-2">Đang tải danh sách khách sạn...</p>
                </div>
            ) : error ? (
                <div className="text-center my-5 text-danger">
                    <p>Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.</p>
                </div>
            ) : (
                <>
                    <Row xs={1} md={2} lg={3} className="g-4">
                        {hotels && hotels.map((hotel, idx) => (
                            <Col key={hotel.id || idx}>
                                <Card className="hotel-card h-100 shadow-sm">
                                    <div className="hotel-img-container">
                                        <Card.Img
                                            variant="top"
                                            src={getImageUrl(hotel)}
                                            alt={hotel.name}
                                            className="hotel-image"
                                        />
                                        {hotel.discount && (
                                            <Badge bg="danger" className="discount-badge">
                                                -{hotel.discount}%
                                            </Badge>
                                        )}
                                    </div>

                                    <Card.Body>
                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                            <Card.Title className="hotel-title">
                                                <Link to={`/hotels/${hotel.id}`} className="text-decoration-none text-dark">
                                                    {getSafeValue(hotel.name, "Không có tên khách sạn")}
                                                </Link>
                                            </Card.Title>
                                            <div className="rating">
                                                <FontAwesomeIcon icon={faStar} className="star-icon" />
                                                <span>{getSafeValue(hotel.rating, "4.5")}</span>
                                            </div>
                                        </div>

                                        <div className="location mb-2">
                                            <FontAwesomeIcon icon={faMapMarkerAlt} className="location-icon me-1" />
                                            <span>{getSafeValue(hotel.location, "Không có thông tin vị trí")}</span>
                                        </div>

                                        <div className="amenities mb-2">
                                            <FontAwesomeIcon icon={faHotel} className="amenity-icon me-1" />
                                            <span>{getRoomCount(hotel)} phòng có sẵn</span>
                                        </div>

                                        <Card.Text className="hotel-description">
                                            {getSafeValue(hotel.description, "Không có mô tả chi tiết cho khách sạn này.")}
                                        </Card.Text>

                                        <div className="price-section d-flex justify-content-between align-items-center mt-3">
                                            <div>
                                                {hotel.originalPrice && hotel.discount && (
                                                    <span className="original-price">
                                                        {typeof hotel.originalPrice === 'number' 
                                                            ? hotel.originalPrice.toLocaleString('vi-VN')
                                                            : getSafeValue(hotel.originalPrice)}đ
                                                    </span>
                                                )}
                                                <div className="current-price">
                                                    {typeof hotel.price === 'number' 
                                                        ? `${hotel.price.toLocaleString('vi-VN')}đ`
                                                        : getSafeValue(hotel.price, "Liên hệ")} / đêm
                                                </div>
                                            </div>
                                            <Link to={`/hotels/${hotel.id}`}>
                                                <Button variant="primary" className="view-details-btn">
                                                    Chi tiết
                                                </Button>
                                            </Link>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                    
                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="d-flex justify-content-center mt-4">
                            <Pagination>
                                {renderPaginationItems()}
                            </Pagination>
                        </div>
                    )}
                    
                    {/* Pagination Info */}
                    <div className="text-center mt-2">
                        <small className="text-muted">
                            Hiển thị {hotels.length} trong số {totalElements} khách sạn | Trang {currentPage + 1}/{totalPages}
                        </small>
                    </div>
                </>
            )}
        </Container>
    );
};

export default HotelList;