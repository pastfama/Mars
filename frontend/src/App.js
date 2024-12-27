import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import CreateGame from './components/CreateGamePage';
import GameManagementPage from './components/GameManagementPage';
import GamePage from './components/GamePage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create-game" element={<CreateGame />} />
        <Route path="/game-management" element={<GameManagementPage />} />
        <Route path="/game/:id" element={<GamePage />} />
      </Routes>
    </Router>
  );
};

export default App;
