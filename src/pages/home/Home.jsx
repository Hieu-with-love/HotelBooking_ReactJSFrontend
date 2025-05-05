import React, { useEffect } from 'react'
import "./home.css"
import Header from '../../components/header/Header'
import Featured from '../../components/featured/Featured'
import PropertyList from '../../components/propertyList/PropertyList'
import HotelList from '../../components/hotelList/HotelList'
import Navbar from '../../components/navbar/Navbar'
import Footer from '../../components/footer/Footer'

const properties = [1, 1, 1, 1, 1]

const Home = () => {

    useEffect(() => {
        document.title = "Trang chủ"
    }, [])

    return (
        <>
            <Navbar />
            <Header />
            <div className="homeContainer">
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