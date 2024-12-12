import React, { useState } from "react";
import Navbar from "./NavBar";
import axios from "axios";
import { useNavigate } from "react-router-dom";  // Import useNavigate from react-router-dom
import "../Cards2.css";

const Trades = () => {
  const [item, setItem] = useState({
    title: "",
    size: "",
    condition: "",
    preferences: "",
  });

  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate(); // Initialize navigate function

  const validateForm = () => {
    const newErrors = {};

    // Title validation: Min 3, Max 100 characters
    const normalizedTitle = item.title.trim();
    if (!normalizedTitle) {
      newErrors.title = "Title is required.";
    } else if (normalizedTitle.length < 3) {
      newErrors.title = "Title must be at least 3 characters long.";
    } else if (normalizedTitle.length > 100) {
      newErrors.title = "Title must be no more than 100 characters.";
    }

    // Size validation: Convert to uppercase for comparison
    const validSizes = ["S", "M", "L", "XL", "XXL"];
    const normalizedSize = item.size.trim().toUpperCase();
    if (!normalizedSize) {
      newErrors.size = "Size is required.";
    } else if (!validSizes.includes(normalizedSize)) {
      newErrors.size = `Size must be one of ${validSizes.join(", ")}.`;
    }

    // Condition validation: Convert to lowercase for case-insensitive matching
    const validConditions = ["New", "Like New", "Good", "Fair", "Poor"];
    const normalizedCondition = item.condition.trim().toLowerCase();
    if (!normalizedCondition) {
      newErrors.condition = "Condition is required.";
    } else if (!validConditions.map(cond => cond.toLowerCase()).includes(normalizedCondition)) {
      newErrors.condition = `Condition must be one of ${validConditions.join(", ")}.`;
    }

    // Preferences validation: Min 10 characters
    const normalizedPreferences = item.preferences.trim();
    if (!normalizedPreferences) {
      newErrors.preferences = "Preferences are required.";
    } else if (normalizedPreferences.length < 10) {
      newErrors.preferences = "Preferences must be at least 10 characters long.";
    }

    // Image validation: Check for valid image format and size limit (5MB)
    if (!image) {
      newErrors.image = "Image is required.";
    } else {
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (!allowedTypes.includes(image.type)) {
        newErrors.image = "Please upload a valid image (JPG, PNG, JPEG).";
      }

      // Validate image size (max size: 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (image.size > maxSize) {
        newErrors.image = "Image size must be less than 5MB.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItem((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const formData = new FormData();
    formData.append("title", item.title);
    formData.append("size", item.size);
    formData.append("condition", item.condition);
    formData.append("preferences", item.preferences);
    formData.append("image", image);

    try {
      const response = await axios.post("http://localhost:3000/api/items/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Item created successfully!");  // Popup message on success
      console.log(response.data);

      // Redirect to homepage after success
      navigate("/home");  // Use navigate() to go to the homepage

      setItem({
        title: "",
        size: "",
        condition: "",
        preferences: "",
      });
      setImage(null);
      setErrors({});
    } catch (error) {
      console.error("Error creating item", error);
      alert("Failed to create item.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="trades-container">
        <form onSubmit={handleSubmit} className="item-form">
          <h1 className="trades-heading">Create New Item</h1>
          <div className="form-group">
            <label htmlFor="title">Title:</label>
            <input
              type="text"
              id="title"
              name="title"
              value={item.title}
              onChange={handleChange}
              required
            />
            {errors.title && <p className="error-message">{errors.title}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="size">Size:</label>
            <input
              type="text"
              id="size"
              name="size"
              value={item.size}
              onChange={handleChange}
              required
            />
            {errors.size && <p className="error-message">{errors.size}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="condition">Condition:</label>
            <input
              type="text"
              id="condition"
              name="condition"
              value={item.condition}
              onChange={handleChange}
              required
            />
            {errors.condition && <p className="error-message">{errors.condition}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="preferences">Preferences:</label>
            <input
              type="text"
              id="preferences"
              name="preferences"
              value={item.preferences}
              onChange={handleChange}
              required
            />
            {errors.preferences && <p className="error-message">{errors.preferences}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="image">Upload Image:</label>
            <input type="file" id="image" onChange={handleImageChange} required />
            {errors.image && <p className="error-message">{errors.image}</p>}
          </div>
          <button type="submit" className="submit-button">
            Post
          </button>
        </form>
      </div>
    </>
  );
};

export default Trades;
