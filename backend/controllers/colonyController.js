const Colony = require('../models/colonyModel');
const Player = require('../models/playerModel'); // Assuming you have a Player model
const Game = require('../models/game');
const { v4: uuidv4 } = require('uuid');

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

    // Create 5-10 players
    const playerCount = Math.floor(Math.random() * 6) + 5; // Random number between 5 and 10
    const players = [];

    for (let i = 0; i < playerCount; i++) {
      const player = new Player({ name: `${playerName}_${i}`, age: Math.floor(Math.random() * 50) + 20 });
      await player.save();
      players.push(player);
    }

    // Sort players by age to find the oldest
    players.sort((a, b) => b.age - a.age);
    const leader = players[0];

    // Create a new colony and associate it with the players and game
    const newColony = new Colony({
      colonyId: uuidv4(), // Generate a UUID for colonyId
      name,
      gameId,
      players: players.map(player => ({ player: player._id, role: 'colonist' })),
      leader: leader._id,
    });

    // Save the colony
    await newColony.save();

    console.log('Created colony:', newColony);
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
    console.log(`Received request to fetch colony with ID: ${id}`);
    
    // Log the query being made
    console.log(`Querying database for colony with ID: ${id}`);
    const colony = await Colony.findOne({ colonyId: id }).populate('players.player').populate('leader');
    
    // Log the result of the query
    if (!colony) {
      console.error(`Colony with ID ${id} not found`);
      return res.status(404).json({ message: 'Colony not found' });
    }
    
    console.log(`Fetched colony: ${JSON.stringify(colony)}`);
    res.status(200).json({ colony });
  } catch (error) {
    console.error('Error retrieving colony:', error);
    res.status(500).json({ message: 'Failed to retrieve colony' });
  }
};

// Update a colony by ID
const updateColony = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    console.log(`Received request to update colony with ID: ${id}`);
    
    // Log the update data
    console.log(`Updating colony with data: ${JSON.stringify(updateData)}`);
    const colony = await Colony.findOneAndUpdate({ colonyId: id }, updateData, { new: true }).populate('players.player').populate('leader');
    
    // Log the result of the update
    if (!colony) {
      console.error(`Colony with ID ${id} not found`);
      return res.status(404).json({ message: 'Colony not found' });
    }
    
    console.log(`Updated colony: ${JSON.stringify(colony)}`);
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
    console.log(`Received request to delete colony with ID: ${id}`);
    
    // Log the deletion
    const colony = await Colony.findOneAndDelete({ colonyId: id });
    
    // Log the result of the deletion
    if (!colony) {
      console.error(`Colony with ID ${id} not found`);
      return res.status(404).json({ message: 'Colony not found' });
    }
    
    console.log(`Deleted colony: ${JSON.stringify(colony)}`);
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