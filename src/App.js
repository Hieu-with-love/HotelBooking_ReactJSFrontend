import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import './App.css';
import Home from './pages/home/Home';
import List from './pages/list/List';
import LoginPage from './pages/auth/LoginPage';
import './index.css';
import RegisterPage from './pages/auth/RegisterPage';
import HotelDetails from './pages/hotel/HotelDetails';
import RoomDetails from './pages/room/RoomDetails';
import BookingDetails from './pages/booking/BookingDetails';
import EmailVerificationPage from './pages/auth/EmailVerificationPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import BookingConfirmation from './pages/booking/BookingConfirmation';

// Partner Dashboard Components
import Dashboard from './pages/partner/dashboard/Dashboard';
import DashboardHome from './pages/partner/dashboard/components/DashboardHome';
import HotelManagement from './pages/partner/hotel-management/HotelManagement';
import RoomManagement from './pages/partner/room-management/RoomManagement';
import DiscountManagement from './pages/partner/discount-management/DiscountManagement';
import PartnerLogin from './pages/partner/auth/PartnerLogin';
import PartnerRegister from './pages/partner/auth/PartnerRegister';

// App routes with authentication state management
const AppRoutes = () => {
  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />
       
        {/* Authentication routes */}
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/verify-email' element={<EmailVerificationPage />} />

        {/* Start customer route */}
        <Route path='/hotels' element={<List />} />
        <Route path='/hotels/:id' element={<HotelDetails />} />
        <Route path='/hotels/rooms/:id' element={<RoomDetails />} />
        <Route path='/booking-details' element={<BookingDetails />} />
        <Route path='/booking-confirmation' element={<BookingConfirmation />} />
        {/* End customer route */}
        
        {/* Partner routes */}
        <Route path='/partner/login' element={<PartnerLogin />} />
        <Route path='/partner/register' element={<PartnerRegister />} />
        
        {/* Partner Dashboard routes - nested under a layout with sidebar */}
        <Route path='/partner' element={<Dashboard />}>
          <Route path='/dashboard' element={<DashboardHome />} />
          <Route path='/hotel-management' element={<HotelManagement />} />
          <Route path='/room-management' element={<RoomManagement />} />
          <Route path='/discount-management' element={<DiscountManagement />} />
        </Route>
      </Routes>
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
