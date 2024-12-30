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

    // Find the oldest player to be the leader
    const oldestPlayer = players.reduce((oldest, player) => {
      return (player.age > oldest.age) ? player : oldest;
    }, players[0]);

    const newColony = new Colony({
      colonyId: uuidv4(),
      name,
      gameId,
      players: players.map(player => ({ player: player._id, role: 'colonist' })),
      leader: oldestPlayer._id,
      yearsTillElection: 0, // Set years till next election to 0
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

// Handle colony leader elections
const handleElections = async (req, res) => {
  const { colonyId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(colonyId)) {
    return res.status(400).json({ message: 'Invalid colony ID' });
  }

  try {
    console.log(`Received POST request for /${colonyId}/elections`);
    const colony = await Colony.findById(colonyId).populate('players.player');
    if (!colony) {
      return res.status(404).json({ message: 'Colony not found' });
    }

    if (!colony.players || colony.players.length === 0) {
      return res.status(400).json({ message: 'No players in colony' });
    }

    const adultPlayers = colony.players.filter(player => player.player.age >= 18);
    const votes = {};

    adultPlayers.forEach(voter => {
      const relationships = voter.player.relationships.filter(rel => rel.trustLevel > 0);
      relationships.forEach(rel => {
        if (!votes[rel.player]) {
          votes[rel.player] = 0;
        }
        votes[rel.player] += rel.trustLevel;
      });
    });

    let newLeaderId;
    if (Object.keys(votes).length === 0) {
      // If no votes are cast, choose the oldest player as the leader
      const oldestPlayer = adultPlayers.reduce((oldest, player) => {
        return (player.player.age > oldest.player.age) ? player : oldest;
      }, adultPlayers[0]);
      newLeaderId = oldestPlayer.player._id;
      console.log(`No votes cast. Oldest player ${newLeaderId} selected as leader.`);
    } else {
      newLeaderId = Object.keys(votes).reduce((a, b) => (votes[a] > votes[b] ? a : b));
      console.log(`New leader elected for colony ${colonyId}: ${newLeaderId}`);
    }

    colony.leader = newLeaderId;
    colony.yearsTillElection = 4;
    await colony.save();

    res.status(200).json({ message: 'Elections completed successfully', newLeaderId, yearsTillElection: colony.yearsTillElection });
  } catch (error) {
    console.error('Error handling elections:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to handle elections' });
    }
  }
};

// Check if it's an election year and trigger elections if necessary
const checkElectionYear = async (req, res) => {
  const { colonyId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(colonyId)) {
    return res.status(400).json({ message: 'Invalid colony ID' });
  }

  try {
    const colony = await Colony.findById(colonyId).populate('players.player');
    if (!colony) {
      return res.status(404).json({ message: 'Colony not found' });
    }

    if (colony.yearsTillElection === 0) {
      // Trigger elections
      const votes = {};
      const adultPlayers = colony.players.filter(player => player.player.age >= 18);

      adultPlayers.forEach(voter => {
        const relationships = voter.player.relationships.filter(rel => rel.trustLevel > 0);
        relationships.forEach(rel => {
          if (!votes[rel.player]) {
            votes[rel.player] = 0;
          }
          votes[rel.player] += rel.trustLevel;
        });
      });

      let newLeaderId;
      if (Object.keys(votes).length === 0) {
        // If no votes are cast, choose the oldest player as the leader
        const oldestPlayer = adultPlayers.reduce((oldest, player) => {
          return (player.player.age > oldest.player.age) ? player : oldest;
        }, adultPlayers[0]);
        newLeaderId = oldestPlayer.player._id;
      } else {
        newLeaderId = Object.keys(votes).reduce((a, b) => (votes[a] > votes[b] ? a : b));
      }

      colony.leader = newLeaderId;
      colony.yearsTillElection = 4;
      await colony.save();

      return res.status(200).json({ message: 'Elections completed successfully', newLeaderId, yearsTillElection: colony.yearsTillElection });
    } else {
      return res.status(200).json({ message: 'Not an election year', yearsTillElection: colony.yearsTillElection });
    }
  } catch (error) {
    console.error('Error checking election year:', error);
    res.status(500).json({ message: 'Failed to check election year' });
  }
};

// Get a colony by ID
const getColony = async (req, res) => {
  const { id } = req.params;

  try {
    const colony = await Colony.findById(id).populate('players.player');
    if (!colony) {
      return res.status(404).json({ message: 'Colony not found' });
    }
    res.status(200).json({ colony });
  } catch (error) {
    console.error('Error fetching colony:', error);
    res.status(500).json({ message: 'Failed to fetch colony' });
  }
};

// Update a colony by ID
const updateColony = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const colony = await Colony.findByIdAndUpdate(id, updateData, { new: true }).populate('players.player');
    if (!colony) {
      return res.status(404).json({ message: 'Colony not found' });
    }
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
    // Optionally, delete associated players
    await Player.deleteMany({ colony: id });
    res.status(200).json({ message: 'Colony and associated players deleted successfully' });
  } catch (error) {
    console.error('Error deleting colony:', error);
    res.status(500).json({ message: 'Failed to delete colony' });
  }
};

// Get candidates for elections
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
    res.status(500).json({ message: 'Failed to fetch candidates' });
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

    const voter = colony.players.find(player => player.player._id.equals(voterId));
    if (!voter || voter.player.age < 18) {
      return res.status(400).json({ message: 'Invalid voter' });
    }

    const candidate = colony.players.find(player => player.player._id.equals(candidateId));
    if (!candidate || candidate.player.age < 18) {
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
    res.status(500).json({ message: 'Failed to cast vote' });
  }
};

const getColonyById = async (req, res) => {
  const { id } = req.params;

  try {
    const colony = await Colony.findById(id).populate('leader');
    if (!colony) {
      return res.status(404).json({ message: 'Colony not found' });
    }
    res.status(200).json({ colony });
  } catch (error) {
    console.error('Error fetching colony:', error);
    res.status(500).json({ message: 'Failed to fetch colony' });
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
  checkElectionYear,
  getColonyById,
};