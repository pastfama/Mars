import React, { useEffect, useState } from 'react';
import axios from 'axios';

const GamePage = () => {
  const [gameState, setGameState] = useState(null);

  useEffect(() => {
    // Fetch the game state when the component mounts
    axios.get('http://localhost:5000/game-state')
      .then(response => {
        setGameState(response.data);
      })
      .catch(error => {
        console.error('Error fetching game state:', error);
      });
  }, []);

  return (
    <div>
      <h1>Game Page</h1>
      <p>Current Game State:</p>
      {gameState ? (
        <pre>{JSON.stringify(gameState, null, 2)}</pre>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default GamePage;
