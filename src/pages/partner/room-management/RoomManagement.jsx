import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import './RoomManagement.css';

const RoomManagement = () => {
  const [rooms, setRooms] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [selectedHotelId, setSelectedHotelId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRoom, setNewRoom] = useState({
    roomNumber: '',
    roomType: '',
    capacity: 1,
    pricePerNight: '',
    description: '',
    amenities: '',
    status: 'available',
    hotelId: null,
    imageUrl: ''
  });
  
  const { currentUser } = useAuth();
  const location = useLocation();

  useEffect(() => {
    fetchHotels();
    
    // Get hotelId from URL query params if available
    const params = new URLSearchParams(location.search);
    const hotelId = params.get('hotelId');
    if (hotelId) {
      setSelectedHotelId(Number(hotelId));
    }
  }, [location.search]);

  useEffect(() => {
    if (selectedHotelId) {
      fetchRoomsByHotel(selectedHotelId);
    } else if (hotels.length > 0) {
      setSelectedHotelId(hotels[0].id);
    }
  }, [selectedHotelId, hotels]);

  // When a hotel is selected in the add room modal, update the newRoom state
  useEffect(() => {
    if (selectedHotelId) {
      setNewRoom(prev => ({ ...prev, hotelId: selectedHotelId }));
    }
  }, [selectedHotelId]);

  const fetchHotels = async () => {
    try {
      setLoading(true);
      // Replace with actual API call
      // const response = await fetch('/api/partner/hotels', {
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem('jwt')}`
      //   }
      // });
      // const data = await response.json();
      
      // Mock data for hotels
      const mockData = [
        {
          id: 1,
          name: 'Grand Hotel',
          address: '123 Main St',
          city: 'New York'
        },
        {
          id: 2,
          name: 'Seaside Resort',
          address: '45 Beach Rd',
          city: 'Miami'
        }
      ];
      
      setHotels(mockData);
      if (mockData.length > 0 && !selectedHotelId) {
        setSelectedHotelId(mockData[0].id);
      }
    } catch (err) {
      setError('Failed to fetch hotels. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoomsByHotel = async (hotelId) => {
    try {
      setLoading(true);
      // Replace with actual API call
      // const response = await fetch(`/api/partner/hotels/${hotelId}/rooms`, {
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem('jwt')}`
      //   }
      // });
      // const data = await response.json();
      
      // Mock data for rooms
      const mockData = hotelId === 1 ? 
        [
          {
            id: 1,
            roomNumber: '101',
            roomType: 'Deluxe',
            capacity: 2,
            pricePerNight: 150,
            status: 'available',
            hotelId: 1,
            imageUrl: '/assets/images/default_hotel_img.jpeg'
          },
          {
            id: 2,
            roomNumber: '102',
            roomType: 'Suite',
            capacity: 4,
            pricePerNight: 300,
            status: 'booked',
            hotelId: 1,
            imageUrl: '/assets/images/default_hotel_img.jpeg'
          }
        ] : 
        [
          {
            id: 3,
            roomNumber: '201',
            roomType: 'Standard',
            capacity: 2,
            pricePerNight: 120,
            status: 'available',
            hotelId: 2,
            imageUrl: '/assets/images/default_hotel_img.jpeg'
          }
        ];
      
      setRooms(mockData);
    } catch (err) {
      setError('Failed to fetch rooms. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRoom = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      // Replace with actual API call
      // const response = await fetch(`/api/partner/hotels/${selectedHotelId}/rooms`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('jwt')}`
      //   },
      //   body: JSON.stringify(newRoom)
      // });
      // const data = await response.json();
      
      // Mock adding a room
      const mockNewRoom = {
        ...newRoom,
        id: Math.floor(Math.random() * 1000) + 10,
        imageUrl: newRoom.imageUrl || '/assets/images/default_hotel_img.jpeg'
      };
      
      setRooms([...rooms, mockNewRoom]);
      setShowAddModal(false);
      setNewRoom({
        roomNumber: '',
        roomType: '',
        capacity: 1,
        pricePerNight: '',
        description: '',
        amenities: '',
        status: 'available',
        hotelId: selectedHotelId,
        imageUrl: ''
      });
    } catch (err) {
      setError('Failed to add room. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRoom = async (roomId) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      try {
        setLoading(true);
        // Replace with actual API call
        // await fetch(`/api/partner/rooms/${roomId}`, {
        //   method: 'DELETE',
        //   headers: {
        //     'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        //   }
        // });
        
        // Mock deletion
        setRooms(rooms.filter(room => room.id !== roomId));
      } catch (err) {
        setError('Failed to delete room. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRoom({
      ...newRoom,
      [name]: name === 'capacity' || name === 'pricePerNight' ? Number(value) : value
    });
  };

  const handleHotelChange = (e) => {
    const hotelId = Number(e.target.value);
    setSelectedHotelId(hotelId);
  };

  // Get the current hotel name
  const selectedHotel = hotels.find(hotel => hotel.id === selectedHotelId);

  return (
    <div className="room-management">
      <div className="page-header">
        <h1>Room Management</h1>
        <button 
          className="btn-primary"
          onClick={() => setShowAddModal(true)}
        >
          <span className="material-icons">add</span> Add New Room
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}
      
      <div className="hotel-selector">
        <label>Select Hotel:</label>
        <select value={selectedHotelId || ''} onChange={handleHotelChange}>
          {hotels.map(hotel => (
            <option key={hotel.id} value={hotel.id}>{hotel.name}</option>
          ))}
        </select>
      </div>

      {loading && rooms.length === 0 ? (
        <div className="loading">Loading rooms...</div>
      ) : rooms.length === 0 ? (
        <div className="empty-state">
          <span className="material-icons">meeting_room</span>
          <h3>No Rooms Found</h3>
          <p>You haven't added any rooms to {selectedHotel?.name || 'this hotel'} yet. Click the "Add New Room" button to get started.</p>
        </div>
      ) : (
        <div className="room-table-container">
          <table className="room-table">
            <thead>
              <tr>
                <th>Room #</th>
                <th>Type</th>
                <th>Capacity</th>
                <th>Price/Night</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map(room => (
                <tr key={room.id} className={room.status === 'booked' ? 'booked-room' : ''}>
                  <td>{room.roomNumber}</td>
                  <td>{room.roomType}</td>
                  <td>{room.capacity} {room.capacity > 1 ? 'persons' : 'person'}</td>
                  <td>${room.pricePerNight.toFixed(2)}</td>
                  <td><span className={`status-badge ${room.status}`}>{room.status}</span></td>
                  <td className="actions">
                    <button className="btn-edit" onClick={() => console.log(`Edit room ${room.id}`)}>
                      <span className="material-icons">edit</span>
                    </button>
                    <button 
                      className="btn-delete"
                      onClick={() => handleDeleteRoom(room.id)}
                    >
                      <span className="material-icons">delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Room Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Add New Room</h2>
              <button 
                className="modal-close"
                onClick={() => setShowAddModal(false)}
              >
                <span className="material-icons">close</span>
              </button>
            </div>
            <form onSubmit={handleAddRoom}>
              <div className="form-group">
                <label htmlFor="hotelId">Select Hotel</label>
                <select
                  id="hotelId"
                  name="hotelId"
                  value={newRoom.hotelId || ''}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">-- Select a Hotel --</option>
                  {hotels.map(hotel => (
                    <option key={hotel.id} value={hotel.id}>{hotel.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="roomNumber">Room Number</label>
                <input
                  type="text"
                  id="roomNumber"
                  name="roomNumber"
                  value={newRoom.roomNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="roomType">Room Type</label>
                <select
                  id="roomType"
                  name="roomType"
                  value={newRoom.roomType}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">-- Select Room Type --</option>
                  <option value="Standard">Standard</option>
                  <option value="Deluxe">Deluxe</option>
                  <option value="Suite">Suite</option>
                  <option value="Executive">Executive</option>
                  <option value="Presidential">Presidential</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="capacity">Capacity (Persons)</label>
                <input
                  type="number"
                  id="capacity"
                  name="capacity"
                  min="1"
                  max="10"
                  value={newRoom.capacity}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="pricePerNight">Price Per Night ($)</label>
                <input
                  type="number"
                  id="pricePerNight"
                  name="pricePerNight"
                  min="0"
                  step="0.01"
                  value={newRoom.pricePerNight}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={newRoom.description}
                  onChange={handleInputChange}
                  rows="3"
                ></textarea>
              </div>
              
              <div className="form-group">
                <label htmlFor="amenities">Amenities (comma separated)</label>
                <input
                  type="text"
                  id="amenities"
                  name="amenities"
                  value={newRoom.amenities}
                  onChange={handleInputChange}
                  placeholder="WiFi, TV, Mini-bar, etc."
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  name="status"
                  value={newRoom.status}
                  onChange={handleInputChange}
                >
                  <option value="available">Available</option>
                  <option value="booked">Booked</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="imageUrl">Image URL</label>
                <input
                  type="text"
                  id="imageUrl"
                  name="imageUrl"
                  value={newRoom.imageUrl}
                  onChange={handleInputChange}
                  placeholder="https://example.com/room.jpg"
                />
              </div>
              
              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Add Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomManagement;