import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './RoomManagement.css';
import { api } from '../../../api/apiConfig';
import defaultRoomImg from '../../../assets/images/default_room.jpg';
import { getRoomById } from '../../../api/roomApi';

const UpdateRoom = () => {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hotels, setHotels] = useState([]);
  const [images, setImages] = useState([]);
  const [currentImages, setCurrentImages] = useState([]);
  const [formData, setFormData] = useState({
    roomNumber: '',
    name: '',
    roomType: '',
    capacity: 1,
    numberOfAdults: 1,
    numberOfChildren: 0,
    numberOfBeds: 1,
    typeBed: 'Single',
    pricePerNight: '',
    description: '',
    amenities: '',
    services: [],
    status: 'AVAILABLE',
    hotelId: '',
  });

  // Fetch room data and hotels on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await Promise.all([
          fetchRoomData(),
          fetchHotels()
        ]);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();

    document.title = 'Update Room - Partner Dashboard'; // Set the document title
  }, [roomId]);

  // Fetch room data
  const fetchRoomData = async () => {
    try {
      const roomData = await getRoomById(roomId);
      if (roomData) {
        // Set current images
        if (roomData.images && roomData.images.length > 0) {
          setCurrentImages(roomData.images);
        }

        // Format the room data to match our form structure
        setFormData({
          roomNumber: roomData.roomNumber || '',
          name: roomData.name || '',
          roomType: roomData.roomType || '',
          capacity: roomData.capacity || 1,
          numberOfAdults: roomData.numberOfAdults || 1,
          numberOfChildren: roomData.numberOfChildren || 0,
          numberOfBeds: roomData.numberOfBeds || 1,
          typeBed: roomData.typeBed || 'Single',
          pricePerNight: roomData.price || '',
          description: roomData.description || '',
          services: Array.isArray(roomData.services) 
            ? roomData.services.map(service => typeof service === 'string' ? service : service.name)
            : [],
          status: roomData.status || 'AVAILABLE',
          hotelId: roomData.hotelId || '',
        });
      } else {
        setError("Failed to load room data. Room not found.");
      }
    } catch (err) {
      console.error("Error fetching room:", err);
      throw err;
    }
  };

  // Fetch hotels
  const fetchHotels = async () => {
    try {
      const response = await api.get('/api/partner/hotels');
      if (response.data && Array.isArray(response.data.content)) {
        setHotels(response.data.content);
      } else {
        setError('Failed to fetch hotels. Invalid response format.');
      }
    } catch (err) {
      console.error("Error fetching hotels:", err);
      throw err;
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      setFormData(prev => ({
        ...prev,
        [name]: Number(value)
      }));
    } else if (name === 'services') {
      // Handle services as a comma-separated list
      const servicesList = value.split(',').map(item => item.trim()).filter(item => item !== '');
      setFormData(prev => ({
        ...prev,
        services: servicesList
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  // Form validation
  const validateForm = () => {
    const errors = {};
    
    if (!formData.roomNumber) errors.roomNumber = "Room number is required";
    if (!formData.name) errors.name = "Room name is required";
    if (!formData.roomType) errors.roomType = "Room type is required";
    if (!formData.hotelId) errors.hotelId = "Hotel selection is required";
    if (!formData.pricePerNight) errors.pricePerNight = "Price per night is required";
    if (Number(formData.pricePerNight) <= 0) errors.pricePerNight = "Price must be greater than 0";
    
    return Object.keys(errors).length === 0 ? null : errors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (errors) {
      setError(errors);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Update the room
      await api.put(`/api/partner/hotels/${formData.hotelId}/rooms/${roomId}`, formData);
      
      // If we have new images
      if (images.length > 0) {
        const imageFormData = new FormData();
        
        images.forEach(image => {
          imageFormData.append('images', image);
        });
        
        // Upload images
        await api.post(`/api/partner/hotels/${formData.hotelId}/rooms/${roomId}/images`, imageFormData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }
      
      alert('Room updated successfully!');
      navigate(`/partner/room-management?hotelId=${formData.hotelId}`);
    } catch (err) {
      console.error('Error updating room:', err);
      setError(err.response?.data?.message || 'Failed to update room. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Get image URL
  const getImageUrl = (image) => {
    if (!image || !image.url) {
      return defaultRoomImg;
    }

    return image.url.startsWith('http') ? image.url : defaultRoomImg;
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        Loading...
      </div>
    );
  }

  return (
    <div className="room-management">
      <div className="page-header">
        <button 
          className="back-button"
          onClick={() => navigate('/partner/room-management')}
        >
          ← Back to Room Management
        </button>
        <h1>Update Room</h1>
      </div>

      {/* Error display */}
      {error && typeof error === 'string' && (
        <div className="error-message">{error}</div>
      )}

      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h2>Basic Information</h2>
            
            <div className="form-group">
              <label htmlFor="hotelId">Select Hotel*</label>
              <select
                id="hotelId"
                name="hotelId"
                value={formData.hotelId}
                onChange={handleInputChange}
                className={error?.hotelId ? "error" : ""}
                required
              >
                <option value="">-- Select a Hotel --</option>
                {hotels.map(hotel => (
                  <option key={hotel.id} value={hotel.id}>{hotel.name}</option>
                ))}
              </select>
              {error?.hotelId && <div className="error-text">{error.hotelId}</div>}
            </div>

            <div className="form-row">
              <div className="form-group half-width">
                <label htmlFor="roomNumber">Room Number*</label>
                <input
                  type="text"
                  id="roomNumber"
                  name="roomNumber"
                  value={formData.roomNumber}
                  onChange={handleInputChange}
                  className={error?.roomNumber ? "error" : ""}
                  placeholder="e.g., 101"
                  required
                />
                {error?.roomNumber && <div className="error-text">{error.roomNumber}</div>}
              </div>
              
              <div className="form-group half-width">
                <label htmlFor="name">Room Name*</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={error?.name ? "error" : ""}
                  placeholder="e.g., Deluxe Double Room"
                  required
                />
                {error?.name && <div className="error-text">{error.name}</div>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group half-width">
                <label htmlFor="roomType">Room Type*</label>
                <select
                  id="roomType"
                  name="roomType"
                  value={formData.roomType}
                  onChange={handleInputChange}
                  className={error?.roomType ? "error" : ""}
                  required
                >
                  <option value="">-- Select Room Type --</option>
                  <option value="Standard">Standard</option>
                  <option value="Deluxe">Deluxe</option>
                  <option value="Suite">Suite</option>
                  <option value="Executive">Executive</option>
                  <option value="Presidential">Presidential</option>
                </select>
                {error?.roomType && <div className="error-text">{error.roomType}</div>}
              </div>
              
              <div className="form-group half-width">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <option value="AVAILABLE">Available</option>
                  <option value="BOOKED">Booked</option>
                  <option value="MAINTENANCE">Maintenance</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                placeholder="Provide a detailed description of the room..."
              />
            </div>
            
            <div className="form-group">
              <label>Current Room Images</label>
              {currentImages.length > 0 ? (
                <div className="hotel-images-grid">
                  {currentImages.map((image, index) => (
                    <div key={index} className="hotel-image-item">
                      <img src={getImageUrl(image)} alt={`Room ${index + 1}`} />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-images">No images available</p>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="images">Upload New Images</label>
              <input
                type="file"
                id="images"
                name="images"
                onChange={handleImageUpload}
                multiple
                className="file-upload"
                accept="image/*"
              />
              <div className="upload-info">
                Upload up to 5 images (JPEG, PNG, WebP)
              </div>
              {images.length > 0 && (
                <div className="selected-files">
                  {images.length} new file(s) selected
                </div>
              )}
            </div>
          </div>

          <div className="form-section">
            <h2>Capacity and Bed Details</h2>
            
            <div className="form-row">
              <div className="form-group third-width">
                <label htmlFor="numberOfAdults">Max Adults</label>
                <input
                  type="number"
                  id="numberOfAdults"
                  name="numberOfAdults"
                  min="1"
                  max="10"
                  value={formData.numberOfAdults}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="form-group third-width">
                <label htmlFor="numberOfChildren">Max Children</label>
                <input
                  type="number"
                  id="numberOfChildren"
                  name="numberOfChildren"
                  min="0"
                  max="6"
                  value={formData.numberOfChildren}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="form-group third-width">
                <label htmlFor="numberOfBeds">Number of Beds</label>
                <input
                  type="number"
                  id="numberOfBeds"
                  name="numberOfBeds"
                  min="1"
                  max="5"
                  value={formData.numberOfBeds}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group half-width">
                <label htmlFor="typeBed">Bed Type</label>
                <select
                  id="typeBed"
                  name="typeBed"
                  value={formData.typeBed}
                  onChange={handleInputChange}
                >
                  <option value="Single">Single</option>
                  <option value="Double">Double</option>
                  <option value="Queen">Queen</option>
                  <option value="King">King</option>
                  <option value="Twin">Twin</option>
                </select>
              </div>
              
              <div className="form-group half-width">
                <label htmlFor="pricePerNight">Price Per Night ($)*</label>
                <input
                  type="number"
                  id="pricePerNight"
                  name="pricePerNight"
                  min="0"
                  step="0.01"
                  value={formData.pricePerNight}
                  onChange={handleInputChange}
                  className={error?.pricePerNight ? "error" : ""}
                  required
                />
                {error?.pricePerNight && <div className="error-text">{error.pricePerNight}</div>}
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Amenities and Services</h2>
            
            <div className="form-group">
              <label htmlFor="services">Services (comma separated)</label>
              <input
                type="text"
                id="services"
                name="services"
                value={formData.services.join(', ')}
                onChange={handleInputChange}
                placeholder="WiFi, TV, Mini-bar, Air-conditioning, etc."
              />
            </div>
          </div>
          
          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-button"
              onClick={() => navigate('/partner/room-management')}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="submit-button"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Room"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateRoom;