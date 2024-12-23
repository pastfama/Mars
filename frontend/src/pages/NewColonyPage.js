import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import newbornImage from '../assets/images/newborn.webp'; // Import the new background image
import './NewColonyPage.css'; // Create a new CSS for this page

const NewColonyPage = () => {
  const navigate = useNavigate(); // Use navigate for redirection

  const [isLoading, setIsLoading] = useState(false); // Track loading state

  // Handle colony creation based on size
  const createColony = async (size) => {
    setIsLoading(true); // Set loading state

    try {
      // You can replace this URL with the actual endpoint for colony creation
      const response = await axios.post(`http://localhost:5000/colony/create`, { size });
      alert(response.data.message); // Show success message

      // Redirect to the game page (or wherever appropriate after colony creation)
      navigate('/game-page');
    } catch (error) {
      console.error('Error creating colony:', error);
      alert('There was an error creating the colony. Please try again.');
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <div className="new-colony-page" style={{ backgroundImage: `url(${newbornImage})` }}>
      <div className="content">
        <h1 className="title">Select Colony Size</h1>
        <div className="button-container">
          <button
            className="colony-button small"
            onClick={() => createColony('small')}
            disabled={isLoading}
          >
            Small (5-10)
          </button>
          <button
            className="colony-button medium"
            onClick={() => createColony('medium')}
            disabled={isLoading}
          >
            Medium (20-50)
          </button>
          <button
            className="colony-button large"
            onClick={() => createColony('large')}
            disabled={isLoading}
          >
            Large (100-500)
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewColonyPage;
