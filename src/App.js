import { BrowserRouter, Route, Routes } from 'react-router-dom';
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
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
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
          {/* End customer route */}

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
