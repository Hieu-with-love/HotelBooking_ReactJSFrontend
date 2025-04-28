import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import './PartnerAuth.css';

const PartnerRegister = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    hotelName: '',
    partnerName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear error when user starts typing again
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    
    // Hotel name validation
    if (!formData.hotelName.trim()) {
      newErrors.hotelName = 'Hotel name is required';
    }

    // Partner name validation
    if (!formData.partnerName.trim()) {
      newErrors.partnerName = 'Your name is required';
    }
    
    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsSubmitting(true);
    setServerError('');
    
    try {
      // Add role to form data for partner registration
      const partnerData = {
        name: formData.partnerName,
        email: formData.email,
        password: formData.password,
        hotelName: formData.hotelName,
        role: 'PARTNER' // Adding role for partner registration
      };
      
      await register(partnerData);
      // After successful registration, navigate to verification page
      navigate('/email-verification', { state: { email: formData.email } });
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      setServerError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="partner-auth-container">
      <div className="partner-auth-card">
        <div className="auth-header">
          <h2>Partner Registration</h2>
          <p>Join our platform as a hotel partner</p>
        </div>
        
        {serverError && <div className="server-error">{serverError}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="hotelName">Hotel Name</label>
            <input
              type="text"
              id="hotelName"
              name="hotelName"
              value={formData.hotelName}
              onChange={handleChange}
              placeholder="Enter your hotel name"
            />
            {errors.hotelName && <span className="error-message">{errors.hotelName}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="partnerName">Your Name</label>
            <input
              type="text"
              id="partnerName"
              name="partnerName"
              value={formData.partnerName}
              onChange={handleChange}
              placeholder="Enter your full name"
            />
            {errors.partnerName && <span className="error-message">{errors.partnerName}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
            />
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
          </div>
          
          <button 
            type="submit" 
            className="auth-button" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Registering...' : 'Register as Partner'}
          </button>
        </form>
        
        <div className="auth-footer">
          <p>Already have a partner account? <Link to="/partner/login">Log In</Link></p>
          <p className="customer-link">Looking to book a hotel? <Link to="/register">Register as Customer</Link></p>
        </div>
      </div>
    </div>
  );
};

export default PartnerRegister;