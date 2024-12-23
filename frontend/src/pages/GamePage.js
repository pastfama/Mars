import React, { useState, useEffect } from 'react';
import axios from 'axios';

function GamePage() {
  const [gameState, setGameState] = useState(null);
  const [gameId, setGameId] = useState(null);  // Store gameId in state
  const [colonySize, setColonySize] = useState(null); // Store the selected colony size
  const [isTestingPhase, setIsTestingPhase] = useState(true); // For testing phase (disable options)

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

  // Function to start a new game
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

  // Function to create a colony based on selected size
  const createColony = async (size) => {
    try {
      // Depending on the selected size, adjust the colony creation parameters
      const colonyData = {
        size,
        gameId,
        resources: {
          oxygen: size === 'small' ? 1000 : size === 'medium' ? 5000 : 10000,
          water: size === 'small' ? 1000 : size === 'medium' ? 5000 : 10000,
          food: size === 'small' ? 1000 : size === 'medium' ? 5000 : 10000,
          power: size === 'small' ? 1000 : size === 'medium' ? 5000 : 10000,
        },
        infrastructure: {
          livingModules: size === 'small' ? 1 : size === 'medium' ? 5 : 10,
          researchLabs: size === 'small' ? 0 : size === 'medium' ? 2 : 5,
          greenhouses: size === 'small' ? 0 : size === 'medium' ? 1 : 3,
          powerPlants: size === 'small' ? 1 : size === 'medium' ? 2 : 4,
        },
      };

      // Call API to create the colony (replace URL with your actual API endpoint)
      const response = await axios.post('http://localhost:5000/colony/create', colonyData);

      if (response.data) {
        // After creating the colony, you can associate it with the game
        setColonySize(size);
        // Optionally, update game state or perform additional actions
        console.log('Colony created with UUID:', response.data.colonyId);
      }
    } catch (error) {
      console.error('Error creating colony:', error);
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

      {gameId && !colonySize && (
        <div style={{ textAlign: 'center' }}>
          <h2>Select Colony Size</h2>
          <div>
            {/* Small Colony Button */}
            <button
              onClick={() => createColony('small')}
              style={{
                backgroundColor: 'green',
                color: 'white',
                margin: '10px',
                opacity: isTestingPhase ? 1 : 0.8, // Enable if testing phase
                cursor: isTestingPhase ? 'pointer' : 'not-allowed', // Pointer cursor when enabled
              }}
            >
              Small Colony (Starting Phase)
            </button>

            {/* Medium Colony Button (disabled) */}
            <button
              onClick={() => createColony('medium')}
              disabled={isTestingPhase} // Disable during testing phase
              style={{
                backgroundColor: 'blue',
                color: 'white',
                margin: '10px',
                opacity: isTestingPhase ? 0.5 : 1, // Grayed out in testing phase
                cursor: isTestingPhase ? 'not-allowed' : 'pointer', // Disable cursor in testing phase
              }}
            >
              Medium Colony (After Initial Growth)
            </button>

            {/* Large Colony Button (disabled) */}
            <button
              onClick={() => createColony('large')}
              disabled={isTestingPhase} // Disable during testing phase
              style={{
                backgroundColor: 'red',
                color: 'white',
                margin: '10px',
                opacity: isTestingPhase ? 0.5 : 1, // Grayed out in testing phase
                cursor: isTestingPhase ? 'not-allowed' : 'pointer', // Disable cursor in testing phase
              }}
            >
              Large Colony (Advanced Phase)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default GamePage;
