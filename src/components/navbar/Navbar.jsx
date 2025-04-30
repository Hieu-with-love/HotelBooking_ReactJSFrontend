import React, { useEffect, useState } from 'react'
import './navbar.css'
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AuthApi from '../../api/authApi';

const Navbar = () => {
    const [openMenu, setOpenMenu] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { currentUser, logout } = useAuth();
    const [refreshUser, setRefreshUser] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchRefreshUser = async () => {
        try {
            const jwt = localStorage.getItem("jwt");
            if (!jwt) {
                setRefreshUser(null);
                setLoading(false);
                return null;
            }

            const user = await AuthApi.getCurrentUser();
            if (user) {
                setRefreshUser(user);
                return user;
            } else {
                setRefreshUser(null);
                return null;
            }
        } catch (err) {
            console.log("Error fetching user data:", err);
            if (err.response && err.response.status === 401) {
                // Token expired or invalid, clear local storage
                localStorage.removeItem("jwt");
                setRefreshUser(null);
            }
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Refresh user data when route changes to ensure authentication state is current
    useEffect(() => {
        fetchRefreshUser();
    }, [location.pathname]);

    const handleLogout = async () => {
        await logout();
        navigate('/');
        setOpenMenu(false);
    };

    return (
        <>
            <nav className='nav-section'>
                <div className="nav-container">
                    <div className="nav-logo">
                        <h5 onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>ZotelStay</h5>
                    </div>

                    <div className="nav-features">
                        <div className="feature-item">
                            <i className="bi bi-heart"></i>
                            <span>Yêu thích</span>
                        </div>
                        <div className="feature-item">
                            <i className="bi bi-globe2"></i>
                            <span>VI đ</span>
                        </div>

                        {!currentUser ? (
                            // Show login button for non-authenticated users
                            <div className="feature-item"
                                onClick={() => navigate('/login')}
                                style={{ cursor: 'pointer' }}
                            >
                                <i className="bi bi-person-circle"></i>
                                <span>Đăng nhập</span>
                            </div>
                        ) : (
                            // Show user avatar/name for authenticated users
                            <div className="feature-item authenticated-user"
                                style={{ cursor: 'pointer' }}
                                onClick={() => setOpenMenu(!openMenu)}
                            >
                                <i className="bi bi-person-fill"></i>
                                <span>{currentUser.firstName || 'User'}</span>
                            </div>
                        )}

                        <div className="feature-item menu-item"
                            onClick={() => setOpenMenu(!openMenu)}>
                            <i className="bi bi-list"></i>
                            <span>Menu</span>
                            {openMenu &&
                                (<div className="menu-dropdown">
                                    {currentUser ? (
                                        // Menu items for authenticated users
                                        <>
                                            <div className="dropdown-item"
                                                onClick={() => {
                                                    navigate('/profile');
                                                    setOpenMenu(false);
                                                }}
                                            >
                                                <i className="bi bi-person-square"></i>
                                                <span>Thông tin cá nhân</span>
                                            </div>
                                            <div className="dropdown-item"
                                                onClick={() => {
                                                    navigate('/bookings');
                                                    setOpenMenu(false);
                                                }}
                                            >
                                                <i className="bi bi-journal-text"></i>
                                                <span>Đặt chỗ của tôi</span>
                                            </div>
                                            <div className="dropdown-item"
                                                onClick={() => {
                                                    navigate('/history');
                                                    setOpenMenu(false);
                                                }}
                                            >
                                                <i className="bi bi-clock-history"></i>
                                                <span>Xem gần đây</span>
                                            </div>
                                            {currentUser.role === 'PARTNER' && (
                                                <div className="dropdown-item"
                                                    onClick={() => {
                                                        navigate('/partner');
                                                        setOpenMenu(false);
                                                    }}
                                                >
                                                    <i className="bi bi-building"></i>
                                                    <span>Quản lý đối tác</span>
                                                </div>
                                            )}
                                            <div className="dropdown-item"
                                                onClick={() => {
                                                    navigate('/policy-support');
                                                    setOpenMenu(false);
                                                }}
                                            >
                                                <i className="bi bi-question-circle"></i>
                                                <span>Hỗ trợ và trợ giúp</span>
                                            </div>
                                            <div className="dropdown-item"
                                                onClick={handleLogout}
                                            >
                                                <i className="bi bi-box-arrow-left"></i>
                                                <span>Đăng xuất</span>
                                            </div>
                                        </>
                                    ) : (
                                        // Menu items for non-authenticated users
                                        <>
                                            <div className="dropdown-item"
                                                onClick={() => {
                                                    navigate('/login');
                                                    setOpenMenu(false);
                                                }}
                                            >
                                                <i className="bi bi-box-arrow-in-right"></i>
                                                <span>Đăng nhập</span>
                                            </div>
                                            <div className="dropdown-item"
                                                onClick={() => {
                                                    navigate('/register');
                                                    setOpenMenu(false);
                                                }}
                                            >
                                                <i className="bi bi-person-plus"></i>
                                                <span>Đăng ký</span>
                                            </div>
                                            <div className="dropdown-item"
                                                onClick={() => {
                                                    navigate('/policy-support');
                                                    setOpenMenu(false);
                                                }}
                                            >
                                                <i className="bi bi-question-circle"></i>
                                                <span>Hỗ trợ và trợ giúp</span>
                                            </div>
                                        </>
                                    )}
                                </div>
                                )
                            }
                        </div>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Navbar