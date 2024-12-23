import React, { useState, useEffect } from 'react';
import axios from 'axios';

function GamePage() {
  const [gameState, setGameState] = useState(null);
  const [gameId, setGameId] = useState(null);  // Store gameId in state

  // Fetch the game state whenever the gameId changes
  useEffect(() => {
    if (gameId) { // Make sure gameId is set before fetching
      axios.get(`http://localhost:5000/game/game-state?gameId=${gameId}`)
        .then(response => {
          setGameState(response.data); // Set the game state
        })
        .catch(error => {
          console.error('Error fetching game state:', error);
        });
    }
  }, [gameId]);  // Only run this effect when gameId changes

  const startNewGame = async (playerName) => {
    try {
      const response = await axios.post('http://localhost:5000/game/start', { playerName });
      const { game } = response.data;

      if (game) {
        setGameId(game.gameId);  // Set the gameId after the game is created
        setGameState(game);      // Optionally, set the initial game state
      }
    } catch (error) {
      console.error('Error starting new game:', error);
    }
  };

  return (
    <div>
      <button onClick={() => startNewGame('Player1')}>Start New Game</button>

      {gameState && (
        <div>
          <h1>Game State</h1>
          <pre>{JSON.stringify(gameState, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default GamePage;
