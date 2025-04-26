import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/home/Home';
import List from './pages/list/List';
import LoginPage from './pages/auth/LoginPage';
import './index.css';
import RegisterPage from './pages/auth/RegisterPage';
import HotelDetails from './pages/hotel/HotelDetails';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
       
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />

      {/* Start customer route */}
      <Route path='/hotels' element={<List />} />
      <Route path='/hotels/:id' element={<HotelDetails />} />
      {/* End customer route */}

      </Routes>
    </BrowserRouter>
  );
}

export default App;
