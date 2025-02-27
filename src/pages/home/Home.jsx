import React from 'react'
import "./home.css"
import Navbar from '../../components/navbar/Navbar'
import Header from '../../components/header/Header'
import Featured from '../../components/featured/Featured'
import PropertyList from '../../components/propertyList/PropertyList'

const properties = [1, 1, 1, 1, 1]

const Home = () => {
    return (
        <div>
            <Navbar />
            <Header />
            <div className="homeContainer">
                <Featured />
                <h1 className="homeTitle">Duyệt theo loại chỗ ở bạn muốn</h1>
                {properties.map(() => <PropertyList />)}
            </div>
        </div>
    )
}

export default Home