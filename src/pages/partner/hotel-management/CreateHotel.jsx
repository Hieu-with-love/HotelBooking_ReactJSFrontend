import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { createHotel, updateHotelImages } from '../../../api/hotelApi';
import './HotelManagement.css'

const CreateHotel = () => {
    const navigate = useNavigate();
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

    useEffect(() => {
        // Simulate loading delay
        setTimeout(() => {
            setLoading(false);
        }, 1000);
        document.title = "Create New Hotel | Partner Management";
    }, []);

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

            console.log("Checkbox changed:", name, checked);
        }
        // Get email ? 
        else if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
            console.log("Nested input changed:", parent, child, value);
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
            console.log("Input changed:", name, value);
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
            
            // First, create the hotel without images
            const { images, ...hotelDataToSubmit } = formData;
            const response = await createHotel(hotelDataToSubmit);
            
            if (response && response.id) {
                // If hotel was created successfully and we have images
                if (images && images.length > 0) {
                    // Create FormData for image upload
                    const formData = new FormData();
                    images.forEach((image, index) => {
                        formData.append('images', image);
                    });

                    // Upload images
                    await updateHotelImages(response.id, formData);
                }

                // Show success message
                alert("Hotel created successfully!");
                // Redirect to hotel list
                navigate('/partner/hotel-management');
            } else {
                throw new Error("Failed to create hotel");
            }
        } catch (err) {
            console.error("Error creating hotel:", err);
            setError(err.message || "Failed to create hotel. Please try again.");
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
                <h1>Create New Hotel</h1>
            </div>
            
            {/* Error display */}
            {error && typeof error === 'string' && (
                <div className="error-message">
                    {error}
                </div>
            )}
            
            {/* Form container */}
            <div className="form-container">
                <form onSubmit={handleSubmit}>
                    {/* Basic Information Section */}
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
                            {error?.name && <div className="error-text">{error.name}</div>}
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
                            <label htmlFor="images">Hotel Images</label>
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
                                Upload up to 10 images (JPEG, PNG, WebP)
                            </div>
                            {formData.images.length > 0 && (
                                <div className="selected-files">
                                    {formData.images.length} file(s) selected
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {/* Location Section */}
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
                            {loading ? "Creating..." : "Create Hotel"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateHotel