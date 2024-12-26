const { getRandomName, generateRandomGender } = require('../utils/generateName');
const Game = require('../models/game');
const Colony = require('../models/colonyModel');
const Player = require('../models/playerModel');

// Controller to create a new game
const createGame = async (req, res) => {
  const { name, description, colonyName } = req.body;

  try {
    // Create players
    const playerCount = Math.floor(Math.random() * 6) + 5; // Random number between 5 and 10
    const players = [];

    // Parents
    const fatherLastName = getRandomName('../assets/last_names.txt');
    const father = new Player({
      name: getRandomName('../assets/male_names.txt') + ' ' + fatherLastName,
      age: Math.floor(Math.random() * 10) + 25, // Age between 25 and 35
      gender: 'male',
    });
    await father.save();
    players.push(father);

    const mother = new Player({
      name: getRandomName('../assets/female_names.txt') + ' ' + fatherLastName,
      age: Math.floor(Math.random() * 10) + 25, // Age between 25 and 35
      gender: 'female',
    });
    await mother.save();
    players.push(mother);

    // Main player (newborn)
    const mainPlayerGender = generateRandomGender();
    const mainPlayer = new Player({
      name: getRandomName(mainPlayerGender === 'male' ? '../assets/male_names.txt' : '../assets/female_names.txt') + ' ' + fatherLastName,
      age: 0,
      gender: mainPlayerGender,
    });
    await mainPlayer.save();
    players.push(mainPlayer);

    // Other players
    for (let i = 0; i < playerCount - 3; i++) {
      const gender = generateRandomGender();
      const player = new Player({
        name: getRandomName(gender === 'male' ? '../assets/male_names.txt' : '../assets/female_names.txt') + ' ' + fatherLastName,
        age: Math.floor(Math.random() * 30) + 20, // Age between 20 and 49
        gender,
      });
      await player.save();
      players.push(player);
    }

    // Create relationships
    for (const player of players) {
      player.relationships = players.filter(p => p._id !== player._id).map(p => ({
        player: p._id,
        relationshipType: 'neutral',
        trustLevel: 50,
      }));
      await player.save();
    }

    // Set family relationships
    mainPlayer.parents = [father._id, mother._id];
    await mainPlayer.save();

    father.relationships.push({
      player: mother._id,
      relationshipType: 'family',
      trustLevel: 80,
    });
    father.relationships.push({
      player: mainPlayer._id,
      relationshipType: 'family',
      trustLevel: 100,
    });
    await father.save();

    mother.relationships.push({
      player: father._id,
      relationshipType: 'family',
      trustLevel: 80,
    });
    mother.relationships.push({
      player: mainPlayer._id,
      relationshipType: 'family',
      trustLevel: 100,
    });
    await mother.save();

    // Set the mainPlayer flag for the newborn
    const newborn = players.find(player => player.age === 0);
    if (newborn) {
      newborn.mainPlayer = true;
      await newborn.save();
    }

    // Create a new colony and associate it with the players
    const newColony = new Colony({
      name: colonyName,
      resources: {
        food: 100, // Default resource values
        water: 100,
        power: 100,
      },
      players: players.map(player => ({ player: player._id, role: 'colonist' })),
      leader: father._id,
    });

    await newColony.save();
    console.log('Created colony with ID:', newColony.colonyId);

    // Create a new game and associate it with the colony
    const newGame = new Game({
      name,
      description,
      colony: newColony.colonyId, // Link the colonyId
    });

    await newGame.save();

    res.status(201).json({ game: newGame, colony: newColony, players });
  } catch (error) {
    console.error('Error creating game, colony, and players:', error);
    res.status(500).json({ error: 'Failed to create game, colony, and players' });
  }
};

// Controller to get all games
const getAllGames = async (req, res) => {
  try {
    const games = await Game.find();
    res.status(200).json({ games });
  } catch (error) {
    console.error('Error fetching games:', error);
    res.status(500).json({ error: 'Failed to fetch games' });
  }
};

// Controller to get a game by ID
const getGame = async (req, res) => {
  const { id } = req.params;

  try {
    const game = await Game.findById(id).populate('colony');
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }
    res.status(200).json({ game });
  } catch (error) {
    console.error('Error fetching game:', error);
    res.status(500).json({ error: 'Failed to fetch game' });
  }
};

// Controller to delete a game by ID
const deleteGame = async (req, res) => {
  const { id } = req.params;

  try {
    console.log(`Received request to delete game with ID: ${id}`);

    // Find the game
    const game = await Game.findById(id);
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    // Find the associated colony
    const colony = await Colony.findOne({ colonyId: game.colony });
    if (colony) {
      // Delete all players associated with the colony
      await Player.deleteMany({ _id: { $in: colony.players.map(p => p.player) } });

      // Delete the colony
      await Colony.findOneAndDelete({ colonyId: game.colony });
    }

    // Delete the game
    await Game.findByIdAndDelete(id);

    console.log(`Deleted game with ID: ${id}`);
    res.status(200).json({ message: 'Game and associated entities deleted successfully' });
  } catch (error) {
    console.error('Error deleting game:', error);
    res.status(500).json({ error: 'Failed to delete game' });
  }
};

module.exports = { createGame, getAllGames, getGame, deleteGame };