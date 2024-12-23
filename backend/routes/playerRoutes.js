const express = require('express');
const router = express.Router();
const logger = require('../logger');
const Player = require('../models/playerModel'); // Assuming you have a Player model set up

// POST: Create a new player
router.post('/new', async (req, res) => {
  const { name, skills, health, happiness, smarts, looks } = req.body;
  
  // Log the incoming request
  logger.logDebug('Received request to create a new player', { name, skills, health, happiness, smarts, looks });

  try {
    // Create a new player instance
    const newPlayer = new Player({
      name,
      skills,
      health,
      happiness,
      smarts,
      looks,
    });

    // Save the player to the database
    await newPlayer.save();

    logger.logDebug('New player created successfully', { playerId: newPlayer._id });

    res.status(201).json({ message: 'Player created successfully', player: newPlayer });
  } catch (error) {
    logger.logError('Error creating player', error);
    res.status(500).json({ error: 'Failed to create player' });
  }
});

// GET: Get player details by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  
  // Log the incoming request
  logger.logDebug('Received request to get player details', { playerId: id });

  try {
    // Find the player by ID
    const player = await Player.findById(id);

    if (!player) {
      logger.logDebug('Player not found', { playerId: id });
      return res.status(404).json({ error: 'Player not found' });
    }

    logger.logDebug('Player details fetched successfully', { playerId: id });

    res.status(200).json(player);
  } catch (error) {
    logger.logError('Error fetching player details', error);
    res.status(500).json({ error: 'Failed to fetch player details' });
  }
});

// PUT: Update player information
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, skills, health, happiness, smarts, looks } = req.body;

  // Log the incoming request
  logger.logDebug('Received request to update player', { playerId: id, updatedData: req.body });

  try {
    // Find the player and update their information
    const updatedPlayer = await Player.findByIdAndUpdate(
      id,
      { name, skills, health, happiness, smarts, looks },
      { new: true }
    );

    if (!updatedPlayer) {
      logger.logDebug('Player not found for update', { playerId: id });
      return res.status(404).json({ error: 'Player not found' });
    }

    logger.logDebug('Player updated successfully', { playerId: updatedPlayer._id });

    res.status(200).json({ message: 'Player updated successfully', player: updatedPlayer });
  } catch (error) {
    logger.logError('Error updating player', error);
    res.status(500).json({ error: 'Failed to update player' });
  }
});

// DELETE: Delete player by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  // Log the incoming request
  logger.logDebug('Received request to delete player', { playerId: id });

  try {
    const deletedPlayer = await Player.findByIdAndDelete(id);

    if (!deletedPlayer) {
      logger.logDebug('Player not found for deletion', { playerId: id });
      return res.status(404).json({ error: 'Player not found' });
    }

    logger.logDebug('Player deleted successfully', { playerId: id });

    res.status(200).json({ message: 'Player deleted successfully' });
  } catch (error) {
    logger.logError('Error deleting player', error);
    res.status(500).json({ error: 'Failed to delete player' });
  }
});

module.exports = router;
