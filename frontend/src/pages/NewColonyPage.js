import React, { useState } from 'react';
import axios from 'axios';
import backgroundImage from '../assets/images/newborn.webp'; // Import the image directly

import './HomePage.css'; // Import the CSS for styling

const HomePage = () => {
  const [playerName, setPlayerName] = useState('');

  // Handle the start of a new game
  const startNewGame = async () => {
    if (!playerName) {
      alert("Please enter your name!");
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/new-game', { playerName });
      alert(response.data.message);
    } catch (error) {
      console.error('Error starting new game:', error);
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
          <button className="button" onClick={startNewGame}>
            Start New Game
          </button>
          <button className="button" onClick={loadGame}>
            Load Game
          </button>
          <button className="button" onClick={goToSettings}>
            Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;