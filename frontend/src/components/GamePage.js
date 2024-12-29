import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/GamePage.css';
import ProfileButton from './ProfileButton';
import RelationshipsButton from './RelationshipsButton';
import ActivitiesButton from './ActivitiesButton';
import AssetsButton from './AssetsButton';
import SettingsButton from './SettingsButton';
import ProfileSection from './ProfileSection';
import RelationshipsSection from './RelationshipsSection';
import ActivitiesSection from './ActivitiesSection';
import AssetsSection from './AssetsSection';
import AgeUpSummaryPopup from './AgeUpSummaryPopup';
import axios from 'axios';

const GamePage = () => {
  const { id } = useParams(); // Get game ID from the URL
  const [game, setGame] = useState(null);
  const [colony, setColony] = useState(null);
  const [players, setPlayers] = useState([]);
  const [mainPlayer, setMainPlayer] = useState(null);
  const [activeSection, setActiveSection] = useState('Profile');
  const [summary, setSummary] = useState(null);

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
        identifyMainPlayer(data.colony._id);
      } else {
        console.error('Colony not found');
      }
    } catch (error) {
      console.error('Error fetching colony:', error);
    }
  };

  const identifyMainPlayer = async (colonyId) => {
    try {
      const response = await axios.get(`http://localhost:5000/player/main/${colonyId}`);
      const main = response.data.mainPlayer;
      if (main) {
        console.log('Found main player:', main.name);
        setMainPlayer(main);
      } else {
        console.error('No main player found');
      }
    } catch (error) {
      console.error('Error identifying main player:', error);
    }
  };

  const handleAgeUp = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/ageUpColonyMembers', { colonyId: colony._id });
      setSummary(response.data.summary);
      fetchColony(colony._id); // Fetch updated colony data
    } catch (error) {
      console.error('Error aging up colony members:', error);
    }
  };

  const getProgressBarColor = (value) => {
    if (value > 75) return 'success';
    if (value > 50) return 'info';
    if (value > 25) return 'warning';
    return 'danger';
  };

  const updatePlayerStats = (effects) => {
    setMainPlayer((prevPlayer) => {
      const updatedPlayer = { ...prevPlayer };
      for (const [key, value] of Object.entries(effects)) {
        updatedPlayer[key] = (updatedPlayer[key] || 0) + value;
      }
      return updatedPlayer;
    });
  };

  const handleRetire = async (destination) => {
    console.log('handleRetire called');
    try {
      const response = await axios.post('http://localhost:5000/api/retire', { destination });
      console.log('Retire response:', response);
      alert(`Colony members have been retired to ${destination}!`);
      // Refetch the updated colony data
      fetchColony(colony._id);
      setActiveSection('Profile');
    } catch (error) {
      console.error('Error retiring colony members:', error);
    }
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'Profile':
        return <ProfileSection mainPlayer={mainPlayer} getProgressBarColor={getProgressBarColor} />;
      case 'Relationships':
        return (
          <div className="content-section">
            <h2>Relationships</h2>
            {mainPlayer && mainPlayer._id && (
              <RelationshipsSection mainPersonId={mainPlayer._id} />
            )}
          </div>
        );
      case 'Activities':
        return (
          <div className="content-section">
            <h2>Activities</h2>
            {mainPlayer && mainPlayer._id && (
              <ActivitiesSection mainPlayer={mainPlayer} updatePlayerStats={updatePlayerStats} setActiveSection={setActiveSection} />
            )}
          </div>
        );
      case 'Assets':
        return (
          <div className="content-section">
            <h2>Assets</h2>
            {colony && <AssetsSection colony={colony} />}
          </div>
        );
      case 'Settings':
        return (
          <div className="content-section">
            <h2>Settings</h2>
            <p>Settings content goes here...</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="gamepage">
      <div className="menu">
        <ProfileButton setActiveSection={setActiveSection} />
        <RelationshipsButton setActiveSection={setActiveSection} />
        <ActivitiesButton setActiveSection={setActiveSection} />
        <AssetsButton setActiveSection={setActiveSection} />
        <SettingsButton setActiveSection={setActiveSection} />
      </div>
      <div className="content">
        {renderSection()}
        <div className="age-up-button-container" style={{ textAlign: 'center', marginTop: '20px' }}>
          <button className="age-up-button" onClick={handleAgeUp}>Age Up</button>
          {summary && <AgeUpSummaryPopup summary={summary} onClose={() => setSummary(null)} />}
          {mainPlayer && mainPlayer.age >= 60 && (
            <>
              <button className="retire-button" onClick={() => handleRetire('earth')}>Retire to Earth</button>
              <button className="retire-button" onClick={() => handleRetire('mars')}>Retire on Mars</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GamePage;