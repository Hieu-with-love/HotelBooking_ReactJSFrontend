import React from 'react'
import "./featured.css"

const Featured = () => {
    return (
        <div className='featured'>
            <div className="featuredItem">
                <img
                    src="https://cf.bstatic.com/xdata/images/city/600x600/688844.jpg?k=02892d4252c5e4272ca29db5faf12104004f81d13ff9db724371de0c526e1e15&o="
                    alt=""
                    className='featuredImg'
                />
                <h1 className='featuredTitle'>Đà Nẵng</h1>
            </div>
            <div className="featuredItem">
                <img
                    src='https://cf.bstatic.com/xdata/images/city/600x600/688956.jpg?k=fc88c6ab5434042ebe73d94991e011866b18ee486476e475a9ac596c79dce818&o='
                    alt=""
                    className='featuredImg'
                />
                <h1 className='featuredTitle'>Vũng Tàu</h1>
            </div>
            <div className="featuredItem">
                <img
                    src='https://cf.bstatic.com/xdata/images/city/600x600/688831.jpg?k=7b999c7babe3487598fc4dd89365db2c4778827eac8cb2a47d48505c97959a78&o='
                    alt=""
                    className='featuredImg'
                />
                <h1 className='featuredTitle'>Đà Lạt</h1>
            </div>

        </div>
    )
}

export default Featured