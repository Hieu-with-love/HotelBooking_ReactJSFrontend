import React from 'react';
import { Container, Row, Col, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar/Navbar';
import Footer from '../components/footer/Footer';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <>
            <Navbar />
            <Container className="my-5 py-5 text-center">
                <Row className="justify-content-center">
                    <Col md={8} lg={6}>
                        <div className="not-found-container">
                            <h1 className="display-1">404</h1>
                            <Alert variant="danger" className="mb-4">
                                <h2 className="mb-3">Page Not Found</h2>
                                <p className="mb-0">
                                    The page you are looking for doesn't exist or you don't have permission to access it.
                                </p>
                            </Alert>
                            <Button 
                                variant="primary" 
                                size="lg" 
                                onClick={() => navigate('/')}
                            >
                                Go back to Homepage
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Container>
            <Footer />
        </>
    );
};

export default NotFound;