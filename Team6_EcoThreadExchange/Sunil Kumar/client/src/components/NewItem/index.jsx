import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './styles.module.css';

const NewItem = ({ onNewItemAdded }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    size: '',
    condition: '',
  });
  const [image, setImage] = useState(null);
  const [preferences, setPreferences] = useState([]);
  const [newPreference, setNewPreference] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch the logged-in user information
    const fetchUser = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/current-user'); // Endpoint for current user
        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    if (e.target.files.length > 0) {
      setImage(e.target.files[0]);
    }
  };

  const handleAddPreference = () => {
    if (newPreference.trim()) {
      setPreferences([...preferences, newPreference.trim()]);
      setNewPreference('');
    }
  };

  const handleDeletePreference = (pref) => {
    setPreferences(preferences.filter((p) => p !== pref));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('size', formData.size);
    formDataToSend.append('condition', formData.condition);
    formDataToSend.append('preferences', JSON.stringify(preferences));
    formDataToSend.append('image', image);
    formDataToSend.append('userId', user?._id);
  
    try {
      const response = await fetch('http://localhost:8080/api/products', {
        method: 'POST',
        body: formDataToSend,
      });
  
      if (response.ok) {
        alert('Product added successfully!');
        setFormData({ title: '', size: '', condition: '' });
        setPreferences([]);
        setImage(null);
        document.querySelector("input[type='file']").value = '';
        onNewItemAdded();
        navigate('/items');
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'An error occurred while adding the product.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>New Item</h2>
        <button onClick={() => navigate('/items')} className={styles.backButton}>
          Go Back
        </button>
      </div>
      <div className={styles.content}>
        <div className={styles.imagePreview}>
          {image ? (
            <img
              src={URL.createObjectURL(image)}
              alt="Preview"
              className={styles.previewImage}
            />
          ) : (
            <div className={styles.placeholderImage}>No image selected</div>
          )}
        </div>
        <div className={styles.formSection}>
          <h3>Item Details</h3>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label>Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Size</label>
              <input
                type="text"
                name="size"
                value={formData.size}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Condition</label>
              <input
                type="text"
                name="condition"
                value={formData.condition}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className={styles.fileInput}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Preferences</label>
              <div className={styles.preferenceInput}>
                <input
                  type="text"
                  value={newPreference}
                  onChange={(e) => setNewPreference(e.target.value)}
                  placeholder="Add preference"
                />
                <button
                  type="button"
                  onClick={handleAddPreference}
                  className={styles.addPreferenceButton}
                >
                  Add
                </button>
              </div>
              <div className={styles.preferences}>
                {preferences.map((pref, index) => (
                  <div key={index} className={styles.preferenceContainer}>
                    <span className={styles.preference}>{pref}</span>
                    <button
                      type="button"
                      onClick={() => handleDeletePreference(pref)}
                      className={styles.deletePreferenceButton}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <button type="submit" className={styles.postButton}>
              Post
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewItem;