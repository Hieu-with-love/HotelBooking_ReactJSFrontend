import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { FaGoogle, FaApple, FaFacebook } from "react-icons/fa";
import './register.css'
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
    const navigate = useNavigate();

    return (
        <>
            <section className='register-page'>
                <Container >
                    <Row>
                        <Col md={6}>
                            <div className='intro-section'>
                                <div className='intro-section-img'>
                                    <img src="https://imgcy.trivago.com/c_limit,d_dummy.jpeg,f_auto,q_auto:eco,h_233,dpr_2.0/hardcodedimages/web-app/auth-page/account-benefits-coins.png"
                                        alt=""
                                    />
                                </div>
                                <div className='available'>
                                    <h3 className='title'>
                                        Bạn có thể
                                    </h3>
                                    <ul>
                                        <li>
                                            <i class="bi bi-check2"></i> <span>Mở khóa giá thành viên và ưu đãi cho khách hàng thân thiết</span>
                                        </li>
                                        <li>
                                            <i class="bi bi-check2"></i> <span>Dễ dàng xem lại nơi lưu trú đã lưu từ bất cứ thiết bị nào</span>
                                        </li>
                                        <li>
                                            <i class="bi bi-check2"></i> <span>Tiết kiệm lớn nhờ thông báo giá trên app của chúng tôi</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </Col>
                        <Col md={6}>
                            <div className='zotel-section'>
                                <div className='logo'>
                                    <i className="bi bi-arrow-left-circle"
                                        onClick={() => navigate('/login')}
                                    ></i>
                                    <h5>ZotelStay</h5>
                                </div>
                                <div className='register'>
                                    <h3 className='title'>
                                        Đăng ký nhanh chóng bằng email có sẵn của bạn
                                    </h3>
                                    <form>
                                        <span className='login-title'>
                                            Đăng ký nhanh bằng cách nhập email và mật khẩu
                                        </span>
                                        <input type="email"
                                            className='form-control register-input'
                                            placeholder='Nhập địa chỉ email'
                                        />
                                        <input type="password"
                                            className='form-control register-input'
                                            placeholder='Nhập mật khẩu'
                                        />
                                        <input type="password"
                                            className='form-control register-input'
                                            placeholder='Nhập lại mật khẩu'
                                        />
                                        <button className='btn btn-primary register-btn'
                                        >
                                            Tiếp tục
                                        </button>
                                    </form>

                                    <div className='d-flex align-items-center my-3'>
                                        <div className='flex-grow-1 border-top border-secondary'></div>
                                        <span className='mx-2 text-muted'>hoặc tiếp tục với</span>
                                        <div className='flex-grow-1 border-top border-secondary'></div>
                                    </div>

                                    <div className="text-center">
                                        {/* Social Login Buttons */}
                                        <div className="d-flex justify-content-center gap-3 my-3">
                                            <button className="btn btn-outline-dark d-flex align-items-center">
                                                <FaGoogle className="me-2" /> Google
                                            </button>
                                            <button className="btn btn-outline-dark d-flex align-items-center">
                                                <FaApple className="me-2" /> Apple
                                            </button>
                                            <button className="btn btn-outline-dark d-flex align-items-center">
                                                <FaFacebook className="me-2 text-primary" /> Facebook
                                            </button>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
        </>
    )
}

export default RegisterPage