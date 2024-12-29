const logger = require('../utils/logger');
const Player = require('../models/playerModel'); // Assuming you have a Player model set up

// POST: Create a new player
const createPlayer = async (req, res) => {
  const { name, skills, health, happiness, smarts, looks, parents, colony, mainPlayer } = req.body;

  logger.logDebug('Received request to create a new player', { name, skills, health, happiness, smarts, looks, parents, colony, mainPlayer });

  try {
    const newPlayer = new Player({ name, skills, health, happiness, smarts, looks, parents, colony, mainPlayer });
    await newPlayer.save();
    res.status(201).json(newPlayer);
  } catch (error) {
    logger.logError('Error creating player', error);
    res.status(500).json({ error: 'Failed to create player' });
  }
};

// GET: Get player details by ID
const getPlayerById = async (req, res) => {
  try {
    const player = await Player.findById(req.params.id)
      .populate('relationships.player')
      .populate('parents.player')
      .populate('siblings')
      .populate('relatives');
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
  const { name, skills, health, happiness, smarts, looks, parents } = req.body;

  logger.logDebug('Received request to update player', { playerId: id, updatedData: req.body });

  try {
    const updatedPlayer = await Player.findByIdAndUpdate(
      id,
      { name, skills, health, happiness, smarts, looks, parents },
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

// POST: Age up all colony members by one year
const ageUpColonyMembers = async (req, res) => {
  logger.logDebug('Received request to age up all colony members');

  try {
    const players = await Player.find({ colony: req.body.colonyId });
    const deceasedPlayers = [];
    const newPlayers = [];

    for (const player of players) {
      player.age += 1;

      // Check for death due to old age
      if (player.age > 80 && player.health < 20) {
        player.deceased = true;
        player.causeOfDeath = 'old age';
        deceasedPlayers.push(player);
      }

      await player.save();
    }

    // Event: New players arrive from Earth
    const newPlayerCount = Math.floor(Math.random() * 3) + 1; // Random number between 1 and 3

    for (let i = 0; i < newPlayerCount; i++) {
      const newPlayer = new Player({
        name: `NewPlayer_${Date.now()}_${i}`,
        age: Math.floor(Math.random() * 30) + 20,
        gender: Math.random() > 0.5 ? 'male' : 'female',
        colony: req.body.colonyId,
      });
      await newPlayer.save();
      newPlayers.push(newPlayer);
    }

    const summary = {
      agedUpPlayers: players.length,
      deceasedPlayers: deceasedPlayers.length,
      newPlayers: newPlayers.length,
    };

    logger.logDebug('All colony members aged up successfully and new players arrived', { newPlayers, deceasedPlayers });
    res.status(200).json({ message: 'All colony members aged up successfully and new players arrived', summary });
  } catch (error) {
    logger.logError('Error aging up colony members', error);
    res.status(500).json({ error: 'Failed to age up colony members' });
  }
};

// POST: Retire colony members
const retireColonyMembers = async (req, res) => {
  logger.logDebug('Received request to retire colony members');

  try {
    const retiredPlayers = await Player.updateMany({ age: { $gte: 65 } }, { status: 'retired' });
    logger.logDebug('Colony members have been retired', { retiredPlayers });
    res.status(200).json({ message: 'Colony members have been retired', retiredPlayers });
  } catch (error) {
    logger.logError('Error retiring colony members', error);
    res.status(500).json({ error: 'Failed to retire colony members' });
  }
};

const getMainPlayerByColonyId = async (req, res) => {
  const { colonyId } = req.params;

  try {
    const mainPlayer = await Player.findOne({ colony: colonyId, mainPlayer: true });
    if (!mainPlayer) {
      return res.status(404).json({ error: 'Main player not found' });
    }
    res.status(200).json({ mainPlayer });
  } catch (error) {
    logger.logError('Error fetching main player', error);
    res.status(500).json({ error: 'Failed to fetch main player' });
  }
};

module.exports = { createPlayer, getPlayerById, updatePlayer, deletePlayer, ageUpColonyMembers, retireColonyMembers, getMainPlayerByColonyId };
