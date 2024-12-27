// controllers/playerController.js
const logger = require('../utils/logger');
const Player = require('../models/playerModel'); // Assuming you have a Player model set up

// POST: Create a new player
const createPlayer = async (req, res) => {
  const { name, skills, health, happiness, smarts, looks } = req.body;

  logger.logDebug('Received request to create a new player', { name, skills, health, happiness, smarts, looks });

  try {
    const newPlayer = new Player({ name, skills, health, happiness, smarts, looks });
    await newPlayer.save();

    logger.logDebug('New player created successfully', { playerId: newPlayer._id });

    res.status(201).json({ message: 'Player created successfully', player: newPlayer });
  } catch (error) {
    logger.logError('Error creating player', error);
    res.status(500).json({ error: 'Failed to create player' });
  }
};

// GET: Get player details by ID
const getPlayerById = async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }
    res.json(player);
  } catch (error) {
    console.error('Error fetching player details', error);
    res.status(500).json({ message: 'Error fetching player details' });
  }
};

// PUT: Update player information
const updatePlayer = async (req, res) => {
  const { id } = req.params;
  const { name, skills, health, happiness, smarts, looks } = req.body;

  logger.logDebug('Received request to update player', { playerId: id, updatedData: req.body });

  try {
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
};

// DELETE: Delete player by ID
const deletePlayer = async (req, res) => {
  const { id } = req.params;

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
};

module.exports = { createPlayer, getPlayerById, updatePlayer, deletePlayer };
