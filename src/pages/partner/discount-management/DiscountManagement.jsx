import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import './DiscountManagement.css';

const DiscountManagement = () => {
  const [discounts, setDiscounts] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDiscount, setNewDiscount] = useState({
    name: '',
    code: '',
    discountType: 'percentage', // 'percentage' or 'fixed'
    value: '',
    startDate: '',
    endDate: '',
    appliesTo: 'all', // 'all', 'hotel', 'room'
    hotelId: '',
    roomId: '',
    minStay: 1,
    maxUses: '',
    description: ''
  });
  
  const { currentUser } = useAuth();

  useEffect(() => {
    fetchHotels();
    fetchDiscounts();
  }, []);

  const fetchHotels = async () => {
    try {
      // Replace with actual API call
      // const response = await fetch('/api/partner/hotels', {
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem('jwt')}`
      //   }
      // });
      // const data = await response.json();
      
      // Mock data
      const mockData = [
        {
          id: 1,
          name: 'Grand Hotel',
          rooms: [
            { id: 1, roomNumber: '101', roomType: 'Deluxe' },
            { id: 2, roomNumber: '102', roomType: 'Suite' }
          ]
        },
        {
          id: 2,
          name: 'Seaside Resort',
          rooms: [
            { id: 3, roomNumber: '201', roomType: 'Standard' }
          ]
        }
      ];
      
      setHotels(mockData);
    } catch (err) {
      setError('Failed to fetch hotels. Please try again.');
      console.error(err);
    }
  };

  const fetchDiscounts = async () => {
    try {
      setLoading(true);
      // Replace with actual API call
      // const response = await fetch('/api/partner/discounts', {
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem('jwt')}`
      //   }
      // });
      // const data = await response.json();
      
      // Mock data
      const mockData = [
        {
          id: 1,
          name: 'Summer Special',
          code: 'SUMMER2025',
          discountType: 'percentage',
          value: 15,
          startDate: '2025-06-01',
          endDate: '2025-08-31',
          appliesTo: 'all',
          minStay: 2,
          maxUses: 100,
          usedCount: 24,
          description: 'Summer season discount',
          status: 'active'
        },
        {
          id: 2,
          name: 'Weekend Getaway',
          code: 'WEEKEND25',
          discountType: 'fixed',
          value: 25,
          startDate: '2025-05-01',
          endDate: '2025-12-31',
          appliesTo: 'hotel',
          hotelId: 1,
          minStay: 1,
          maxUses: 50,
          usedCount: 12,
          description: 'Fixed discount for weekend bookings',
          status: 'active'
        },
        {
          id: 3,
          name: 'Suite Promotion',
          code: 'SUITE20',
          discountType: 'percentage',
          value: 20,
          startDate: '2025-01-01',
          endDate: '2025-03-31',
          appliesTo: 'room',
          hotelId: 1,
          roomId: 2,
          minStay: 3,
          maxUses: 30,
          usedCount: 30,
          description: 'Discount for suite bookings',
          status: 'expired'
        }
      ];
      
      setTimeout(() => {
        setDiscounts(mockData);
        setLoading(false);
      }, 500);
    } catch (err) {
      setError('Failed to fetch discounts. Please try again.');
      setLoading(false);
      console.error(err);
    }
  };
  
  const handleAddDiscount = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      // Replace with actual API call
      // const response = await fetch('/api/partner/discounts', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('jwt')}`
      //   },
      //   body: JSON.stringify(newDiscount)
      // });
      // const data = await response.json();
      
      // Mock adding a discount
      const mockNewDiscount = {
        ...newDiscount,
        id: Math.floor(Math.random() * 1000) + 10,
        usedCount: 0,
        status: new Date(newDiscount.startDate) > new Date() ? 'scheduled' : 
                new Date(newDiscount.endDate) < new Date() ? 'expired' : 'active'
      };
      
      setDiscounts([...discounts, mockNewDiscount]);
      setShowAddModal(false);
      setNewDiscount({
        name: '',
        code: '',
        discountType: 'percentage',
        value: '',
        startDate: '',
        endDate: '',
        appliesTo: 'all',
        hotelId: '',
        roomId: '',
        minStay: 1,
        maxUses: '',
        description: ''
      });
    } catch (err) {
      setError('Failed to add discount. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDiscount = async (id) => {
    if (window.confirm('Are you sure you want to delete this discount?')) {
      try {
        setLoading(true);
        // Replace with actual API call
        // await fetch(`/api/partner/discounts/${id}`, {
        //   method: 'DELETE',
        //   headers: {
        //     'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        //   }
        // });
        
        // Mock deletion
        setDiscounts(discounts.filter(discount => discount.id !== id));
      } catch (err) {
        setError('Failed to delete discount. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDiscount({
      ...newDiscount,
      [name]: name === 'value' || name === 'minStay' || name === 'maxUses' ? 
              (value === '' ? '' : Number(value)) : value
    });
  };

  const handleAppliesChange = (e) => {
    const { value } = e.target;
    setNewDiscount({
      ...newDiscount,
      appliesTo: value,
      // Reset related fields when appliesTo changes
      hotelId: value === 'all' ? '' : newDiscount.hotelId,
      roomId: value !== 'room' ? '' : newDiscount.roomId
    });
  };

  const handleHotelChange = (e) => {
    const { value } = e.target;
    setNewDiscount({
      ...newDiscount,
      hotelId: value,
      // Reset room selection when hotel changes
      roomId: ''
    });
  };

  const getDiscountAppliesString = (discount) => {
    if (discount.appliesTo === 'all') {
      return 'All hotels and rooms';
    } else if (discount.appliesTo === 'hotel') {
      const hotel = hotels.find(h => h.id === discount.hotelId);
      return hotel ? `Hotel: ${hotel.name}` : 'Specific hotel';
    } else if (discount.appliesTo === 'room') {
      const hotel = hotels.find(h => h.id === discount.hotelId);
      if (!hotel) return 'Specific room';
      
      const room = hotel.rooms.find(r => r.id === discount.roomId);
      return room ? `${hotel.name}, Room ${room.roomNumber} (${room.roomType})` : 'Specific room';
    }
    return 'Unknown';
  };
  
  // Get available rooms for selected hotel
  const availableRooms = newDiscount.hotelId ? 
    (hotels.find(h => h.id === Number(newDiscount.hotelId))?.rooms || []) : [];

  return (
    <div className="discount-management">
      <div className="page-header">
        <h1>Discount Management</h1>
        <button 
          className="btn-primary"
          onClick={() => setShowAddModal(true)}
        >
          <span className="material-icons">add</span> Create New Discount
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading && discounts.length === 0 ? (
        <div className="loading">Loading discounts...</div>
      ) : discounts.length === 0 ? (
        <div className="empty-state">
          <span className="material-icons">local_offer</span>
          <h3>No Discounts Found</h3>
          <p>You haven't created any discounts yet. Click the "Create New Discount" button to get started.</p>
        </div>
      ) : (
        <div className="discount-table-container">
          <table className="discount-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Code</th>
                <th>Discount</th>
                <th>Validity Period</th>
                <th>Applies To</th>
                <th>Usage</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {discounts.map(discount => (
                <tr key={discount.id} className={discount.status === 'expired' ? 'expired-discount' : ''}>
                  <td>{discount.name}</td>
                  <td><code>{discount.code}</code></td>
                  <td>
                    {discount.discountType === 'percentage' ? 
                      `${discount.value}%` : `$${discount.value.toFixed(2)}`}
                  </td>
                  <td>
                    {new Date(discount.startDate).toLocaleDateString()} - {new Date(discount.endDate).toLocaleDateString()}
                  </td>
                  <td>{getDiscountAppliesString(discount)}</td>
                  <td>
                    {discount.usedCount} / {discount.maxUses || '∞'}
                  </td>
                  <td><span className={`status-badge ${discount.status}`}>{discount.status}</span></td>
                  <td className="actions">
                    <button className="btn-edit" onClick={() => console.log(`Edit discount ${discount.id}`)}>
                      <span className="material-icons">edit</span>
                    </button>
                    <button 
                      className="btn-delete"
                      onClick={() => handleDeleteDiscount(discount.id)}
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

      {/* Add Discount Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content discount-modal">
            <div className="modal-header">
              <h2>Create New Discount</h2>
              <button 
                className="modal-close"
                onClick={() => setShowAddModal(false)}
              >
                <span className="material-icons">close</span>
              </button>
            </div>
            <form onSubmit={handleAddDiscount}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Discount Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={newDiscount.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Summer Special"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="code">Discount Code</label>
                  <input
                    type="text"
                    id="code"
                    name="code"
                    value={newDiscount.code}
                    onChange={handleInputChange}
                    placeholder="e.g. SUMMER25"
                    required
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="discountType">Discount Type</label>
                  <select
                    id="discountType"
                    name="discountType"
                    value={newDiscount.discountType}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="value">
                    {newDiscount.discountType === 'percentage' ? 'Percentage (%)' : 'Amount ($)'}
                  </label>
                  <input
                    type="number"
                    id="value"
                    name="value"
                    value={newDiscount.value}
                    onChange={handleInputChange}
                    placeholder={newDiscount.discountType === 'percentage' ? "e.g. 15" : "e.g. 25"}
                    min="0"
                    max={newDiscount.discountType === 'percentage' ? "100" : ""}
                    step={newDiscount.discountType === 'percentage' ? "1" : "0.01"}
                    required
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="startDate">Start Date</label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={newDiscount.startDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="endDate">End Date</label>
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={newDiscount.endDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="appliesTo">Applies To</label>
                <select
                  id="appliesTo"
                  name="appliesTo"
                  value={newDiscount.appliesTo}
                  onChange={handleAppliesChange}
                  required
                >
                  <option value="all">All Hotels & Rooms</option>
                  <option value="hotel">Specific Hotel</option>
                  <option value="room">Specific Room</option>
                </select>
              </div>
              
              {(newDiscount.appliesTo === 'hotel' || newDiscount.appliesTo === 'room') && (
                <div className="form-group">
                  <label htmlFor="hotelId">Select Hotel</label>
                  <select
                    id="hotelId"
                    name="hotelId"
                    value={newDiscount.hotelId}
                    onChange={handleHotelChange}
                    required
                  >
                    <option value="">-- Select a Hotel --</option>
                    {hotels.map(hotel => (
                      <option key={hotel.id} value={hotel.id}>{hotel.name}</option>
                    ))}
                  </select>
                </div>
              )}
              
              {newDiscount.appliesTo === 'room' && newDiscount.hotelId && (
                <div className="form-group">
                  <label htmlFor="roomId">Select Room</label>
                  <select
                    id="roomId"
                    name="roomId"
                    value={newDiscount.roomId}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">-- Select a Room --</option>
                    {availableRooms.map(room => (
                      <option key={room.id} value={room.id}>
                        Room {room.roomNumber} ({room.roomType})
                      </option>
                    ))}
                  </select>
                </div>
              )}
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="minStay">Minimum Stay (nights)</label>
                  <input
                    type="number"
                    id="minStay"
                    name="minStay"
                    value={newDiscount.minStay}
                    onChange={handleInputChange}
                    min="1"
                    placeholder="1"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="maxUses">Maximum Uses (blank for unlimited)</label>
                  <input
                    type="number"
                    id="maxUses"
                    name="maxUses"
                    value={newDiscount.maxUses}
                    onChange={handleInputChange}
                    min="1"
                    placeholder="Leave blank for unlimited"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={newDiscount.description}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Provide details about this discount"
                ></textarea>
              </div>
              
              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create Discount
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscountManagement;