import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './HotelManagement.css';
import defaultHotelImg from '../../../assets/images/default_hotel_img.jpeg'; // Default image for hotels
import { getHotels } from '../../../api/hotelApi';

const HotelManagement = () => {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10); // Set the default page size
  const [totalPages, setTotalPages] = useState(0); // Total number of pages
  const [totalElements, setTotalElements] = useState(0); // Total number of elements
  const [numberOfElements, setNumberOfElements] = useState(0); // Number of elements in the current page
  
  useEffect(() => {
    fetchHotels();
  }, [currentPage, pageSize]);

  const fetchHotels = async () => {
    try {
      setLoading(true);
      const fetchedPaginationHotels = await getHotels(currentPage, pageSize);
      console.log("Fetched hotels:", fetchedPaginationHotels.content);
      
      setTimeout(() => {
        setHotels(fetchedPaginationHotels.content);
        setTotalPages(fetchedPaginationHotels.totalPages);
        setTotalElements(fetchedPaginationHotels.totalElements);
        setNumberOfElements(fetchedPaginationHotels.numberOfElements);
        setLoading(false);
      }, 500);
    } catch (err) {
      setError('Failed to fetch hotels. Please try again.');
      setLoading(false);
      console.error(err);
    }
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Handle page size change
  const handlePageSizeChange = (event) => {
    setPageSize(parseInt(event.target.value));
    setCurrentPage(0); // Reset to first page when changing page size
  };

  const handleDeleteHotel = async (id) => {
    if (window.confirm('Are you sure you want to delete this hotel?')) {
      try {
        setLoading(true);
        // Mock deletion
        setHotels(hotels.filter(hotel => hotel.id !== id));
      } catch (err) {
        setError('Failed to delete hotel. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  // Function to get image URL
  const getImageUrl = (imagePath) => {
    if (imagePath.startsWith('https')) {
      return imagePath;
    }
    
    return defaultHotelImg;
  };

  return (
    <div className="hotel-management">
      <div className="page-header">
        <div className="page-title">
          <h1><span className="material-icons">apartment</span> Hotel Management</h1>
          <p>Add, edit and manage your hotel properties</p>
        </div>
        <button 
          className="btn-primary"
          onClick={() => navigate('/partner/hotel-management/create-hotel')}
        >
          <span className="material-icons">add</span> Add New Hotel
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading && hotels.length === 0 ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading hotels...</p>
        </div>
      ) : hotels.length === 0 ? (
        <div className="empty-state">
          <span className="material-icons">hotel</span>
          <h3>No Hotels Found</h3>
          <p>You haven't added any hotels yet. Click the "Add New Hotel" button to get started.</p>
        </div>
      ) : (
        <>
          <div className="hotel-grid">
            {hotels.map(hotel => (
              <div className="hotel-card" key={hotel.id}>
                <div className="hotel-image">
                  <img src={getImageUrl(hotel.images && hotel.images.length > 0 ? hotel.images[0].url : '')} alt={hotel.name} />
                  <div className="hotel-rating">
                    {/* <span className="material-icons">star</span>
                    <span>{hotel.rating.toFixed(1)}</span> */}
                  </div>
                </div>
                <div className="hotel-details">
                  <h3>{hotel.name} - {hotel.businessName}</h3>
                  <div className="hotel-info">
                    <p className="hotel-location">
                      <span className="material-icons">location_on</span>
                      {hotel.address?.city}
                    </p>
                    <p className="hotel-address">
                      <span className="material-icons">home</span>
                      {hotel.address?.number} {hotel.address?.street}, {hotel.address?.district}
                    </p>
                    <p className="hotel-rooms">
                      <span className="material-icons">meeting_room</span>
                      {hotel.rooms ? hotel.rooms.length : (hotel.numRooms || 0)} Rooms
                    </p>
                  </div>
                </div>
                <div className="hotel-actions">
                  <div className='action-buttons'>
                  <Link to={`/partner/hotel-management/edit/${hotel.id}`} className="btn-edit">
                    <span className="material-icons">edit</span>
                    Edit
                  </Link>
                  <button 
                    className="btn-delete"
                    onClick={() => handleDeleteHotel(hotel.id)}
                  >
                    <span className="material-icons">delete</span>
                    Delete
                  </button>
                  </div>
                  <Link to={`/partner/room-management?hotelId=${hotel.id}`} className="btn-rooms">
                    <span className="material-icons">meeting_room</span> Manage Rooms
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          {/* Pagination Controls */}
          <div className="pagination-container">
            <div className="pagination-info">
              Showing {numberOfElements} of {totalElements} hotels
            </div>
            
            <div className="pagination-controls">
              <button 
                className="pagination-button" 
                onClick={() => handlePageChange(0)}
                disabled={currentPage === 0}
              >
                <span className="material-icons">first_page</span>
              </button>
              
              <button 
                className="pagination-button" 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
              >
                <span className="material-icons">chevron_left</span>
              </button>
              
              <span className="pagination-text">
                Page {currentPage + 1} of {totalPages}
              </span>
              
              <button 
                className="pagination-button" 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages - 1}
              >
                <span className="material-icons">chevron_right</span>
              </button>
              
              <button 
                className="pagination-button" 
                onClick={() => handlePageChange(totalPages - 1)}
                disabled={currentPage === totalPages - 1}
              >
                <span className="material-icons">last_page</span>
              </button>
              
              <select 
                className="page-size-select" 
                value={pageSize} 
                onChange={handlePageSizeChange}
              >
                <option value="5">5 per page</option>
                <option value="10">10 per page</option>
                <option value="20">20 per page</option>
                <option value="50">50 per page</option>
              </select>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default HotelManagement;