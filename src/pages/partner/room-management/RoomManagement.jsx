import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import './RoomManagement.css';

const RoomManagement = () => {
  const [rooms, setRooms] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [selectedHotelId, setSelectedHotelId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { currentUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    fetchHotels();
    
    // Get hotelId from URL query params if available
    const params = new URLSearchParams(location.search);
    const hotelId = params.get('hotelId');
    if (hotelId) {
      setSelectedHotelId(Number(hotelId));
    }

    document.title = 'Room Management - Partner Dashboard'; // Set the document title
  }, [location.search]);

  useEffect(() => {
    if (selectedHotelId) {
      fetchRoomsByHotel(selectedHotelId);
    } else if (hotels.length > 0) {
      setSelectedHotelId(hotels[0].id);
    }
  }, [selectedHotelId, hotels]);

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

  const handleHotelChange = (e) => {
    const hotelId = Number(e.target.value);
    setSelectedHotelId(hotelId);
  };

  const handleAddNewRoom = () => {
    // Navigate to the create room page with the selected hotel ID as a query parameter
    navigate(`/partner/room-management/create?hotelId=${selectedHotelId}`);
  };

  const handleEditRoom = (roomId) => {
    // Navigate to the update room page
    navigate(`/partner/room-management/update/${roomId}`);
  };

  // Get the current hotel name
  const selectedHotel = hotels.find(hotel => hotel.id === selectedHotelId);

  return (
    <div className="room-management">
      <div className="page-header">
        <h1>Room Management</h1>
        <button 
          className="btn-primary"
          onClick={handleAddNewRoom}
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
                    <button className="btn-edit" onClick={() => handleEditRoom(room.id)}>
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
    </div>
  );
};

export default RoomManagement;