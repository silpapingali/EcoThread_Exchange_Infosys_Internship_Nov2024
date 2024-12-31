import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateItem.css';

const CreateItem = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        preferences: '',
        size: '',
        image: null, 
    });
    const [preferencesWarning, setPreferencesWarning] = useState('');
    const [notification, setNotification] = useState({ message: '', type: '' });

    const navigate = useNavigate();

    const showNotification = (message, type) => {
        setNotification({ message, type });
        setTimeout(() => {
            setNotification({ message: '', type: '' });
        }, 3000);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'preferences') {
            // Show warning if user types special characters
            if (/[^a-zA-Z0-9\s,]/.test(value)) {
                setPreferencesWarning('Please use only letters, numbers, and spaces');
                showNotification('Please use only letters, numbers, and spaces', 'warning');
            } else {
                setPreferencesWarning('');
            }

            // Add comma after each word
            const formattedValue = value
                .split(' ')
                .filter(word => word.length > 0)
                .join(', ');
            
            // Show warning if more than 5 preferences
            if (formattedValue.split(',').length > 5) {
                setPreferencesWarning('Maximum 5 preferences allowed');
                showNotification('Maximum 5 preferences allowed', 'warning');
            }

            setFormData({ ...formData, [name]: formattedValue });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleCancel = () => {
        navigate('/myitem');
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                showNotification('Image size should be less than 5MB', 'error');
                e.target.value = '';
                return;
            }
            setFormData({ ...formData, image: file });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate preferences
        if (preferencesWarning) {
            showNotification('Please fix the preferences issues before submitting', 'error');
            return;
        }

        const formDataToSubmit = new FormData();
        
        // Format preferences before submitting
        const formattedPreferences = formData.preferences
            .split(',')
            .map(pref => pref.trim())
            .filter(pref => pref.length > 0)
            .join(', ');

        // Validate price
        if (formData.price <= 0) {
            showNotification('Price must be greater than 0', 'error');
            return;
        }

        // Append all form data
        for (const key in formData) {
            if (key === 'preferences') {
                formDataToSubmit.append(key, formattedPreferences);
            } else {
                formDataToSubmit.append(key, formData[key]);
            }
        }

        const token = localStorage.getItem("token"); 

        try {
            const response = await fetch('http://localhost:8080/api/items', {
                method: 'POST',
                headers: {
                    'x-auth-token': token, 
                },
                body: formDataToSubmit,
            });

            if (!response.ok) {
                throw new Error(await response.text()); 
            }

            alert('Item created successfully!'); // Added alert
           
        } catch (error) {
            console.error("Error creating item:", error);
            alert('Failed to create item. Please try again.'); // Added error alert
         
        }
    };

    return (
        <div className="create-item-container">
            {notification.message && (
                <div className={`notification ${notification.type}`}>
                    {notification.message}
                </div>
            )}
            <h1>Create New Item</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input 
                        id="title" 
                        name="title" 
                        value={formData.title} 
                        onChange={handleChange} 
                        type="text" 
                        required 
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea 
                        id="description" 
                        name="description" 
                        value={formData.description} 
                        onChange={handleChange} 
                        required 
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="price">Price</label>
                    <input 
                        id="price" 
                        name="price" 
                        value={formData.price} 
                        onChange={handleChange} 
                        type="number" 
                        required 
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="preferences">
                        Preferences (separate with commas)
                        {preferencesWarning && (
                            <span className="warning-text">{preferencesWarning}</span>
                        )}
                    </label>
                    <input 
                        id="preferences" 
                        name="preferences" 
                        value={formData.preferences} 
                        onChange={handleChange} 
                        type="text" 
                        required 
                        className={preferencesWarning ? 'input-warning' : ''}
                    />
                    <small className="help-text">
                        Example: bag,pant,jacket etc.
                    </small>
                </div>

                <div className="form-group">
                    <label htmlFor="size">Size</label>
                    <input 
                        id="size" 
                        name="size" 
                        value={formData.size} 
                        onChange={handleChange} 
                        type="text" 
                        required 
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="image">Upload Image</label>
                    <input 
                        id="image" 
                        name="image" 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageChange} 
                    />
                    <small className="help-text">
                        Maximum file size: 5MB
                    </small>
                </div>

                <div className="button-container">
                    <button type="submit" className="submit-btn">Create Item</button>
                    <button type="button" className="cancel-btn" onClick={handleCancel}>Cancel</button>
                </div>
            </form>
        </div>
    );
};

export default CreateItem;