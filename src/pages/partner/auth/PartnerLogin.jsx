import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import './PartnerAuth.css';

const PartnerLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, currentUser } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  // If user is already logged in, redirect to dashboard
  useEffect(() => {
    if (currentUser) {
      if (currentUser.roles.includes('PARTNER')) {
        navigate('/partner/dashboard');
      } else {
        // If logged in but not a partner, redirect to home
        navigate('/');
      }
    }
  }, [currentUser, navigate]);

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
    
    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
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
      const { email, password } = formData;
      const response = await login(email, password);
      
      // Store JWT token
      if (response && response.token) {
        localStorage.setItem('jwt', response.token);
        
        // Check if the user has PARTNER role
        const user = await (await fetch('/api/users/me', {
          headers: {
            'Authorization': `Bearer ${response.token}`
          }
        })).json();
        
        if (user.roles.includes('PARTNER')) {
          // Redirect to partner dashboard
          const from = location.state?.from || '/partner/dashboard';
          navigate(from);
        } else {
          // Not a partner, show error
          setServerError('Your account does not have partner access');
          localStorage.removeItem('jwt');
        }
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials.';
      setServerError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="partner-auth-container">
      <div className="partner-auth-card">
        <div className="auth-header">
          <h2>Partner Login</h2>
          <p>Access your hotel management dashboard</p>
        </div>
        
        {serverError && <div className="server-error">{serverError}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
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
              placeholder="Enter your password"
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>
          
          <div className="forgot-password">
            <Link to="/forgot-password">Forgot password?</Link>
          </div>
          
          <button 
            type="submit" 
            className="auth-button" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Logging in...' : 'Log In'}
          </button>
        </form>
        
        <div className="auth-footer">
          <p>Don't have a partner account? <Link to="/partner/register">Register as Partner</Link></p>
          <p className="customer-link">Looking to book a hotel? <Link to="/login">Login as Customer</Link></p>
        </div>
      </div>
    </div>
  );
};

export default PartnerLogin;