import React, { useState } from 'react';
import axios from 'axios';

const MainMenu = () => {
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

  // Handle the load of an existing game (this would need an API route later)
  const loadGame = () => {
    alert("Load game functionality coming soon!");
  };

  // Handle settings (this can be expanded later)
  const goToSettings = () => {
    alert("Settings functionality coming soon!");
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Mars: A New Hope</h1>
      <input
        style={styles.input}
        type="text"
        placeholder="Enter your name"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
      />
      <div style={styles.buttonContainer}>
        <button style={styles.button} onClick={startNewGame}>
          Start New Game
        </button>
        <button style={styles.button} onClick={loadGame}>
          Load Game
        </button>
        <button style={styles.button} onClick={goToSettings}>
          Settings
        </button>
      </div>
    </div>
  );
};

// Styling for the MainMenu component
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#2e3a47',  // Dark blue background, Mars-themed
    color: '#fff',
    fontFamily: 'Arial, sans-serif',
  },
  title: {
    fontSize: '3rem',
    marginBottom: '2rem',
    textAlign: 'center',
  },
  input: {
    padding: '10px',
    fontSize: '1rem',
    marginBottom: '2rem',
    borderRadius: '5px',
    border: '1px solid #ccc',
    width: '200px',
    textAlign: 'center',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  button: {
    fontSize: '1.2rem',
    padding: '0.8rem 1.5rem',
    backgroundColor: '#ff5733',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    width: '200px',
  },
};

export default MainMenu;
