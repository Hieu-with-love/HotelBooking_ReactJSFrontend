import React, { useState, useEffect } from 'react'
import { Col, Container, Row, Alert } from 'react-bootstrap'
import { FaGoogle, FaApple, FaFacebook } from "react-icons/fa";
import './login.css'
import { useNavigate } from 'react-router-dom';
import imgBackground from '../../assets/images/zotel-background.png'
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
    const [loginForm, setLoginForm] = useState({
        email: "",
        password: ""
    })
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();
    const { login, currentUser, redirectBasedOnRole } = useAuth();
    
    // Redirect if user is already logged in
    useEffect(() => {
        if (currentUser) {
            redirectBasedOnRole(navigate);
        }

        document.title = "Đăng nhập";
    }, [currentUser, navigate, redirectBasedOnRole]);

    const hanldChangeLoginForm = (e) => {
        const {name, value} = e.target;
        setLoginForm({
            ...loginForm,
            [name]: value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Form validation
        if (!loginForm.email || !loginForm.password) {
            setError('Vui lòng nhập đầy đủ thông tin');
            return;
        }
        
        try {
            setError('');
            setLoading(true);
            
            await login(loginForm.email, loginForm.password);
            
        } catch (err) {
            if (err.response && err.response.status === 401) {
                setError("Tài khoản hoặc mật khẩu không đúng. Vui lòng thử lại.");
            } else if (err.response && err.response.status === 400) {
                setError("Vui lòng xác thực tài khoản của bạn trước khi đăng nhập.");
            } else {
                setError("Đã xảy ra lỗi. Vui lòng thử lại sau.");
            }
        } finally {
            setLoading(false);
        }
    };

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
                                    <img src={imgBackground}
                                        alt="logo"
                                        className='img-fluid zotel-logo'
                                        onClick={() => navigate('/')}
                                    />
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
                                    
                                    {error && <Alert variant="danger">{error}</Alert>}
                                    
                                    <form onSubmit={handleSubmit}>
                                        <span className='login-title'>
                                            Đăng nhập bằng email và mật khẩu đã tạo
                                        </span>
                                        <input 
                                            type="email"
                                            name='email'
                                            className='form-control login-input'
                                            placeholder='Nhập địa chỉ email'
                                            onChange={hanldChangeLoginForm}
                                            required
                                        />
                                        <input 
                                            type="password"
                                            name='password'
                                            className='form-control login-input'
                                            placeholder='Nhập mật khẩu'
                                            onChange={hanldChangeLoginForm}
                                            required
                                        />
                                        <button 
                                            type="submit"
                                            className='btn btn-primary login-btn'
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

export default LoginPage