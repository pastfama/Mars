import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateGamePage = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [colonyName, setColonyName] = useState('');
  const [playerName, setPlayerName] = useState('');
  const navigate = useNavigate();

  const handleCreateGame = async (e) => {
    e.preventDefault();

    const newGame = {
      name,
      description,
      colonyName, // Use colonyName instead of colony
      playerName,
    };

    try {
      const response = await fetch('http://localhost:5000/game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newGame),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Game and colony created successfully!');
        navigate(`/game/${data.game._id}`); // Navigate to the game page
      } else {
        alert(data.error || 'Failed to create game and colony');
      }
    } catch (error) {
      console.error('Error creating game and colony:', error);
      alert('Error creating game and colony');
    }
  };

  return (
    <div>
      <h1>Create a New Game</h1>
      <form onSubmit={handleCreateGame}>
        <div>
          <label>Game Name: </label>
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
          <label>Colony Name: </label>
          <input
            type="text"
            value={colonyName}
            onChange={(e) => setColonyName(e.target.value)}
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
