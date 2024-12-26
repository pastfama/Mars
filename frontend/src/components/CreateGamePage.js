import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/CreateGamePage.css';

const CreateGamePage = () => {
  const [name, setName] = useState('Default Game Name');
  const [description, setDescription] = useState('Default Description');
  const [colonyName, setColonyName] = useState('Default Colony Name');
  const navigate = useNavigate();

  const handleCreateGame = async (e) => {
    e.preventDefault();

    const newGame = {
      name: name || 'Default Game Name',
      description: description || 'Default Description',
      colonyName: colonyName || 'Default Colony Name',
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
    <div className="create-game-page">
      <div className="create-game-container">
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
          <button type="submit">Create Game</button>
        </form>
      </div>
    </div>
  );
};

export default CreateGamePage;
