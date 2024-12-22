import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import EditItem from '../EditItemPage/EditItem'; 
import './ViewItem.css'; 

const ViewItem = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/items/${id}`);
        setItem(response.data);
      } catch (error) {
        console.error("Error fetching item:", error);
      }
    };
    fetchItem();
  }, [id]);

  if (!item) return <div>Loading...</div>;

  return (
    <div className="view-item-container">
      <img src={`http://localhost:8080/${item.image}`} alt={item.title} className="view-item-image" />
      <div className="view-item-details">
        <h3 className="view-item-title">{item.title}</h3>
        <p>Size: {item.size}</p>
        <p>Description: {item.description}</p>
        <p>Price: &#8377; {item.price.toLocaleString("en-IN")}</p>
        <p>Preferences: {item.preferences}</p>
        <p>Posted by: {item.postedBy} on {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : new Date().toLocaleDateString()}</p>
        
        <Link to={`/trades/${item._id}`} className="trade-button">Trade</Link>
        <button className="go-back-button" onClick={() => navigate('/')}>Go Back</button>
      </div>
      {isEditing && <EditItem item={item} onUpdate={() => setIsEditing(false)} />}
    </div>
  );
};

export default ViewItem;