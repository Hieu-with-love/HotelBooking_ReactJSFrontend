import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import './HotelManagement.css';
import defaultHotelImg from '../../../assets/images/default_hotel_img.jpeg'; // Default image for hotels

const HotelManagement = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newHotel, setNewHotel] = useState({
    name: '',
    address: '',
    city: '',
    description: '',
    amenities: '',
    imageUrl: ''
  });
  const { currentUser } = useAuth();

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      setLoading(true);
      // Replace this with your actual API call
      // const response = await fetch('/api/partner/hotels', {
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem('jwt')}`
      //   }
      // });
      // const data = await response.json();
      // For demo, using mock data
      const mockData = [
        {
          id: 1,
          name: 'Grand Hotel',
          address: '123 Main St',
          city: 'New York',
          rating: 4.5,
          numRooms: 25,
          imageUrl: '/assets/images/default_hotel_img.jpeg'
        },
        {
          id: 2,
          name: 'Seaside Resort',
          address: '45 Beach Rd',
          city: 'Miami',
          rating: 4.8,
          numRooms: 42,
          imageUrl: '/assets/images/default_hotel_img.jpeg'
        }
      ];
      
      setTimeout(() => {
        setHotels(mockData);
        setLoading(false);
      }, 500);
    } catch (err) {
      setError('Failed to fetch hotels. Please try again.');
      setLoading(false);
      console.error(err);
    }
  };

  const handleAddHotel = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      // Replace with actual API call
      // const response = await fetch('/api/partner/hotels', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('jwt')}`
      //   },
      //   body: JSON.stringify(newHotel)
      // });
      // const data = await response.json();
      
      // Mock adding a hotel
      const mockNewHotel = {
        ...newHotel,
        id: hotels.length + 1,
        rating: 0,
        numRooms: 0,
        imageUrl: newHotel.imageUrl || '/assets/images/default_hotel_img.jpeg'
      };
      
      setHotels([...hotels, mockNewHotel]);
      setShowAddModal(false);
      setNewHotel({
        name: '',
        address: '',
        city: '',
        description: '',
        amenities: '',
        imageUrl: ''
      });
    } catch (err) {
      setError('Failed to add hotel. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteHotel = async (id) => {
    if (window.confirm('Are you sure you want to delete this hotel?')) {
      try {
        setLoading(true);
        // Replace with actual API call
        // await fetch(`/api/partner/hotels/${id}`, {
        //   method: 'DELETE',
        //   headers: {
        //     'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        //   }
        // });
        
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewHotel({
      ...newHotel,
      [name]: value
    });
  };

  // Function to get image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return defaultHotelImg;
    
    // If it's already a full URL (Cloudinary), use it directly
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    return defaultHotelImg;
  };

  return (
    <div className="hotel-management">
      <div className="page-header">
        <h1>Hotel Management</h1>
        <button 
          className="btn-primary"
          onClick={() => setShowAddModal(true)}
        >
          <span className="material-icons">add</span> Add New Hotel
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading && hotels.length === 0 ? (
        <div className="loading">Loading hotels...</div>
      ) : hotels.length === 0 ? (
        <div className="empty-state">
          <span className="material-icons">hotel</span>
          <h3>No Hotels Found</h3>
          <p>You haven't added any hotels yet. Click the "Add New Hotel" button to get started.</p>
        </div>
      ) : (
        <div className="hotel-grid">
          {hotels.map(hotel => (
            <div className="hotel-card" key={hotel.id}>
              <div className="hotel-image">
                <img src={hotel.imageUrl} alt={hotel.name} />
              </div>
              <div className="hotel-details">
                <h3>{hotel.name}</h3>
                <p><strong>Location:</strong> {hotel.city}</p>
                <p><strong>Address:</strong> {hotel.address}</p>
                <p><strong>Rooms:</strong> {hotel.numRooms}</p>
                <p><strong>Rating:</strong> {hotel.rating} ★</p>
              </div>
              <div className="hotel-actions">
                <Link to={`/partner/hotel-management/edit/${hotel.id}`} className="btn-edit">
                  <span className="material-icons">edit</span>
                </Link>
                <button 
                  className="btn-delete"
                  onClick={() => handleDeleteHotel(hotel.id)}
                >
                  <span className="material-icons">delete</span>
                </button>
                <Link to={`/partner/room-management?hotelId=${hotel.id}`} className="btn-rooms">
                  <span className="material-icons">meeting_room</span> Manage Rooms
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Hotel Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Add New Hotel</h2>
              <button 
                className="modal-close"
                onClick={() => setShowAddModal(false)}
              >
                <span className="material-icons">close</span>
              </button>
            </div>
            <form onSubmit={handleAddHotel}>
              <div className="form-group">
                <label htmlFor="name">Hotel Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newHotel.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="address">Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={newHotel.address}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="city">City</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={newHotel.city}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={newHotel.description}
                  onChange={handleInputChange}
                  rows="4"
                ></textarea>
              </div>
              
              <div className="form-group">
                <label htmlFor="amenities">Amenities (comma separated)</label>
                <input
                  type="text"
                  id="amenities"
                  name="amenities"
                  value={newHotel.amenities}
                  onChange={handleInputChange}
                  placeholder="WiFi, Pool, Spa, etc."
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="imageUrl">Image URL</label>
                <input
                  type="text"
                  id="imageUrl"
                  name="imageUrl"
                  value={newHotel.imageUrl}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              
              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Add Hotel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelManagement;