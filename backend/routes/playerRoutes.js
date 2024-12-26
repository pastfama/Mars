// routes/playerRoutes.js
const express = require('express');
const router = express.Router();
const playerController = require('../controllers/playerController');

// POST: Create a new player
router.post('/new', playerController.createPlayer);

// GET: Get player details by ID
router.get('/:id', playerController.getPlayerById);

// PUT: Update player information
router.put('/:id', playerController.updatePlayer);

// DELETE: Delete player by ID
router.delete('/:id', playerController.deletePlayer);

module.exports = router;
