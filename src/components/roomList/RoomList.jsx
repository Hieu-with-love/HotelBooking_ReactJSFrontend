import React from 'react'

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

    return (
        <div>RoomList</div>
    )
}

export default RoomList