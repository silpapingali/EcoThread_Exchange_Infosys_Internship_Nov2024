import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateItem.css';

const CreateItem = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        // country: '',
        // location: '',
        preferences: '',
        size: '',
        image: null, 
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = (e) => {
        setFormData({ ...formData, image: e.target.files[0] }); 
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSubmit = new FormData();
        for (const key in formData) {
            formDataToSubmit.append(key, formData[key]);
        }

        
        try {
            const response = await fetch('http://localhost:8080/api/items', {
                method: 'POST',
                body: formDataToSubmit,
            });
            const newItem = await response.json();
            console.log("New item created:", newItem);
            alert("New item created successfully!");
            navigate('/');
        } catch (error) {
            console.error("Error creating item:", error);
            alert("Failed to create item. Please try again.");
        }
    };

    return (
        <div className="create-item-container">
            <h1>Create New Item</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="title">Title</label>
                <input id="title" name="title" value={formData.title} onChange={handleChange} type="text" required />

                <label htmlFor="description">Description</label>
                <textarea id="description" name="description" value={formData.description} onChange={handleChange} required />

                <label htmlFor="price">Price</label>
                <input id="price" name="price" value={formData.price} onChange={handleChange} type="number" required />

                {/* <label htmlFor="country">Country</label>
                <input id="country" name="country" value={formData.country} onChange={handleChange} type="text" required />

                <label htmlFor="location">Location</label>
                <input id="location" name="location" value={formData.location} onChange={handleChange} type="text" required /> */}

                <label htmlFor="preferences">Preferences</label>
                <input id="preferences" name="preferences" value={formData.preferences} onChange={handleChange} type="text" required />

                <label htmlFor="size">Size</label>
                <input id="size" name="size" value={formData.size} onChange={handleChange} type="text" required />

                <label htmlFor="image">Upload Image</label>
                <input id="image" name="image" type="file" accept="image/*" onChange={handleImageChange} /> {/* Image upload input */}

                <button type="submit">Create Item</button>
            </form>
        </div>
    );
};

export default CreateItem;