import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const GamePage = () => {
  const location = useLocation();
  const { gameData, colonyData } = location.state || {}; // Retrieve passed data
  const [colonyStatus, setColonyStatus] = useState(null);
  const [mainCharacter, setMainCharacter] = useState(null);

  useEffect(() => {
    if (colonyData) {
      // Fetch colony status by name
      const fetchColonyStatus = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/colony/status/name/${colonyData.name}`);
          setColonyStatus(response.data.colonyStatus);  // Assume colony status is returned here
          setMainCharacter(response.data.mainCharacter);  // Assume main character data is included
        } catch (error) {
          console.error('Error fetching colony status:', error);
        }
      };
      fetchColonyStatus();
    }
  }, [colonyData]);

  if (!gameData || !colonyData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Game Page</h1>
      <h2>Colony: {colonyData.name}</h2>
      {colonyStatus ? (
        <div>
          <h3>Colony Status</h3>
          <p>{colonyStatus}</p> {/* Display the colony status */}
        </div>
      ) : (
        <p>Loading colony status...</p>
      )}

      {mainCharacter ? (
        <div>
          <h3>Main Character</h3>
          <p>Name: {mainCharacter.name}</p> {/* Display main character data */}
          <p>Age: {mainCharacter.age}</p>
          {/* Add more character details as needed */}
        </div>
      ) : (
        <p>Loading main character...</p>
      )}
    </div>
  );
};

export default GamePage;
