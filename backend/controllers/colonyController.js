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

    // Create parents
    const father = new Player({
      name: `${playerName}_Father`,
      age: Math.floor(Math.random() * 10) + 30, // Age between 30 and 40
      gender: 'male',
    });
    await father.save();

    const mother = new Player({
      name: `${playerName}_Mother`,
      age: Math.floor(Math.random() * 10) + 30, // Age between 30 and 40
      gender: 'female',
    });
    await mother.save();

    // Create main player (newborn)
    const mainPlayer = new Player({
      name: playerName,
      age: 0,
      gender: 'male', // or 'female', based on your logic
      mainPlayer: true,
      parents: [father._id, mother._id],
    });
    await mainPlayer.save();

    // Create other players
    const playerCount = Math.floor(Math.random() * 6) + 2; // Random number between 2 and 7
    const players = [father, mother, mainPlayer];

    for (let i = 0; i < playerCount; i++) {
      const player = new Player({
        name: `${playerName}_${i}`,
        age: Math.floor(Math.random() * 50) + 20,
      });
      await player.save();
      players.push(player);
    }

    // Create relationships
    for (const player of players) {
      player.relationships = players
        .filter(p => p._id !== player._id)
        .map(p => {
          let relationshipType = 'other colonist';
          if (p._id.equals(father._id)) relationshipType = 'father';
          else if (p._id.equals(mother._id)) relationshipType = 'mother';
          else if (p.parents.includes(player._id)) relationshipType = 'child';
          return { player: p._id, relationshipType, trustLevel: 50 };
        });
      await player.save();
    }

    const newColony = new Colony({
      colonyId: uuidv4(),
      name,
      gameId,
      players: players.map(player => ({ player: player._id, role: 'colonist' })),
      leader: father._id,
    });
    await newColony.save();

    for (const player of players) {
      player.colony = newColony._id;
      await player.save();
    }

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
    const colony = await Colony.findById(id).populate('players.player');
    if (!colony) {
      return res.status(404).json({ message: 'Colony not found' });
    }
    res.status(200).json({ colony });
  } catch (error) {
    console.error('Error fetching colony:', error);
    res.status(500).json({ error: 'Failed to fetch colony' });
  }
};

// Update a colony by ID
const updateColony = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    console.log(`Received request to update colony with ID: ${id}`);
    const colony = await Colony.findByIdAndUpdate(id, updateData, { new: true }).populate('players.player').populate('leader');
    if (!colony) {
      return res.status(404).json({ message: 'Colony not found' });
    }
    res.status(200).json({ colony });
  } catch (error) {
    console.error('Error updating colony:', error);
    res.status(500).json({ error: 'Failed to update colony' });
  }
};

// Delete a colony by ID
const deleteColony = async (req, res) => {
  const { id } = req.params;

  try {
    console.log(`Received request to delete colony with ID: ${id}`);
    const colony = await Colony.findByIdAndDelete(id);
    if (!colony) {
      return res.status(404).json({ message: 'Colony not found' });
    }
    // Optionally, delete associated players
    await Player.deleteMany({ colony: id });
    res.status(200).json({ message: 'Colony and associated players deleted successfully' });
  } catch (error) {
    console.error('Error deleting colony:', error);
    res.status(500).json({ error: 'Failed to delete colony' });
  }
};

module.exports = {
  createColony,
  getColony,
  updateColony,
  deleteColony,
};