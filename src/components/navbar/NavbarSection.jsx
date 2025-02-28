import React, { useState } from 'react'
import { Container, Nav, Navbar, NavDropdown, Offcanvas } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'
import './navbar.css'

const NavbarSection = () => {
    const [openMenu, setOpenMenu] = useState(false)
    return (
        <>
            <Container className='nav-container'>
                <Navbar expand="lg" className="p-0">
                    <Container fluid>
                        {/* Logo Section */}
                        <Navbar.Brand>
                            <NavLink to="/" className="nav-brand">ZotelStay</NavLink>
                        </Navbar.Brand>
                        {/* End Logo Section */}

                        <Navbar.Offcanvas
                            id={`offcanvasNavbar-expand-lg`}
                            aria-labelledby={`offcanvasNavbarLabel-expand-lg`}
                            placement="start"
                            show={openMenu}
                        >
                            {/* moblie logo section*/}
                            <Offcanvas.Header>
                                <h1 className='logo z-3'>ZotelStay</h1>
                                <span className='navbar-toggle ms-auto'>
                                    <i className="bi bi-x-lg"></i>
                                </span>
                            </Offcanvas.Header>
                            {/* End moblie logo section*/}

                            <Offcanvas.Body>
                                <Nav className="justify-content-end flex-grow-1 pe-3">
                                    <NavLink className="nav-link" to="/wishlist">
                                        <i className="bi bi-heart"></i>
                                        <span>Yêu thích</span>
                                    </NavLink>
                                    <NavLink className="nav-link" to="/about-us">
                                        <i class="bi bi-globe2"></i>
                                        <span>VI đ</span>
                                    </NavLink>

                                    <NavLink className="nav-link" to="/login">
                                        <i class="bi bi-person-circle"></i>
                                        <span>Đăng nhập</span>
                                    </NavLink>

                                    <NavDropdown
                                        title="Menu"
                                        id={`offcanvasNavbarDropdown-expand-lg`}
                                        className='nav-dropdown-item'
                                    >
                                        <i class="bi bi-list"></i>
                                        <NavDropdown.Item href="#action3">
                                            <i class="bi bi-person-square"></i> <span>My Profile</span>
                                        </NavDropdown.Item>
                                        <NavDropdown.Item href="#action4">
                                            <i class="bi bi-clock-history"></i> <span>Xem gần đây</span>
                                        </NavDropdown.Item>
                                        <NavDropdown.Item href="#action5">
                                            <i class="bi bi-question-circle"></i> <span>Hỗ trợ và trợ giúp</span>
                                        </NavDropdown.Item>
                                    </NavDropdown>

                                </Nav>

                            </Offcanvas.Body>
                        </Navbar.Offcanvas>

                        <div className='ms-md-4 ms-2'>
                            <NavLink className='primaryBtn d-none d-sm-inline-block'>
                                Book now
                            </NavLink>
                            <li className='d-inline-block d-lg-none ms-3 toggle-btn'>
                                <i
                                    className={openMenu ? 'bi bi-x-lg' : 'bi bi-list'}
                                ></i>
                            </li>
                        </div>

                    </Container>
                </Navbar>
            </Container>

        </>
    )
}

export default NavbarSection