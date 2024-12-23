import React, { useState } from 'react';
import axios from 'axios';

const PlayerPage = () => {
  const [playerName, setPlayerName] = useState('');

  const handleSubmit = () => {
    axios.post('http://localhost:5000/players/create', { playerName })
      .then(response => {
        console.log('Player created:', response.data);
      })
      .catch(error => {
        console.error('Error creating player:', error);
      });
  };

  return (
    <div>
      <h1>Create a New Player</h1>
      <input
        type="text"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
        placeholder="Enter your player name"
      />
      <button onClick={handleSubmit}>Create Player</button>
    </div>
  );
};

export default PlayerPage;
