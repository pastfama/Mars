import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { PlayerProvider } from './context/PlayerContext';
import HomePage from './pages/HomePage';
import GamePage from './pages/GamePage';
import PlayerPage from './pages/PlayerPage';

function App() {
  return (
    <PlayerProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/game" element={<GamePage />} />
            <Route path="/player" element={<PlayerPage />} />
          </Routes>
        </div>
      </Router>
    </PlayerProvider>
  );
}

export default App;
