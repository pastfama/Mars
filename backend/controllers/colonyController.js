const Colony = require('../models/colonyModel');
const Player = require('../models/playerModel'); // Assuming you have a Player model
const Game = require('../models/game');

// Create a new colony
const createColony = async (req, res) => {
  const { name, gameId, playerName } = req.body;

  if (!name || !gameId || !playerName) {
    return res.status(400).json({ message: 'Name, gameId, and playerName are required' });
  }

  try {
    // Check if the game exists
    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    // Check if the player exists, if not create a new player
    let player = await Player.findOne({ playerName });
    if (!player) {
      player = new Player({ playerName });
      await player.save();
    }

    // Create a new colony and associate it with the player and game
    const newColony = new Colony({
      name,
      gameId,
      players: [{ player: player._id, role: 'colonist' }],
    });

    // Save the colony
    await newColony.save();

    res.status(201).json({ colony: newColony });
  } catch (error) {
    console.error('Error creating colony:', error);
    res.status(500).json({ message: 'Failed to create colony' });
  }
};

// Get a colony by ID
const getColony = async (req, res) => {
  const { id } = req.params;
  
  try {
    const colony = await Colony.findById(id).populate('players.player').populate('leader');
    if (!colony) {
      return res.status(404).json({ message: 'Colony not found' });
    }
    res.status(200).json({ colony });
  } catch (error) {
    console.error('Error retrieving colony:', error);
    res.status(500).json({ message: 'Failed to retrieve colony' });
  }
};

// Update a colony by ID
const updateColony = async (req, res) => {
  const { id } = req.params;
  const { name, gameId, resources, infrastructure } = req.body;

  try {
    const colony = await Colony.findById(id);
    if (!colony) {
      return res.status(404).json({ message: 'Colony not found' });
    }

    // Update colony fields
    if (name) colony.name = name;
    if (gameId) colony.gameId = gameId;
    if (resources) colony.resources = resources;
    if (infrastructure) colony.infrastructure = infrastructure;

    // Save the updated colony
    await colony.save();
    res.status(200).json({ colony });
  } catch (error) {
    console.error('Error updating colony:', error);
    res.status(500).json({ message: 'Failed to update colony' });
  }
};

// Delete a colony by ID
const deleteColony = async (req, res) => {
  const { id } = req.params;

  try {
    const colony = await Colony.findByIdAndDelete(id);
    if (!colony) {
      return res.status(404).json({ message: 'Colony not found' });
    }
    res.status(200).json({ message: 'Colony deleted successfully' });
  } catch (error) {
    console.error('Error deleting colony:', error);
    res.status(500).json({ message: 'Failed to delete colony' });
  }
};

module.exports = {
  createColony,
  getColony,
  updateColony,
  deleteColony,
};
