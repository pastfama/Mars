const mongoose = require('mongoose');
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

// Handle colony leader elections
const handleElections = async (req, res) => {
  const { colonyId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(colonyId)) {
    return res.status(400).json({ message: 'Invalid colony ID' });
  }

  try {
    const colony = await Colony.findById(colonyId).populate('players.player');
    if (!colony) {
      return res.status(404).json({ message: 'Colony not found' });
    }

    const adultPlayers = colony.players.filter(player => player.age >= 18);
    const votes = {};

    adultPlayers.forEach(voter => {
      const relationships = voter.relationships.filter(rel => rel.trustLevel > 0);
      relationships.forEach(rel => {
        if (!votes[rel.player._id]) {
          votes[rel.player._id] = 0;
        }
        votes[rel.player._id] += rel.trustLevel;
      });
    });

    if (Object.keys(votes).length === 0) {
      return res.status(400).json({ message: 'No votes cast' });
    }

    const newLeaderId = Object.keys(votes).reduce((a, b) => (votes[a] > votes[b] ? a : b));
    colony.leader = newLeaderId;
    await colony.save();

    console.log(`New leader elected for colony ${colonyId}: ${newLeaderId}`);
    res.status(200).json({ message: 'Elections completed successfully', newLeaderId });
  } catch (error) {
    console.error('Error handling elections:', error);
    res.status(500).json({ error: 'Failed to handle elections' });
  }
};

// Fetch candidates for elections
const getCandidates = async (req, res) => {
  const { colonyId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(colonyId)) {
    return res.status(400).json({ message: 'Invalid colony ID' });
  }

  try {
    const colony = await Colony.findById(colonyId).populate('players.player');
    if (!colony) {
      return res.status(404).json({ message: 'Colony not found' });
    }

    const candidates = colony.players.filter(player => player.age >= 18);
    res.status(200).json({ candidates });
  } catch (error) {
    console.error('Error fetching candidates:', error);
    res.status(500).json({ error: 'Failed to fetch candidates' });
  }
};

// Cast a vote in the elections
const castVote = async (req, res) => {
  const { colonyId } = req.params;
  const { voterId, candidateId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(colonyId) || !mongoose.Types.ObjectId.isValid(voterId) || !mongoose.Types.ObjectId.isValid(candidateId)) {
    return res.status(400).json({ message: 'Invalid ID(s)' });
  }

  try {
    const colony = await Colony.findById(colonyId).populate('players.player');
    if (!colony) {
      return res.status(404).json({ message: 'Colony not found' });
    }

    const voter = colony.players.find(player => player._id.equals(voterId));
    if (!voter || voter.age < 18) {
      return res.status(400).json({ message: 'Invalid voter' });
    }

    const candidate = colony.players.find(player => player._id.equals(candidateId));
    if (!candidate || candidate.age < 18) {
      return res.status(400).json({ message: 'Invalid candidate' });
    }

    // Add vote logic here (e.g., increment candidate's vote count)
    // For simplicity, we assume each voter can vote only once and for one candidate
    if (!colony.votes) {
      colony.votes = {};
    }
    if (!colony.votes[candidateId]) {
      colony.votes[candidateId] = 0;
    }
    colony.votes[candidateId] += 1;

    await colony.save();
    res.status(200).json({ message: 'Vote cast successfully' });
  } catch (error) {
    console.error('Error casting vote:', error);
    res.status(500).json({ error: 'Failed to cast vote' });
  }
};

module.exports = {
  createColony,
  getColony,
  updateColony,
  deleteColony,
  handleElections,
  getCandidates,
  castVote,
};