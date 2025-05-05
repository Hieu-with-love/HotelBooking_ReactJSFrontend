import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DiscountManagement.css';
import { createDiscount } from '../../../api/apiDiscount';

const CreateDiscount = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
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
    active: true,
    description: ''
  });

  useEffect(() => {
    document.title = 'Create Discount';
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));

    console.log(formData.startDate)
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
        active: formData.active,
        description: formData.description,
        quantity: parseInt(formData.quantity) || 0,
      };
      
      // Add either percentage or fixed amount based on type
      if (formData.discountType === 'percentage') {
        discountData.discountPercent = parseFloat(formData.value);
      } else {
        discountData.discountAmount = parseFloat(formData.value);
      }
      
      // Call the API to create the discount
      const response = await createDiscount(discountData);
      console.log('Discount created:', response);
      
      setSuccess(true);
      
      // Redirect to discount management page after a delay
      setTimeout(() => {
        navigate('/partner/discount-management');
      }, 2000);
      
    } catch (err) {
      setError('Failed to create discount. Please check your inputs and try again.');
      console.error('Error creating discount:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-discount">
      <div className="page-header">
        <div className="page-title">
          <h1><span className="material-icons">local_offer</span> Create New Discount</h1>
          <p>Set up a new discount code for your customers</p>
        </div>
        <button 
          className="btn-secondary"
          onClick={() => navigate('/partner/discount-management')}
        >
          <span className="material-icons">arrow_back</span> Back to Discounts
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">Discount created successfully! Redirecting...</div>}

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
              <small>How many times this discount can be used in total</small>
            </div>
            
            <div className="form-group checkbox-group">
              <input
                type="checkbox"
                id="active"
                name="active"
                checked={formData.active}
                onChange={handleChange}
              />
              <label htmlFor="active">Active</label>
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
              {loading ? 'Creating...' : 'Create Discount'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateDiscount;