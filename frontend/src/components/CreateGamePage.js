import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateGamePage = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [colony, setColony] = useState('');
  const [playerName, setPlayerName] = useState('');
  const navigate = useNavigate();

  const handleCreateGame = async (e) => {
    e.preventDefault();

    const newGame = {
      name,
      description,
      colony,
      playerName,
    };

    try {
      const response = await fetch('http://localhost:5000/game', {  // Updated to '/game'
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newGame),
      });

      const data = await response.json();
      if (data.game) {
        alert('Game created successfully!');
        navigate(`/game/${data.game._id}`);
      } else {
        alert('Failed to create game');
      }
    } catch (error) {
      console.error('Error creating game:', error);
    }
  };

  return (
    <div>
      <h1>Create a New Game</h1>
      <form onSubmit={handleCreateGame}>
        <div>
          <label>Name: </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Description: </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Colony: </label>
          <input
            type="text"
            value={colony}
            onChange={(e) => setColony(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Player Name: </label>
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            required
          />
        </div>
        <button type="submit">Create Game</button>
      </form>
    </div>
  );
};

export default CreateGamePage;
