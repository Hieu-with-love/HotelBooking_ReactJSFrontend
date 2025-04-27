import React, { useEffect, useState } from 'react';
import { Container, Row, Col, ProgressBar, Alert } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import imgBackground from '../../assets/images/zotel-background.png';
import './emailVerification.css';

const EmailVerificationPage = () => {
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('pending'); // pending, success, error
    const { verifyEmail } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Extract token from URL query parameters
        const searchParams = new URLSearchParams(location.search);
        const token = searchParams.get('token');
        const email = location.state?.email || '';

        if (!token) {
            // If no token is provided, we're waiting for the user to check their email
            const interval = setInterval(() => {
                setProgress((prevProgress) => {
                    if (prevProgress >= 100) {
                        return 0; // Reset progress to create a continuous animation
                    }
                    return prevProgress + 1;
                });
            }, 150);

            return () => clearInterval(interval);
        } else {
            // If token is provided, we're verifying the email
            handleVerification(token);
        }
    }, [location]);

    const handleVerification = async (token) => {
        try {
            setStatus('pending');
            setMessage('Đang xác thực email của bạn...');
            
            // Start progress animation
            const interval = setInterval(() => {
                setProgress((prevProgress) => {
                    if (prevProgress >= 90) {
                        clearInterval(interval);
                        return 90; // Keep at 90% until verification completes
                    }
                    return prevProgress + 10;
                });
            }, 300);
            
            // Verify email
            await verifyEmail(token);
            clearInterval(interval);
            setProgress(100);
            setStatus('success');
            setMessage('Xác thực email thành công! Bạn có thể đăng nhập ngay bây giờ.');
            
            // Auto redirect after success
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (error) {
            setStatus('error');
            setMessage('Xác thực email thất bại. Token không hợp lệ hoặc đã hết hạn.');
            setProgress(100);
        }
    };

    const renderStatusMessage = () => {
        if (status === 'success') {
            return (
                <Alert variant="success" className="text-center">
                    <i className="bi bi-check-circle-fill me-2"></i>
                    {message}
                </Alert>
            );
        } else if (status === 'error') {
            return (
                <Alert variant="danger" className="text-center">
                    <i className="bi bi-x-circle-fill me-2"></i>
                    {message}
                    <div className="mt-3">
                        <button 
                            className="btn btn-outline-primary" 
                            onClick={() => navigate('/login')}
                        >
                            Quay lại đăng nhập
                        </button>
                    </div>
                </Alert>
            );
        }
        
        return null;
    };

    return (
        <section className="verification-page">
            <Container>
                <Row className="justify-content-center">
                    <Col md={8} lg={6} className="verification-container">
                        <div className="text-center mb-4">
                            <img 
                                src={imgBackground} 
                                alt="ZotelStay" 
                                className="img-fluid zotel-logo"
                                onClick={() => navigate('/')}
                                style={{ cursor: 'pointer', maxHeight: '80px' }}
                            />
                        </div>
                        
                        <div className="verification-card">
                            <h2 className="text-center mb-4">Xác thực tài khoản</h2>
                            
                            {/* Display status message */}
                            {renderStatusMessage()}
                            
                            {status === 'pending' && (
                                <>
                                    <div className="text-center verification-animation">
                                        <i className="bi bi-envelope-check verification-icon"></i>
                                        <div className="verification-pulse"></div>
                                    </div>
                                    
                                    <ProgressBar 
                                        now={progress} 
                                        variant="primary" 
                                        animated 
                                        className="my-4" 
                                    />
                                    
                                    <div className="text-center verification-message">
                                        {!location.search.includes('token') ? (
                                            <>
                                                <h4>Vui lòng kiểm tra email của bạn</h4>
                                                <p>
                                                    Chúng tôi đã gửi một email xác thực đến địa chỉ email của bạn.
                                                    Vui lòng kiểm tra hộp thư và nhấp vào liên kết xác thực.
                                                </p>
                                                <div className="verification-tips mt-4">
                                                    <h5>Không tìm thấy email?</h5>
                                                    <ul className="text-start">
                                                        <li>Kiểm tra thư mục spam hoặc thùng rác</li>
                                                        <li>Đợi một vài phút và làm mới hộp thư</li>
                                                        <li>Đảm bảo địa chỉ email bạn cung cấp chính xác</li>
                                                    </ul>
                                                </div>
                                                <button 
                                                    className="btn btn-primary mt-3"
                                                    onClick={() => navigate('/login')}
                                                >
                                                    Quay về trang đăng nhập
                                                </button>
                                            </>
                                        ) : (
                                            <p>{message || 'Đang xử lý...'}</p>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </Col>
                </Row>
            </Container>
        </section>
    );
};

export default EmailVerificationPage;