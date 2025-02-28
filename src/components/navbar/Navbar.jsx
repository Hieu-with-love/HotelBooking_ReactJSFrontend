import React, { useState } from 'react'
import './navbar.css'
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const [openMenu, setOpenMenu] = useState(false);

    const navigate = useNavigate();

    return (
        <>
            <nav className='nav-section'>
                <div className="nav-container">
                    <div className="nav-logo">
                        <h5>ZotelStay</h5>
                    </div>

                    <div className="nav-features">
                        <div className="feature-item">
                            <i className="bi bi-heart"></i>
                            <span>Yêu thích</span>
                        </div>
                        <div className="feature-item">
                            <i class="bi bi-globe2"></i>
                            <span>VI đ</span>
                        </div>
                        <div className="feature-item"
                            onClick={() => navigate('/login')}
                        >
                            <i class="bi bi-person-circle"></i>
                            <span>Đăng nhập</span>
                        </div>
                        <div className="feature-item menu-item"
                            onClick={() => setOpenMenu(!openMenu)}>
                            <i class="bi bi-list"></i>
                            <span>Menu</span>
                            {openMenu &&
                                (<div className="menu-dropdown">
                                    <div className="dropdown-item"
                                        onClick={() => navigate('/profile')}
                                    >
                                        <i class="bi bi-person-square"></i>
                                        <span>My Profile</span>
                                    </div>
                                    <div className="dropdown-item"
                                        onClick={() => navigate('/history')}
                                    >
                                        <i class="bi bi-clock-history"></i>
                                        <span>Xem gần đây</span>
                                    </div>
                                    <div className="dropdown-item"
                                        onClick={() => navigate('/policy-support')}
                                    >
                                        <i class="bi bi-question-circle"></i>
                                        <span>Hỗ trợ và trợ giúp</span>
                                    </div>
                                    <div className="dropdown-item"
                                        onClick={() => navigate('/')}
                                    >
                                        <i class="bi bi-box-arrow-left"></i>
                                        <span>Đăng xuất</span>
                                    </div>
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