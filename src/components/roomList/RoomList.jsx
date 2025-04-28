import React, { useState, useEffect } from 'react'
import { getRooms } from '../../api/roomApi';
import defaultHotelImg from '../../assets/images/default_hotel_img.jpeg';

const RoomList = () => {

    const [rooms, setRooms] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        document.title = "Zotel Stay | Rooms List"
        const fetchRooms = async () => {
            setLoading(true)
            const data = await getRooms()
            if (Array.isArray(data)) {
                setRooms(data)
                console.log(data)
            } else {
                alert("Failed to fetch rooms")
            }
            setLoading(false)
        };

        fetchRooms();
    }, [])

    // Function to get room image URL - now using Cloudinary URLs directly
    const getRoomImageUrl = (room) => {
        if (!room || !room.images || room.images.length === 0) {
            return defaultHotelImg;
        }
        
        const imagePath = room.images[0].url;
        
        // If it's already a full URL (Cloudinary), use it directly
        return imagePath.startsWith('http') ? imagePath : defaultHotelImg;
    }

    return (
        <div>RoomList</div>
    )
}

export default RoomList