import React from 'react'

const PropertyList = () => {
    return (
        <div className='propertyList'>
            <div className="propertyItem">
                <img
                    src="https://q-xx.bstatic.com/xdata/images/hotel/263x210/595550862.jpeg?k=3514aa4abb76a6d19df104cb307b78b841ac0676967f24f4b860d289d55d3964&o="
                    alt=""
                    className='propertyImg'
                />
                <h2 className='text-sm-start'>Khách sạn</h2>
                <p className='text-secondary'>28 tháng 2-2 tháng 3, 2 người lớn</p>
                <p className='text-secondary'>Có 572 chỗ nghỉ còn trống</p>
            </div>
        </div>
    )
}

export default PropertyList