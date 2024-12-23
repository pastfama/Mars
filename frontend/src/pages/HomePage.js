import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../assets/images/background.webp'; // Import the background image
import './HomePage.css'; // Import the CSS for styling

const HomePage = () => {
  const [playerName, setPlayerName] = useState('');
  const navigate = useNavigate(); // Move useNavigate hook to the top level of the component
  const [isLoading, setIsLoading] = useState(false); // Track loading state

  // Handle the start of a new game
  const startNewGame = async () => {
    if (!playerName.trim()) {
      alert("Please enter your name!"); // Prompt if the player hasn't entered their name
      return;
    }

    setIsLoading(true); // Show loading state

    try {
      const response = await axios.post('http://localhost:5000/game/new-game', { playerName });
      alert(response.data.message); // Display success message

      // Redirect to the GamePage after starting the game
      navigate('/new-colony');
    } catch (error) {
      console.error('Error starting new game:', error);
      alert('There was an error starting the game. Please try again.');
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  // Handle load of an existing game
  const loadGame = () => {
    alert("Load game functionality coming soon!");
  };

  // Handle settings (this can be expanded later)
  const goToSettings = () => {
    alert("Settings functionality coming soon!");
  };

  return (
    <div className="homepage-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="content">
        <h1 className="title">Mars: A New Hope</h1>
        <input
          className="input"
          type="text"
          placeholder="Enter your name"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
        />
        <div className="button-container">
          <button
            className="button"
            onClick={startNewGame}
            disabled={isLoading}
          >
            {isLoading ? 'Starting Game...' : 'Start New Game'}
          </button>
          <button
            className="button"
            onClick={loadGame}
            disabled={isLoading}
          >
            Load Game
          </button>
          <button
            className="button"
            onClick={goToSettings}
            disabled={isLoading}
          >
            Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
