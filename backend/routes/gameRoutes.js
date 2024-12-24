const express = require('express');
const router = express.Router();
const { createGame, getAllGames, getGame, deleteGame } = require('../controllers/gameController'); 

router.post('/', createGame); // Route to create a new game
router.get('/', getAllGames);  // Route to get all games
router.get('/:id', getGame);   // Route to get a specific game by ID
router.delete('/:id', deleteGame); // Route to delete a game

module.exports = router;
