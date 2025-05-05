import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './DiscountManagement.css';
import { deleteDiscount, getDiscounts } from '../../../api/apiDiscount';

const DiscountManagement = () => {
  const navigate = useNavigate();
  const [discounts, setDiscounts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(10);
  const [numberOfElements, setNumberOfElements] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetchDiscounts();
    document.title = 'Discount Management';
  }, [currentPage, pageSize]);

  const fetchDiscounts = async () => {
    try {
      setLoading(true);
      
      const response = await getDiscounts(currentPage, pageSize);
      console.log("API response:", response);
      
      if (response && response.content) {
        const formattedDiscounts = response.content.map(discount => ({
          id: discount.id,
          code: discount.code,
          // Determine discount type based on which field is present
          discountType: discount.discountPercent ? 'percentage' : 'fixed',
          value: discount.discountPercent || discount.discountAmount,
          startDate: discount.startDate,
          endDate: discount.expirationDate,
          maxUses: discount.quantity,
          usedCount: discount.quantity - discount.remainingQuantity,
          status: discount.isActive ? 
                 (new Date(discount.startDate) > new Date() ? 'scheduled' : 'active') : 
                 'expired'
        }));
        
        setDiscounts(formattedDiscounts);
        
        // Update pagination info
        if (response.content) {
          setCurrentPage(response.pageable.pageNumber);
          setTotalPages(response.totalPages);
          setNumberOfElements(response.numberOfElements);
          setTotalElements(response.totalElements);
        }
      }
      
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch discounts. Please try again.');
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

  const handleDeleteDiscount = async (id) => {
    if (window.confirm('Are you sure you want to delete this discount?')) {
      try {
        setLoading(true);
        
        // Call API to delete the discount
        await deleteDiscount(id);
        
        // Refresh the list after deletion
        fetchDiscounts();
      } catch (err) {
        setError('Failed to delete discount. Please try again.');
        console.error(err);
        setLoading(false);
      }
    }
  };

  return (
    <div className="discount-management">
      <div className="page-header">
        <h1>Discount Management</h1>
        <button 
          className="btn-primary"
          onClick={() => navigate('/partner/discount-management/create')}
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
                <th>Code</th>
                <th>Discount</th>
                <th>Validity Period</th>
                <th>Usage</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {discounts.map(discount => (
                <tr key={discount.id} className={discount.status === 'expired' ? 'expired-discount' : ''}>
                  <td><code>{discount.code}</code></td>
                  <td>
                    {discount.discountType === 'percentage' ? 
                      `${discount.value}%` : `$${discount.value.toFixed(2)}`}
                  </td>
                  <td>
                    {new Date(discount.startDate).toLocaleDateString()} - {new Date(discount.endDate).toLocaleDateString()}
                  </td>
                  <td>
                    {discount.usedCount} / {discount.maxUses}
                  </td>
                  <td><span className={`status-badge ${discount.status}`}>{discount.status}</span></td>
                  <td className="actions">
                    <button 
                      className="btn-edit"
                      onClick={() => navigate(`/partner/discount-management/edit/${discount.id}`)}
                    >
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
          
          {/* Pagination Controls */}
          <div className="pagination-container">
            <div className="pagination-info">
              Showing {numberOfElements} of {totalElements} discounts
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
        </div>
      )}
    </div>
  );
};

export default DiscountManagement;