import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { getHotelById, updateHotel, updateHotelImages } from '../../../api/hotelApi';
import './HotelManagement.css'

const UpdateHotel = () => {
    const navigate = useNavigate();
    const { hotelId } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        // Basic Info
        name: "",
        businessName: "",
        description: "",
        images: [],

        // Location
        address: {
            number:"",
            street:"",
            district: "",
            city: "",
        },  

        // Contact Details
        phone: "",
        email: "",
        website: "",
        fax: "",
        socialMedia: {
            facebook: "",
            instagram: "",
            twitter: "",
            linkedin: ""
        },

        // Hotel Details
        totalRooms: "",
        priceRange: {
            min: "",
            max: ""
        },
        currency: "VND",
        minimumStay: "3_OR_LESS",

        // Amenities
        amenities: {
            airportTransfer: false,
            barLounge: false,
            beach: false,
            beverages: false,
            pool: false,
            wifi: false,
            coffee: false,
            airConditioning: false,
            entertainment: false,
            elevator: false,
            wheelchairAccess: false,
            fitness: false,
            breakfast: false,
            petsAllowed: false,
            restaurant: false,
            freeParking: false,
            wineBar: false
        }
    });

    // Fetch hotel data on component mount
    useEffect(() => {
        const fetchHotelData = async () => {
            try {
                setLoading(true);
                const hotelData = await getHotelById(hotelId);
                console.log("Fetched update hotel data:", hotelData);
                
                // Format the data to match our form structure
                setFormData({
                    name: hotelData.name || "",
                    businessName: hotelData.businessName || "",
                    description: hotelData.description || "",
                    images: hotelData.images,
                    newImages: [],                    
                    // Location
                    address: {
                        number: hotelData.address?.number || "",
                        street: hotelData.address?.street || "",
                        district: hotelData.address?.district || "",
                        city: hotelData.address?.city || "",
                    },
                    
                    // Contact Details
                    phone: hotelData.phone || "",
                    email: hotelData.email || "",
                    website: hotelData.website || "",
                    socialMedia: {
                        facebook: hotelData.socialMedia?.facebook || "",
                        instagram: hotelData.socialMedia?.instagram || "",
                        twitter: hotelData.socialMedia?.twitter || "",
                        linkedin: hotelData.socialMedia?.linkedin || "",
                    },
                    
                    // Hotel Details
                    totalRooms: hotelData.totalRooms || "",
                    priceRange: {
                        min: hotelData.priceRange?.min || "",
                        max: hotelData.priceRange?.max || "",
                    },
                    
                    // Amenities
                    amenities: {
                        airportTransfer: hotelData.services?.AIRPORTTRANSFER || hotelData.services?.airportTransfer || false,
                        barLounge: hotelData.services?.BARLOUNGE || hotelData.services?.barLounge || false,
                        beach: hotelData.services?.BEACH || hotelData.services?.beach || false,
                        beverages: hotelData.services?.BEVERAGES || hotelData.services?.beverages || false,
                        pool: hotelData.services?.POOL || hotelData.services?.pool || false,
                        wifi: hotelData.services?.WIFI || hotelData.services?.wifi || false,
                        coffee: hotelData.services?.COFFEE || hotelData.services?.coffee || false,
                        airConditioning: hotelData.services?.AIRCONDITIONING || hotelData.services?.airConditioning || false,
                        entertainment: hotelData.services?.ENTERTAINMENT || hotelData.services?.entertainment || false,
                        elevator: hotelData.services?.ELEVATOR || hotelData.services?.elevator || false,
                        wheelchairAccess: hotelData.services?.WHEELCHAIRACCESS || hotelData.services?.wheelchairAccess || false,
                        fitness: hotelData.services?.FITNESS || hotelData.services?.fitness || false,
                        breakfast: hotelData.services?.BREAKFAST || hotelData.services?.breakfast || false,
                        petsAllowed: hotelData.services?.PETSALLOWED || hotelData.services?.petsAllowed || false,
                        restaurant: hotelData.services?.RESTAURANT || hotelData.services?.restaurant || false,
                        freeParking: hotelData.services?.FREEPARKING || hotelData.services?.freeParking || false,
                        wineBar: hotelData.services?.WINEBAR || hotelData.services?.wineBar || false,
                    },
                });
                
                setLoading(false);
            } catch (err) {
                console.error("Error fetching hotel data:", err);
                setError("Failed to load hotel data. Please try again.");
                setLoading(false);
            }
        };
        
        fetchHotelData();
        document.title = 'Update Hotel - Partner Dashboard'; // Set the document title
    }, [hotelId]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === 'checkbox') {
            setFormData(prev => ({
                ...prev,
                amenities: {
                    ...prev.amenities,
                    [name]: checked
                }
            }));
        }
        else if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        setFormData(prev => ({
            ...prev,
            images: files
        }));
    };

    const validation = () => {
        const errors = {};

        // Basic validations
        if (!formData.name) errors.name = "Hotel name is required";
        if (!formData.businessName) errors.businessName = "Business name is required";
        if (!formData.description) errors.description = "Description is required";
        if (formData.description.length > 400) errors.description = "Description must be less than 400 characters";

        // Location validations
        if (!formData.address.district) errors.district = "District is required";
        if (!formData.address.city) errors.city = "City is required";
        if (!formData.address.street) errors.streetAddress = "Street address is required";
        if (!formData.address.number) errors.houseNumber = "House number is required";

        // Contact validations
        if (!formData.phone) errors.phone = "Phone number is required";
        if (!formData.email) errors.email = "Email is required";
        if (formData.email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
            errors.email = "Invalid email address";
        }

        // Price validations
        if (!formData.priceRange.min || !formData.priceRange.max) {
            errors.priceRange = "Price range is required";
        } else if (Number(formData.priceRange.min) > Number(formData.priceRange.max)) {
            errors.priceRange = "Minimum price cannot be greater than maximum price";
        }

        return Object.keys(errors).length === 0 ? null : errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = validation();
        
        if (errors) {
            setError(errors);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            
            // First, update the hotel without images
            const { newImages, ...hotelDataToSubmit } = formData;
            const response = await updateHotel(hotelId, hotelDataToSubmit);
            
            // If hotel was updated successfully and we have new images
            if (response && newImages && newImages.length > 0) {
                // Create FormData for image upload
                const formData = new FormData();
                newImages.forEach((image) => {
                    formData.append('images', image);
                });

                // Upload images
                await updateHotelImages(hotelId, formData);
            }

            // Show success message
            alert("Hotel updated successfully!");
            // Redirect to hotel list
            navigate('/partner/hotel-management');
        } catch (err) {
            console.error("Error updating hotel:", err);
            setError(err.message || "Failed to update hotel. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="loading-spinner">
                Loading...
            </div>
        );
    }

    return (
        <div className="hotel-management-container">
            {/* Header with back button */}
            <div className="page-header">
                <button 
                    className="back-button"
                    onClick={() => navigate('/partner/hotel-management')}
                >
                    ← Back to Hotel Management
                </button>
                <h1>Update Hotel</h1>
            </div>
            
            {/* Error display */}
            {error && typeof error === 'string' && (
                <div className="error-message" style={{
                    color: 'red',
                    fontWeight: 'bold',
                    fontSize: '1.2rem',
                    padding: '10px',
                    margin: '10px 0',
                    borderLeft: '4px solid red',
                    backgroundColor: 'rgba(255, 0, 0, 0.05)'
                }}>
                    {error}
                </div>
            )}

            {/* Form container */}
            <div className="form-container">
                <form onSubmit={handleSubmit}>
                    /* Basic Information Section */
                                        <div className="form-section">
                                            <h2>Basic Information</h2>
                                            <div className="form-group">
                                                <label htmlFor="name">Hotel Name*</label>
                                                <input
                                                    type="text"
                                                    id="name"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    className={error?.name ? "error" : ""}
                                                    placeholder="Enter hotel name"
                                                />
                                                {error?.name && <div className="error-text" 
                                                style={{
                                                    color: 'red',
                                                    fontWeight: 'bold',
                                                    fontSize: '1.2rem',
                                                    padding: '10px',
                                                    margin: '10px 0',
                                                    borderLeft: '4px solid red',
                                                    backgroundColor: 'rgba(255, 0, 0, 0.05)'
                                                }}
                                                >{error.name}</div>}
                                            </div>
                                            
                                            <div className="form-group">
                                                <label htmlFor="businessName">Business Name*</label>
                                                <input
                                                    type="text"
                                                    id="businessName"
                                                    name="businessName"
                                                    value={formData.businessName}
                                                    onChange={handleInputChange}
                                                    className={error?.businessName ? "error" : ""}
                                                    placeholder="Enter business name"
                                                />
                                                {error?.businessName && <div className="error-text">{error.businessName}</div>}
                                            </div>
                                            
                                            <div className="form-group">
                                                <label htmlFor="description">Description*</label>
                                                <textarea
                                                    id="description"
                                                    name="description"
                                                    value={formData.description}
                                                    onChange={handleInputChange}
                                                    className={error?.description ? "error" : ""}
                                                    placeholder="Describe your hotel (max 400 characters)"
                                                    rows="4"
                                                />
                                                {error?.description && <div className="error-text">{error.description}</div>}
                                                <div className="character-count">
                                                    {formData.description.length}/400
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <label>Current Hotel Images</label>
                                                <div className="hotel-images-grid">
                                                    {loading ? (
                                                        <p>Loading images...</p>
                                                    ) : (
                                                        <div className="existing-images">
                                                            {Array.isArray(formData.images) && formData.images.length > 0 ? (
                                                                formData.images.map((image, index) => (
                                                                    <div className="image-container" key={index}>
                                                                        <img 
                                                                            src={image.url} 
                                                                            alt={`Hotel image ${index + 1}`} 
                                                                            className="hotel-image-thumbnail" 
                                                                        />
                                                                    </div>
                                                                ))
                                                            ) : (
                                                                <p>No images available</p>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            <div className="form-group">
                                                <label htmlFor="images">Update Hotel Images</label>
                                                <input
                                                    type="file"
                                                    id="images"
                                                    name="images"
                                                    onChange={handleImageUpload}
                                                    multiple
                                                    className="file-upload"
                                                    accept="image/*"
                                                />
                                                <div className="upload-info">
                                                    Upload up to 10 images (JPEG, PNG, WebP) - These will be added to existing images
                                                </div>
                                                {formData.images.length > 0 && (
                                                    <div className="selected-files">
                                                        {formData.images.length} new file(s) selected
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                    <div className="form-section">
                        <h2>Location</h2>
                        <div className="form-row">
                            <div className="form-group half-width">
                                <label htmlFor="address.number">House Number*</label>
                                <input
                                    type="text"
                                    id="address.number"
                                    name="address.number"
                                    value={formData.address.number}
                                    onChange={handleInputChange}
                                    className={error?.houseNumber ? "error" : ""}
                                    placeholder="House number"
                                />
                                {error?.houseNumber && <div className="error-text">{error.houseNumber}</div>}
                            </div>
                            <div className="form-group half-width">
                                <label htmlFor="address.street">Street Address*</label>
                                <input
                                    type="text"
                                    id="address.street"
                                    name="address.street"
                                    value={formData.address.street}
                                    onChange={handleInputChange}
                                    className={error?.streetAddress ? "error" : ""}
                                    placeholder="Street name"
                                />
                                {error?.streetAddress && <div className="error-text">{error.streetAddress}</div>}
                            </div>
                        </div>
                        
                        <div className="form-row">
                            <div className="form-group half-width">
                                <label htmlFor="address.district">District*</label>
                                <input
                                    type="text"
                                    id="address.district"
                                    name="address.district"
                                    value={formData.address.district}
                                    onChange={handleInputChange}
                                    className={error?.district ? "error" : ""}
                                    placeholder="District"
                                />
                                {error?.district && <div className="error-text">{error.district}</div>}
                            </div>
                            <div className="form-group half-width">
                                <label htmlFor="address.city">City*</label>
                                <input
                                    type="text"
                                    id="address.city"
                                    name="address.city"
                                    value={formData.address.city}
                                    onChange={handleInputChange}
                                    className={error?.city ? "error" : ""}
                                    placeholder="City"
                                />
                                {error?.city && <div className="error-text">{error.city}</div>}
                            </div>
                        </div>
                    </div>
                    
                    {/* Contact Section */}
                    <div className="form-section">
                        <h2>Contact Details</h2>
                        <div className="form-row">
                            <div className="form-group half-width">
                                <label htmlFor="phone">Phone Number*</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className={error?.phone ? "error" : ""}
                                    placeholder="Phone number"
                                />
                                {error?.phone && <div className="error-text">{error.phone}</div>}
                            </div>
                            <div className="form-group half-width">
                                <label htmlFor="email">Email*</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className={error?.email ? "error" : ""}
                                    placeholder="Email"
                                />
                                {error?.email && <div className="error-text">{error.email}</div>}
                            </div>
                        </div>
                        
                        <div className="form-row">
                            <div className="form-group half-width">
                                <label htmlFor="website">Website (Optional)</label>
                                <input
                                    type="url"
                                    id="website"
                                    name="website"
                                    value={formData.website}
                                    onChange={handleInputChange}
                                    placeholder="Hotel website"
                                />
                            </div>
                            <div className="form-group half-width">
                                <label htmlFor="fax">Fax (Optional)</label>
                                <input
                                    type="text"
                                    id="fax"
                                    name="fax"
                                    value={formData.fax}
                                    onChange={handleInputChange}
                                    placeholder="Fax number"
                                />
                            </div>
                        </div>
                        
                        <h3>Social Media (Optional)</h3>
                        <div className="form-row">
                            <div className="form-group half-width">
                                <label htmlFor="socialMedia.facebook">Facebook</label>
                                <input
                                    type="text"
                                    id="socialMedia.facebook"
                                    name="socialMedia.facebook"
                                    value={formData.socialMedia.facebook}
                                    onChange={handleInputChange}
                                    placeholder="Facebook page URL"
                                />
                            </div>
                            <div className="form-group half-width">
                                <label htmlFor="socialMedia.instagram">Instagram</label>
                                <input
                                    type="text"
                                    id="socialMedia.instagram"
                                    name="socialMedia.instagram"
                                    value={formData.socialMedia.instagram}
                                    onChange={handleInputChange}
                                    placeholder="Instagram handle"
                                />
                            </div>
                        </div>
                        
                        <div className="form-row">
                            <div className="form-group half-width">
                                <label htmlFor="socialMedia.twitter">Twitter</label>
                                <input
                                    type="text"
                                    id="socialMedia.twitter"
                                    name="socialMedia.twitter"
                                    value={formData.socialMedia.twitter}
                                    onChange={handleInputChange}
                                    placeholder="Twitter handle"
                                />
                            </div>
                            <div className="form-group half-width">
                                <label htmlFor="socialMedia.linkedin">LinkedIn</label>
                                <input
                                    type="text"
                                    id="socialMedia.linkedin"
                                    name="socialMedia.linkedin"
                                    value={formData.socialMedia.linkedin}
                                    onChange={handleInputChange}
                                    placeholder="LinkedIn URL"
                                />
                            </div>
                        </div>
                    </div>
                    
                    {/* Hotel Details Section */}
                    <div className="form-section">
                        <h2>Hotel Details</h2>
                        <div className="form-row">
                            <div className="form-group half-width">
                                <label htmlFor="totalRooms">Total Rooms</label>
                                <input
                                    type="number"
                                    id="totalRooms"
                                    name="totalRooms"
                                    value={formData.totalRooms}
                                    onChange={handleInputChange}
                                    placeholder="Number of rooms"
                                    min="1"
                                />
                            </div>
                            <div className="form-group half-width">
                                <label htmlFor="minimumStay">Minimum Stay</label>
                                <select
                                    id="minimumStay"
                                    name="minimumStay"
                                    value={formData.minimumStay}
                                    onChange={handleInputChange}
                                >
                                    <option value="3_OR_LESS">3 Days or Less</option>
                                    <option value="1_WEEK">1 Week</option>
                                    <option value="2_WEEKS">2 Weeks</option>
                                    <option value="1_MONTH">1 Month</option>
                                    <option value="3_MONTHS">3 Months</option>
                                    <option value="6_MONTHS">6 Months</option>
                                </select>
                            </div>
                        </div>
                        
                        <div className="form-row">
                            <div className="form-group third-width">
                                <label htmlFor="priceRange.min">Min Price*</label>
                                <input
                                    type="number"
                                    id="priceRange.min"
                                    name="priceRange.min"
                                    value={formData.priceRange.min}
                                    onChange={handleInputChange}
                                    className={error?.priceRange ? "error" : ""}
                                    placeholder="Minimum price"
                                    min="0"
                                />
                            </div>
                            <div className="form-group third-width">
                                <label htmlFor="priceRange.max">Max Price*</label>
                                <input
                                    type="number"
                                    id="priceRange.max"
                                    name="priceRange.max"
                                    value={formData.priceRange.max}
                                    onChange={handleInputChange}
                                    className={error?.priceRange ? "error" : ""}
                                    placeholder="Maximum price"
                                    min="0"
                                />
                            </div>
                            <div className="form-group third-width">
                                <label htmlFor="currency">Currency</label>
                                <select
                                    id="currency"
                                    name="currency"
                                    value={formData.currency}
                                    onChange={handleInputChange}
                                >
                                    <option value="VND">VND</option>
                                    <option value="USD">USD</option>
                                    <option value="EUR">EUR</option>
                                </select>
                            </div>
                        </div>
                        {error?.priceRange && <div className="error-text">{error.priceRange}</div>}
                    </div>
                    
                    {/* Amenities Section */}
                    <div className="form-section">
                        <h2>Amenities</h2>
                        <div className="amenities-grid">
                            <div className="amenity-item">
                                <input
                                    type="checkbox"
                                    id="wifi"
                                    name="wifi"
                                    checked={formData.amenities.wifi}
                                    onChange={handleInputChange}
                                />
                                <label htmlFor="wifi">WiFi</label>
                            </div>
                            
                            <div className="amenity-item">
                                <input
                                    type="checkbox"
                                    id="pool"
                                    name="pool"
                                    checked={formData.amenities.pool}
                                    onChange={handleInputChange}
                                />
                                <label htmlFor="pool">Swimming Pool</label>
                            </div>
                            
                            <div className="amenity-item">
                                <input
                                    type="checkbox"
                                    id="airConditioning"
                                    name="airConditioning"
                                    checked={formData.amenities.airConditioning}
                                    onChange={handleInputChange}
                                />
                                <label htmlFor="airConditioning">Air Conditioning</label>
                            </div>
                            
                            <div className="amenity-item">
                                <input
                                    type="checkbox"
                                    id="breakfast"
                                    name="breakfast"
                                    checked={formData.amenities.breakfast}
                                    onChange={handleInputChange}
                                />
                                <label htmlFor="breakfast">Free Breakfast</label>
                            </div>
                            
                            <div className="amenity-item">
                                <input
                                    type="checkbox"
                                    id="freeParking"
                                    name="freeParking"
                                    checked={formData.amenities.freeParking}
                                    onChange={handleInputChange}
                                />
                                <label htmlFor="freeParking">Free Parking</label>
                            </div>
                            
                            <div className="amenity-item">
                                <input
                                    type="checkbox"
                                    id="restaurant"
                                    name="restaurant"
                                    checked={formData.amenities.restaurant}
                                    onChange={handleInputChange}
                                />
                                <label htmlFor="restaurant">Restaurant</label>
                            </div>
                            
                            <div className="amenity-item">
                                <input
                                    type="checkbox"
                                    id="barLounge"
                                    name="barLounge"
                                    checked={formData.amenities.barLounge}
                                    onChange={handleInputChange}
                                />
                                <label htmlFor="barLounge">Bar/Lounge</label>
                            </div>
                            
                            <div className="amenity-item">
                                <input
                                    type="checkbox"
                                    id="fitness"
                                    name="fitness"
                                    checked={formData.amenities.fitness}
                                    onChange={handleInputChange}
                                />
                                <label htmlFor="fitness">Fitness Center</label>
                            </div>
                            
                            <div className="amenity-item">
                                <input
                                    type="checkbox"
                                    id="coffee"
                                    name="coffee"
                                    checked={formData.amenities.coffee}
                                    onChange={handleInputChange}
                                />
                                <label htmlFor="coffee">Coffee Shop</label>
                            </div>
                            
                            <div className="amenity-item">
                                <input
                                    type="checkbox"
                                    id="wineBar"
                                    name="wineBar"
                                    checked={formData.amenities.wineBar}
                                    onChange={handleInputChange}
                                />
                                <label htmlFor="wineBar">Wine Bar</label>
                            </div>
                            
                            <div className="amenity-item">
                                <input
                                    type="checkbox"
                                    id="beach"
                                    name="beach"
                                    checked={formData.amenities.beach}
                                    onChange={handleInputChange}
                                />
                                <label htmlFor="beach">Beach Access</label>
                            </div>
                            
                            <div className="amenity-item">
                                <input
                                    type="checkbox"
                                    id="elevator"
                                    name="elevator"
                                    checked={formData.amenities.elevator}
                                    onChange={handleInputChange}
                                />
                                <label htmlFor="elevator">Elevator</label>
                            </div>
                            
                            <div className="amenity-item">
                                <input
                                    type="checkbox"
                                    id="entertainment"
                                    name="entertainment"
                                    checked={formData.amenities.entertainment}
                                    onChange={handleInputChange}
                                />
                                <label htmlFor="entertainment">Entertainment</label>
                            </div>
                            
                            <div className="amenity-item">
                                <input
                                    type="checkbox"
                                    id="petsAllowed"
                                    name="petsAllowed"
                                    checked={formData.amenities.petsAllowed}
                                    onChange={handleInputChange}
                                />
                                <label htmlFor="petsAllowed">Pets Allowed</label>
                            </div>
                            
                            <div className="amenity-item">
                                <input
                                    type="checkbox"
                                    id="wheelchairAccess"
                                    name="wheelchairAccess"
                                    checked={formData.amenities.wheelchairAccess}
                                    onChange={handleInputChange}
                                />
                                <label htmlFor="wheelchairAccess">Wheelchair Access</label>
                            </div>
                            
                            <div className="amenity-item">
                                <input
                                    type="checkbox"
                                    id="airportTransfer"
                                    name="airportTransfer"
                                    checked={formData.amenities.airportTransfer}
                                    onChange={handleInputChange}
                                />
                                <label htmlFor="airportTransfer">Airport Transfer</label>
                            </div>
                        </div>
                    </div>
                    
                    {/* Form Submit Buttons */}
                    <div className="form-actions">
                        <button 
                            type="button" 
                            className="cancel-button"
                            onClick={() => navigate('/partner/hotel-management')}
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="submit-button"
                            disabled={loading}
                        >
                            {loading ? "Updating..." : "Update Hotel"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateHotel