const { getRandomName, generateRandomGender } = require('../utils/generateName');
const { v4: uuidv4 } = require('uuid'); // Import uuidv4
const Game = require('../models/game');
const Colony = require('../models/colonyModel');
const Player = require('../models/playerModel');
const { handleElections } = require('./colonyController');

const createPlayer = async (name, age, gender, role, relationships = [], parents = [], mainPlayer = false, colony = null) => {
  const player = new Player({ name, age, gender, role, relationships, parents, mainPlayer, colony });
  await player.save();
  return player;
};

// Controller to create a new game
const createGame = async (req, res) => {
  const { name, description, colonyName } = req.body;

  try {
    // Create players
    const playerCount = Math.floor(Math.random() * 6) + 5; // Random number between 5 and 10
    const players = [];

    // Parents
    const fatherLastName = getRandomName('../assets/last_names.txt');
    const fatherName = getRandomName('../assets/male_names.txt') + ' ' + fatherLastName;
    const motherName = getRandomName('../assets/female_names.txt') + ' ' + fatherLastName;

    const father = await createPlayer(fatherName, Math.floor(Math.random() * 10) + 25, 'male', 'engineer', [], [], false, null);
    players.push(father);

    const mother = await createPlayer(motherName, Math.floor(Math.random() * 10) + 25, 'female', 'doctor', [], [], false, null);
    players.push(mother);

    // Main player (newborn)
    const mainPlayerGender = generateRandomGender();
    const mainPlayerName = getRandomName(mainPlayerGender === 'male' ? '../assets/male_names.txt' : '../assets/female_names.txt') + ' ' + fatherLastName;
    const mainPlayer = await createPlayer(mainPlayerName, 0, mainPlayerGender, 'colonist', [
      { player: father._id, relationshipType: 'father', trustLevel: 50 },
      { player: mother._id, relationshipType: 'mother', trustLevel: 50 },
    ], [father._id, mother._id], true, null);
    players.push(mainPlayer);

    // Other players with specific roles
    const roles = ['biologist', 'scientist', 'colonist'];
    for (let i = 0; i < playerCount - 3; i++) {
      const gender = generateRandomGender();
      const lastName = getRandomName('../assets/last_names.txt');
      const playerName = getRandomName(gender === 'male' ? '../assets/male_names.txt' : '../assets/female_names.txt') + ' ' + lastName;
      const role = roles[i % roles.length]; // Cycle through the roles array
      const player = await createPlayer(playerName, Math.floor(Math.random() * 30) + 20, gender, role, [], [], false, null);
      players.push(player);
    }

    // Create relationships
    for (const player of players) {
      player.relationships = [
        ...player.relationships,
        ...players
          .filter(p => p._id !== player._id && !player.relationships.some(r => r.player.equals(p._id)))
          .map(p => {
            let relationshipType = 'colonist';
            if (player.age > 0 && p.age > 0) {
              const rand = Math.random();
              if (rand > 0.8) {
                relationshipType = 'enemy'; // 20% chance to be an enemy
              } else if (rand > 0.6) {
                relationshipType = 'friend'; // 20% chance to be a friend
              }
            }
            return { player: p._id, relationshipType, trustLevel: Math.floor(Math.random() * 100) };
          })
      ];
      await player.save();
    }

    // Create colony
    const colony = new Colony({
      name: colonyName,
      players: players.map(player => ({ player: player._id })),
      yearsTillElection: 4, // Ensure this field is set correctly
    });
    await colony.save();
    console.log('Colony created:', colony); // Add this line to log the created colony

    // Update players with colony reference
    for (const player of players) {
      player.colony = colony._id;
      await player.save();
    }

    // Create game
    const game = new Game({
      name,
      description,
      colony: colony._id,
    });
    await game.save();

    // Trigger elections
    await handleElections({ params: { colonyId: colony._id } }, {
      status: (code) => ({
        json: (data) => {
          if (code === 200) {
            res.status(201).json({ message: 'Game created successfully', game });
          } else {
            res.status(code).json(data);
          }
        }
      })
    });

  } catch (error) {
    console.error('Error creating game:', error);
    res.status(500).json({ message: 'Failed to create game' });
  }
};

// Controller to get a game by ID
const getGame = async (req, res) => {
  const { id } = req.params;

  try {
    const game = await Game.findById(id).populate('colony');
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }
    res.status(200).json({ game });
  } catch (error) {
    console.error('Error fetching game:', error);
    res.status(500).json({ message: 'Failed to fetch game' });
  }
};

// Controller to get all games
const getAllGames = async (req, res) => {
  try {
    const games = await Game.find().populate('colony');
    res.status(200).json({ games });
  } catch (error) {
    console.error('Error fetching games:', error);
    res.status(500).json({ message: 'Failed to fetch games' });
  }
};

// Controller to update a game by ID
const updateGame = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    const game = await Game.findByIdAndUpdate(id, { name, description }, { new: true });
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }
    res.status(200).json({ message: 'Game updated successfully', game });
  } catch (error) {
    console.error('Error updating game:', error);
    res.status(500).json({ message: 'Failed to update game' });
  }
};

// Controller to delete a game by ID
const deleteGame = async (req, res) => {
  const { id } = req.params;

  try {
    const game = await Game.findByIdAndDelete(id);
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    // Delete associated colony and players
    await Colony.findByIdAndDelete(game.colony);
    await Player.deleteMany({ colony: game.colony });

    res.status(200).json({ message: 'Game, associated colony, and players deleted successfully' });
  } catch (error) {
    console.error('Error deleting game:', error);
    res.status(500).json({ message: 'Failed to delete game' });
  }
};

module.exports = {
  createGame,
  getGame,
  getAllGames,
  updateGame,
  deleteGame,
};