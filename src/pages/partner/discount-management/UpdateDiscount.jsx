import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './DiscountManagement.css';
import { getDiscountById, updateDiscount } from '../../../api/apiDiscount';

const UpdateDiscount = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get discount ID from URL
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'percentage',
    value: '',
    startDate: '',
    expirationDate: '',
    quantity: '',
    remainingQuantity: '',
    isActive: true,
    description: ''
  });

  // Fetch discount data when component mounts
  useEffect(() => {
    const fetchDiscountData = async () => {
      try {
        setFetchLoading(true);
        
        const discountData = await getDiscountById(id);
        console.log('Fetched discount:', discountData);
        
        // Determine if it's a percentage or fixed discount
        const discountType = discountData.discountPercent !== undefined && 
                            discountData.discountPercent !== null ? 'percentage' : 'fixed';
        
        // Format dates for datetime-local input
        const formatDate = (dateString) => {
          if (!dateString) return '';
          const date = new Date(dateString);
          return date.toISOString().slice(0, 16);
        };
        
        setFormData({
          code: discountData.code || '',
          discountType,
          value: discountType === 'percentage' ? 
                (discountData.discountPercent || '') : 
                (discountData.discountAmount || ''),
          startDate: formatDate(discountData.startDate),
          expirationDate: formatDate(discountData.expirationDate),
          quantity: discountData.quantity || '',
          remainingQuantity: discountData.remainingQuantity || '',
          isActive: discountData.isActive || false,
          description: discountData.description || ''
        });
        
      } catch (err) {
        setError('Failed to fetch discount details. Please try again.');
        console.error('Error fetching discount:', err);
      } finally {
        setFetchLoading(false);
      }
    };
    
    if (id) {
      fetchDiscountData();
    }
  }, [id]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      // Format the data for the API
      const discountData = {
        code: formData.code,
        startDate: formData.startDate,
        expirationDate: formData.expirationDate,
        isActive: formData.isActive,
        description: formData.description,
        quantity: parseInt(formData.quantity) || 0,
      };
      
      // Add either percentage or fixed amount based on type
      if (formData.discountType === 'percentage') {
        discountData.discountPercent = parseFloat(formData.value);
      } else {
        discountData.discountAmount = parseFloat(formData.value);
      }
      
      // Call the API to update the discount
      const response = await updateDiscount(id, discountData);
      console.log('Discount updated:', response);
      
      setSuccess(true);
      
      // Redirect to discount management page after a delay
      setTimeout(() => {
        navigate('/partner/discount-management');
      }, 2000);
      
    } catch (err) {
      setError('Failed to update discount. Please check your inputs and try again.');
      console.error('Error updating discount:', err);
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while fetching discount data
  if (fetchLoading) {
    return (
      <div className="update-discount">
        <div className="loading">Loading discount details...</div>
      </div>
    );
  }

  return (
    <div className="update-discount">
      <div className="page-header">
        <div className="page-title">
          <h1><span className="material-icons">edit</span> Update Discount</h1>
          <p>Edit your discount code details</p>
        </div>
        <button 
          className="btn-secondary"
          onClick={() => navigate('/partner/discount-management')}
        >
          <span className="material-icons">arrow_back</span> Back to Discounts
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">Discount updated successfully! Redirecting...</div>}

      <div className="discount-form-container">
        <form onSubmit={handleSubmit} className="discount-form">
          <div className="form-section">
            <h3>Discount Information</h3>
            
            <div className="form-group">
              <label htmlFor="code">Discount Code*</label>
              <input
                type="text"
                id="code"
                name="code"
                value={formData.code}
                onChange={handleChange}
                placeholder="e.g. SUMMER2025"
                required
              />
              <small>This is the code customers will enter to apply the discount</small>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="discountType">Discount Type*</label>
                <select
                  id="discountType"
                  name="discountType"
                  value={formData.discountType}
                  onChange={handleChange}
                  required
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount ($)</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="value">
                  {formData.discountType === 'percentage' ? 'Percentage (%)' : 'Amount ($)'}*
                </label>
                <input
                  type="number"
                  id="value"
                  name="value"
                  value={formData.value}
                  onChange={handleChange}
                  placeholder={formData.discountType === 'percentage' ? '10' : '25.00'}
                  min={formData.discountType === 'percentage' ? '0' : '0.01'}
                  max={formData.discountType === 'percentage' ? '100' : '10000'}
                  step={formData.discountType === 'percentage' ? '1' : '0.01'}
                  required
                />
              </div>
            </div>
          </div>
          
          <div className="form-section">
            <h3>Validity &amp; Usage</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="startDate">Start Date*</label>
                <input
                  type="datetime-local"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="expirationDate">Expiration Date*</label>
                <input
                  type="datetime-local"
                  id="expirationDate"
                  name="expirationDate"
                  value={formData.expirationDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="quantity">Maximum Uses (leave empty for unlimited)</label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  placeholder="e.g. 100"
                  min="0"
                />
                <small>Total number of times this discount can be used</small>
              </div>
              
              <div className="form-group">
                <label htmlFor="remainingQuantity">Remaining Uses</label>
                <input
                  type="number"
                  id="remainingQuantity"
                  name="remainingQuantity"
                  value={formData.remainingQuantity}
                  readOnly
                  disabled
                />
                <small>How many uses are still available (read-only)</small>
              </div>
            </div>
            
            <div className="form-group checkbox-group">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
              />
              <label htmlFor="isActive">Active</label>
              <small>If unchecked, the discount won't be usable even within the valid date range</small>
            </div>
          </div>
          
          <div className="form-section">
            <h3>Additional Information</h3>
            
            <div className="form-group">
              <label htmlFor="description">Description (Optional)</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe what this discount is for..."
                rows="4"
              />
            </div>
          </div>
          
          <div className="form-actions">
            <button 
              type="button" 
              className="btn-secondary"
              onClick={() => navigate('/partner/discount-management')}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Discount'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateDiscount;