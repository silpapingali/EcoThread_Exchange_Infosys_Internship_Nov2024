import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './EditItem.css'; 

const EditItem = ({ onUpdate }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        preferences: '',
        size: '',
    });

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/items/${id}`);
                setFormData(response.data);
            } catch (error) {
                console.error("Error fetching item:", error);
            }
        };
        fetchItem();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:8080/api/items/${id}`, formData);
            alert("Item updated successfully!");
            // navigate('/listings');
        } catch (error) {
            console.error("Error updating item:", error);
            alert("Failed to update item. Please try again.");
        }
    };

    const handleCancel = () => {
        navigate('/myitem');
    };

    return (
        <div className="edit-item">
            <h1>Edit Item</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="title">Title</label>
                <input id="title" name="title" value={formData.title} onChange={handleChange} type="text" required />

                <label htmlFor="description">Description</label>
                <textarea id="description" name="description" value={formData.description} onChange={handleChange} required />

                <label htmlFor="price">Price</label>
                <input id="price" name="price" value={formData.price} onChange={handleChange} type="number" required />


                <label htmlFor="preferences">Preferences</label>
                <input id="preferences" name="preferences" value={formData.preferences} onChange={handleChange} type="text" required />

                <label htmlFor="size">Size</label>
                <input id="size" name="size" value={formData.size} onChange={handleChange} type="text" required />

                <button type="submit">Update Item</button>
                <button type="button" onClick={handleCancel}>Cancel</button>
            </form>
        </div>
    );
};

export default EditItem;