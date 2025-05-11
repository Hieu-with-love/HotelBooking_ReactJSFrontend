import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import "./home.css"
import Header from '../../components/header/Header'
import Featured from '../../components/featured/Featured'
import PropertyList from '../../components/propertyList/PropertyList'
import HotelList from '../../components/hotelList/HotelList'
import Navbar from '../../components/navbar/Navbar'
import Footer from '../../components/footer/Footer'

const properties = [1, 1, 1, 1, 1]

const Home = () => {
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Trang chủ"
    }, [])

    const handlePartnerClick = () => {
        navigate('/register', { state: { role: 'partner' } });
    };

    return (
        <>
            <Navbar />
            <Header />
            <div className="homeContainer">
                <div className="partner-section">
                    <div className="partner-content">
                        <h2>Đăng ký trở thành đối tác của chúng tôi</h2>
                        <p>Đăng ký khách sạn của bạn và tiếp cận hàng nghìn khách hàng tiềm năng</p>
                        <button className="partner-button" onClick={handlePartnerClick}>
                            Trở thành đối tác
                        </button>
                    </div>
                </div>
                <Featured />
                <h1 className="homeTitle">Duyệt theo loại chỗ ở bạn muốn</h1>
                
                {/* HotelList now handles its own data fetching */}
                <HotelList />
                
                {/* Include new Footer component */}
                <Footer />
            </div>
        </>
    )
}

export default Home