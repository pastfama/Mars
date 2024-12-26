import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/GamePage.css';

const GamePage = () => {
  const { id } = useParams(); // Get game ID from the URL
  const [game, setGame] = useState(null);
  const [colony, setColony] = useState(null);
  const [players, setPlayers] = useState([]);
  const [mainPlayer, setMainPlayer] = useState(null);
  const [activeSection, setActiveSection] = useState('Profile');

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
        identifyMainPlayer(data.colony.players);
      } else {
        console.error('Colony not found');
      }
    } catch (error) {
      console.error('Error fetching colony:', error);
    }
  };

  const identifyMainPlayer = (players) => {
    const mainPlayer = players.find(player => player.player.mainPlayer);
    setMainPlayer(mainPlayer);
  };

  const getProgressBarColor = (value) => {
    if (value < 25) return 'red';
    if (value < 70) return 'yellow';
    return 'green';
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'Profile':
        return (
          <div className="content-section">
            <h2>Profile</h2>
            {mainPlayer ? (
              <div>
                <p>Name: {mainPlayer.player.name}</p>
                <p>Age: {mainPlayer.player.age}</p>
                <p>Role: {mainPlayer.role}</p>
                <div className="characteristics">
                  <div className="characteristic">
                    <p>Health</p>
                    <div className="progress-bar">
                      <div
                        className={`progress ${getProgressBarColor(mainPlayer.player.health)}`}
                        style={{
                          width: `${mainPlayer.player.health}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="characteristic">
                    <p>Happiness</p>
                    <div className="progress-bar">
                      <div
                        className={`progress ${getProgressBarColor(mainPlayer.player.happiness)}`}
                        style={{
                          width: `${mainPlayer.player.happiness}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="characteristic">
                    <p>Intelligence</p>
                    <div className="progress-bar">
                      <div
                        className={`progress ${getProgressBarColor(mainPlayer.player.intelligence)}`}
                        style={{
                          width: `${mainPlayer.player.intelligence}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="characteristic">
                    <p>Looks</p>
                    <div className="progress-bar">
                      <div
                        className={`progress ${getProgressBarColor(mainPlayer.player.looks)}`}
                        style={{
                          width: `${mainPlayer.player.looks}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p>No main player found</p>
            )}
          </div>
        );
      case 'Relationships':
        return (
          <div className="content-section">
            <h2>Relationships</h2>
            <p>Relationships content goes here...</p>
          </div>
        );
      case 'Activities':
        return (
          <div className="content-section">
            <h2>Activities</h2>
            <p>Activities content goes here...</p>
          </div>
        );
      case 'Assets':
        return (
          <div className="content-section">
            <h2>Assets</h2>
            <p>Assets content goes here...</p>
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
        <div className="menu-item" onClick={() => setActiveSection('Profile')}>Profile</div>
        <div className="menu-item" onClick={() => setActiveSection('Relationships')}>Relationships</div>
        <div className="menu-item" onClick={() => setActiveSection('Activities')}>Activities</div>
        <div className="menu-item" onClick={() => setActiveSection('Assets')}>Assets</div>
        <div className="menu-item" onClick={() => setActiveSection('Settings')}>Settings</div>
      </div>
      <div className="content">
        {renderSection()}
      </div>
    </div>
  );
};

export default GamePage;