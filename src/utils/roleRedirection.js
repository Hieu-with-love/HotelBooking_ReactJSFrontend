import { useNavigate } from 'react-router-dom';

/**
 * Function to redirect users based on their role
 * @param {string} userRole - The role of the user ('CUSTOMER' or 'PARTNER')
 * @param {function} navigate - The navigate function from useNavigate hook
 */
export const redirectByRole = (userRole, navigate) => {
  if (userRole === 'PARTNER') {
    navigate('/partner');
  } else {
    // Default to homepage for CUSTOMER or if role is undefined
    navigate('/');
  }
};

/**
 * Custom hook for role-based redirection
 * @returns {function} A function that takes a userRole and redirects accordingly
 */
export const useRoleRedirection = () => {
  const navigate = useNavigate();
  
  return (userRole) => {
    redirectByRole(userRole, navigate);
  };
};