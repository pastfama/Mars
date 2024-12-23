import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import NewColonyPage from './pages/NewColonyPage';
import GamePage from './pages/GamePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/new-colony" element={<NewColonyPage />} />
        <Route path="/game/:gameId" element={<GamePage />} />
        <Route path="/game-page" element={<GamePage />} />
      </Routes>
    </Router>
  );
}

export default App;
