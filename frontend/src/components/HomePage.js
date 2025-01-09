import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import config from '../config'; // Import config
import '../styles/HomePage.css';

const HomePage = () => {
  const [games, setGames] = useState([]); // Holds the list of games
  const [gameId, setGameId] = useState('');
  const navigate = useNavigate();

  // Fetch all games on component mount
  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const response = await fetch(`${config.apiBaseUri}/game`); // Use apiBaseUri
      const data = await response.json();
      setGames(data.games || []);
    } catch (error) {
      console.error('Error fetching games:', error);
    }
  };

  const handleGetGameById = async () => {
    if (gameId) {
      try {
        const response = await fetch(`${config.apiBaseUri}/game/${gameId}`); // Use apiBaseUri
        const data = await response.json();
        alert(`Game fetched: ${JSON.stringify(data.game)}`);
      } catch (error) {
        alert('Error fetching game');
      }
    }
  };

  const navigateToCreateGame = () => {
    navigate('/create-game');
  };

  const navigateToGameManagement = () => {
    navigate('/game-management');
  };

  return (
    <div className="homepage">
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

      {/* Fetch a game by ID */}
      <div>
        <h2>Fetch Game by ID</h2>
        <input
          type="text"
          value={gameId}
          onChange={(e) => setGameId(e.target.value)}
          placeholder="Enter game ID"
        />
        <button onClick={handleGetGameById}>Fetch Game</button>
      </div>

      {/* Navigation buttons */}
      <div className="navigation-buttons">
        <button onClick={navigateToCreateGame}>Create Game</button>
        <button onClick={navigateToGameManagement}>Game Management</button>
      </div>
    </div>
  );
};

export default HomePage;
