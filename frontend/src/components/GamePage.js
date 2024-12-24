import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const GamePage = () => {
  const { id } = useParams(); // Get game ID from the URL
  const [game, setGame] = useState(null);

  // Fetch the game details on component mount
  useEffect(() => {
    fetchGame();
  }, [id]);

  const fetchGame = async () => {
    try {
      const response = await fetch(`http://localhost:5000/game/${id}`); // Fetch game by ID
      const data = await response.json();
      setGame(data.game);
    } catch (error) {
      console.error('Error fetching game:', error);
    }
  };

  return (
    <div>
      <h1>Game Details</h1>
      {game ? (
        <div>
          <h2>{game.name}</h2>
          <p>{game.description}</p>
          <p>Creator: {game.creatorId}</p>
          <p>Colony: {game.colony}</p>
          <p>Player Name: {game.playerName}</p>
        </div>
      ) : (
        <p>Loading game details...</p>
      )}
    </div>
  );
};

export default GamePage;
