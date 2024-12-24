import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Homepage = () => {
  const [games, setGames] = useState([]); // Holds the list of games
  const [gameId, setGameId] = useState('');

  // Fetch all games on component mount
  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/game'); // Adjust the URL if needed
      const data = await response.json();
      setGames(data.games || []);
    } catch (error) {
      console.error('Error fetching games:', error);
    }
  };

  const handleGetGameById = async () => {
    if (gameId) {
      try {
        const response = await fetch(`http://localhost:5000/api/game/${gameId}`); // Fetch single game by ID
        const data = await response.json();
        alert(`Game fetched: ${JSON.stringify(data.game)}`);
      } catch (error) {
        alert('Error fetching game');
      }
    }
  };

  return (
    <div>
      <h1>Welcome to Mars: A New Hope Game</h1>

      {/* Display the list of games */}
      <div>
        <h2>Available Games</h2>
        {games.length === 0 ? (
          <p>No games available. Create a new game to get started.</p>
        ) : (
          <ul>
            {games.map((game) => (
              <li key={game._id}>
                <Link to={`/game/${game._id}`}>{game.name}</Link> - {game.description}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Search for a game by ID */}
      <div>
        <h2>Search for a Game by ID</h2>
        <input
          type="text"
          placeholder="Enter Game ID"
          value={gameId}
          onChange={(e) => setGameId(e.target.value)}
        />
        <button onClick={handleGetGameById}>Fetch Game</button>
      </div>

      {/* Links to create or manage games */}
      <div>
        <h2>Game Actions</h2>
        <Link to="/create-game">
          <button>Create a New Game</button>
        </Link>
        <Link to="/game-management">
          <button>Manage Existing Games</button>
        </Link>
      </div>
    </div>
  );
};

export default Homepage;
