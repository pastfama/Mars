import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import backgroundImage from '../assets/images/newborn.webp';
import './NewColonyPage.css';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const NewColonyPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedColony, setSelectedColony] = useState(null);
  const [isMediumAvailable, setIsMediumAvailable] = useState(false);
  const [isLargeAvailable, setIsLargeAvailable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [playerName, setPlayerName] = useState(location.state?.playerName || '');

  useEffect(() => {
    console.log('[DEBUG] Initializing NewColonyPage component.');
    console.log(`[DEBUG] Player name from location state: ${playerName}`);
    if (!playerName) {
      alert('Player name is missing!');
    }
  }, [playerName]);

  const selectColonySize = async (size) => {
    console.log(`[DEBUG] Colony size selected: ${size}`);
    setSelectedColony(size);
    setLoading(true);

    // Ensure the playerName is available before proceeding
    if (!playerName) {
      alert('Player name is missing!');
      console.log('[DEBUG] Player name is missing. Aborting colony creation.');
      setLoading(false);
      return;
    }

    const name = `${playerName}'s ${size.charAt(0).toUpperCase() + size.slice(1)} Colony`;
    const gameId = location.state?.gameId || uuidv4(); // Use existing gameId or generate a new one

    console.log(`[DEBUG] Game ID to be used: ${gameId}`);
    console.log(`[DEBUG] Colony name to be created: ${name}`);

    try {
      console.log('[DEBUG] Checking for an existing colony...');
      const gameResponse = await axios.get(`http://localhost:5000/colony/status/${gameId}`);
      console.log('[DEBUG] Colony status response:', gameResponse.data);

      if (gameResponse.data.colony) {
        console.log('[DEBUG] Existing colony found:', gameResponse.data.colony);
        // Pass the colony's _id as MongoDB ObjectId
        const colonyId = gameResponse.data.colony._id; 
        navigate('/game-page', { state: { colony: gameResponse.data.colony, colonyId } });
        return;
      }

      console.log('[DEBUG] No existing colony found. Proceeding to create a new colony...');
      const newGameId = gameId || uuidv4(); // Generate only if not available

      const response = await axios.post('http://localhost:5000/colony/new-colony', {
        name,
        gameId: newGameId,
        playerName,
      });

      console.log('[DEBUG] New colony created successfully:', response.data);
      navigate('/game-page', { state: { colony: response.data.colony } });
    } catch (error) {
      console.error('[DEBUG] Error during colony creation or fetching:', error);
      alert('Failed to create or fetch the colony. Please try again later.');
    } finally {
      setLoading(false);
      console.log('[DEBUG] Colony selection process completed.');
    }
  };

  return (
    <div className="new-colony-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="content">
        <h1 className="title">Select Colony Size</h1>

        <p>{playerName ? `Player: ${playerName}` : 'Player name not available'}</p>

        <div className="button-container">
          <button
            className="button"
            onClick={() => selectColonySize('small')}
            disabled={loading}
          >
            Small (5-10)
          </button>
          <button
            className={`button ${!isMediumAvailable ? 'disabled' : ''}`}
            onClick={() => isMediumAvailable && selectColonySize('medium')}
            disabled={!isMediumAvailable || loading}
          >
            Medium (20-50)
          </button>
          <button
            className={`button ${!isLargeAvailable ? 'disabled' : ''}`}
            onClick={() => isLargeAvailable && selectColonySize('large')}
            disabled={!isLargeAvailable || loading}
          >
            Large (100-500)
          </button>
        </div>
        {loading && <p>Creating colony...</p>}
      </div>
    </div>
  );
};

export default NewColonyPage;
