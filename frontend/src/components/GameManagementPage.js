import React, { useEffect, useState } from 'react';
import '../styles/GameManagementPage.css';
import config from '../config'; // Import config

const GameManagementPage = () => {
  const [games, setGames] = useState([]);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch(`${config.apiBaseUri}/game`); // Use apiBaseUri
        if (response.ok) {
          const data = await response.json();
          setGames(data.games);  // Assuming the API returns { games: [...] }
        } else {
          console.error('Failed to fetch games');
        }
      } catch (error) {
        console.error('Error fetching games:', error);
      }
    };

    fetchGames();
  }, []);

  const handleDeleteGame = async (id) => {
    try {
      const response = await fetch(`${config.apiBaseUri}/game/${id}`, { // Use apiBaseUri
        method: 'DELETE',
      });
      if (response.ok) {
        setGames(games.filter(game => game._id !== id)); // Update state to remove deleted game
      } else {
        console.error('Failed to delete game');
      }
    } catch (error) {
      console.error('Error deleting game:', error);
    }
  };

  return (
    <div className="game-management">
      <h1>Game Management</h1>
      <p>Warning: The colony is in danger of deletion and complete destruction!</p>
      {games.length > 0 ? (
        <ul>
          {games.map(game => (
            <li key={game._id}>
              {game.name} - {game.description}
              <button onClick={() => handleDeleteGame(game._id)}>Delete</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No games found.</p>
      )}
    </div>
  );
};

export default GameManagementPage;
