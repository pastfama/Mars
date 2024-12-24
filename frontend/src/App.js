import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from './components/HomePage';
import GamePage from './components/GamePage';
import CreateGamePage from './components/CreateGamePage';
import GameManagementPage from './components/GameManagementPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/game/:id" element={<GamePage />} />
        <Route path="/create-game" element={<CreateGamePage />} />
        <Route path="/game-management" element={<GameManagementPage />} />
      </Routes>
    </Router>
  );
};

export default App;
