import React, { useEffect, useState } from 'react';

const GameManagement = () => {
  const [games, setGames] = useState([]);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch('http://localhost:5000/game');
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
      const response = await fetch(`http://localhost:5000/game/${id}`, {
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
    <div>
      <h1>Game Management</h1>
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

export default GameManagement;
