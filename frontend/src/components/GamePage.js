import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const GamePage = () => {
  const { id } = useParams(); // Get game ID from the URL
  const [game, setGame] = useState(null);
  const [colony, setColony] = useState(null);
  const [players, setPlayers] = useState([]);

  // Fetch the game details on component mount
  useEffect(() => {
    fetchGame();
  }, [id]);

  const fetchGame = async () => {
    try {
      const response = await fetch(`http://localhost:5000/game/${id}`); // Fetch game by ID
      const data = await response.json();
      if (data.game) {
        console.log('Fetched game:', data.game);
        setGame(data.game);
        fetchColony(data.game.colony);
      } else {
        console.error('Game not found');
      }
    } catch (error) {
      console.error('Error fetching game:', error);
    }
  };

  const fetchColony = async (colonyId) => {
    try {
      console.log('Fetching colony with ID:', colonyId);
      const response = await fetch(`http://localhost:5000/colony/${colonyId}`); // Fetch colony by ID
      const data = await response.json();
      if (data.colony) {
        console.log('Fetched colony:', data.colony);
        setColony(data.colony);
        setPlayers(data.colony.players);
      } else {
        console.error('Colony not found');
      }
    } catch (error) {
      console.error('Error fetching colony:', error);
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
          <p>Player Name: {game.playerName}</p>
          {colony && (
            <div>
              <h3>Colony: {colony.name}</h3>
              <h4>Resources</h4>
              <ul>
                <li>Food: {colony.resources.food}</li>
                <li>Water: {colony.resources.water}</li>
                <li>Power: {colony.resources.power}</li>
              </ul>
              <h4>Players</h4>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Age</th>
                    <th>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {players.map((player, index) => (
                    <tr key={index}>
                      <td>{player.player.name}</td>
                      <td>{player.player.age}</td>
                      <td>{player.role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <h4>Main Player/Character</h4>
              <table style={{ backgroundColor: 'green' }}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Age</th>
                    <th>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {players.length > 0 && (
                    <tr>
                      <td>{players[0].player.name}</td>
                      <td>{players[0].player.age}</td>
                      <td>{players[0].role}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <p>Loading game details...</p>
      )}
    </div>
  );
};

export default GamePage;