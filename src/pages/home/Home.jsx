import React from 'react'
import "./home.css"
import Header from '../../components/header/Header'
import Featured from '../../components/featured/Featured'
import PropertyList from '../../components/propertyList/PropertyList'
import Navbar from '../../components/navbar/Navbar'

const properties = [1, 1, 1, 1, 1]

const Home = () => {
    return (
        <>
            <Navbar />
            <Header />
            <div className="homeContainer">
                <Featured />
                <h1 className="homeTitle">Duyệt theo loại chỗ ở bạn muốn</h1>
                {properties.map(() => <PropertyList />)}
            </div>
        </>
    )
}

export default Home