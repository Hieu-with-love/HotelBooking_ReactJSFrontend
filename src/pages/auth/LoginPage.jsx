import React, { useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { FaGoogle, FaApple, FaFacebook } from "react-icons/fa";
import './login.css'
import { useNavigate } from 'react-router-dom';


const LoginPage = () => {
    const navigate = useNavigate();

    return (
        <>
            <section className='login-page'>
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
                                    <h5>ZotelStay</h5>
                                    <button className="navigate-register"
                                        onClick={() => navigate('/register')}
                                    >
                                        Đăng ký
                                    </button>
                                </div>
                                <div className='login'>
                                    <h3 className='title'>
                                        Tiết kiệm nhiều hơn khi là thành viên
                                    </h3>
                                    <form>
                                        <span className='login-title'>
                                            Đăng nhập bằng email và mật khẩu đã tạo
                                        </span>
                                        <input type="email"
                                            className='form-control login-input'
                                            placeholder='Nhập địa chỉ email'
                                        />
                                        <input type="password"
                                            className='form-control login-input'
                                            placeholder='Nhập mật khẩu'
                                        />
                                        <button className='btn btn-primary login-btn'
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

                                {/* Policy Text */}
                                <p className="text-muted mt-3 policy-section">
                                    Bằng việc tạo tài khoản, bạn đồng ý với{" "}
                                    <a href="#" className="text-primary text-decoration-none">
                                        Chính sách riêng tư
                                    </a>{" "}
                                    và{" "}
                                    <a href="#" className="text-primary text-decoration-none">
                                        Điều khoản sử dụng
                                    </a>{" "}
                                    của chúng tôi.
                                </p>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
        </>
    )
}

export default LoginPage