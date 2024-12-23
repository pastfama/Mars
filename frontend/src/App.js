import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import GamePage from './pages/GamePage';
import NewColonyPage from './pages/NewColonyPage'; // Import the NewColonyPage component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/game/:gameId" element={<GamePage />} />
        <Route path="/game-page" element={<GamePage />} />
        <Route path="/new-colony" element={<NewColonyPage />} /> {/* Add route for NewColonyPage */}
      </Routes>
    </Router>
  );
}

export default App;
