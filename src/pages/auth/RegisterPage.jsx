import React, { useState, useEffect } from 'react'
import { Col, Container, Row, Alert } from 'react-bootstrap'
import { FaGoogle, FaApple, FaFacebook } from "react-icons/fa";
import './register.css'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import imgBackground from '../../assets/images/zotel-background.png'

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        phone: '',
        role: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();
    const { register, currentUser, isVerifying } = useAuth();
    
    // Redirect if user is already logged in
    useEffect(() => {
        if (currentUser) {
            navigate('/');
        }
    }, [currentUser, navigate]);
    
    // Redirect to verification page
    useEffect(() => {
        if (isVerifying) {
            navigate('/verify-email', { state: { email: formData.email } });
        }
    }, [isVerifying, navigate, formData.email]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        console.log('Form Data:', formData); // Debugging line to check form data
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Form validation
        if (!formData.email || !formData.password || !formData.confirmPassword || !formData.fullName) {
            setError('Vui lòng nhập đầy đủ thông tin');
            return;
        }
        
        if (formData.password !== formData.confirmPassword) {
            setError('Mật khẩu không khớp');
            return;
        }
        
        if (formData.password.length < 6) {
            setError('Mật khẩu phải có ít nhất 6 ký tự');
            return;
        }
        
        try {
            setError('');
            setLoading(true);
            
            // Create user object for registration
            const userData = {
                email: formData.email,
                password: formData.password,
                confirmPassword: formData.confirmPassword,
                firstName: formData.firstName,
                lastName: formData.lastName,
                phone: formData.phone || null,
                role: formData.role || null
            };
            
            await register(userData);
            
            // Navigation to email verification will happen in useEffect due to isVerifying state
        } catch (err) {
            console.error('Registration error:', err);
            setError(err.message || 'Đăng ký thất bại, vui lòng thử lại');
        } finally {
            setLoading(false);
        }
    };

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
                                            <i className="bi bi-check2"></i> <span>Mở khóa giá thành viên và ưu đãi cho khách hàng thân thiết</span>
                                        </li>
                                        <li>
                                            <i className="bi bi-check2"></i> <span>Dễ dàng xem lại nơi lưu trú đã lưu từ bất cứ thiết bị nào</span>
                                        </li>
                                        <li>
                                            <i className="bi bi-check2"></i> <span>Tiết kiệm lớn nhờ thông báo giá trên app của chúng tôi</span>
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
                                    <img src={imgBackground}
                                        alt="logo"
                                        className='img-fluid zotel-logo'
                                    />
                                </div>
                                <div className='register'>
                                    <h3 className='title'>
                                        Đăng ký nhanh chóng bằng email có sẵn của bạn
                                    </h3>
                                    
                                    {error && <Alert variant="danger">{error}</Alert>}
                                    
                                    <form onSubmit={handleSubmit}>
                                        <span className='login-title'>
                                            Đăng ký nhanh bằng cách nhập thông tin cá nhân
                                        </span>
                                        <input 
                                            type="email"
                                            name="email"
                                            className='form-control register-input'
                                            placeholder='Nhập địa chỉ email'
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                        <input 
                                            type="text"
                                            name="fullName"
                                            className='form-control register-input'
                                            placeholder='Họ và tên'
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            required
                                        />
                                        <input 
                                            type="tel"
                                            name="phone"
                                            className='form-control register-input'
                                            placeholder='Số điện thoại (tùy chọn)'
                                            value={formData.phone}
                                            onChange={handleChange}
                                        />
                                        <input 
                                            type="password"
                                            name="password"
                                            className='form-control register-input'
                                            placeholder='Nhập mật khẩu'
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                        />
                                        <input 
                                            type="password"
                                            name="confirmPassword"
                                            className='form-control register-input'
                                            placeholder='Nhập lại mật khẩu'
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            required
                                        />
                                        <button 
                                            type="submit"
                                            className='btn btn-primary register-btn'
                                            disabled={loading}
                                        >
                                            {loading ? 'Đang xử lý...' : 'Tiếp tục'}
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

export default RegisterPage