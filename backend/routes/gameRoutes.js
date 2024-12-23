// routes/gameRoutes.js
const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');

// GET: Fetch the current game state
router.get('/game-state', gameController.getGameState);

// POST: Create a new game (start a new game)
router.post('/new-game', gameController.startNewGame);

// POST: Save the current game state
router.post('/save-game', gameController.saveGame);

module.exports = router;
