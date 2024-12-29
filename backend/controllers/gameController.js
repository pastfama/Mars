const { getRandomName, generateRandomGender } = require('../utils/generateName');
const { v4: uuidv4 } = require('uuid'); // Import uuidv4
const Game = require('../models/game');
const Colony = require('../models/colonyModel');
const Player = require('../models/playerModel');

const createPlayer = async (name, age, gender, relationships = [], parents = [], mainPlayer = false, colony = null) => {
  const player = new Player({ name, age, gender, relationships, parents, mainPlayer, colony });
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

    const father = await createPlayer(fatherName, Math.floor(Math.random() * 10) + 25, 'male', [], [], false, null);
    players.push(father);

    const mother = await createPlayer(motherName, Math.floor(Math.random() * 10) + 25, 'female', [], [], false, null);
    players.push(mother);

    // Main player (newborn)
    const mainPlayerGender = generateRandomGender();
    const mainPlayerName = getRandomName(mainPlayerGender === 'male' ? '../assets/male_names.txt' : '../assets/female_names.txt') + ' ' + fatherLastName;
    const mainPlayer = await createPlayer(mainPlayerName, 0, mainPlayerGender, [
      { player: father._id, relationshipType: 'father', trustLevel: 50 },
      { player: mother._id, relationshipType: 'mother', trustLevel: 50 },
    ], [father._id, mother._id], true, null);
    players.push(mainPlayer);

    // Other players
    for (let i = 0; i < playerCount - 3; i++) {
      const gender = generateRandomGender();
      const lastName = getRandomName('../assets/last_names.txt');
      const playerName = getRandomName(gender === 'male' ? '../assets/male_names.txt' : '../assets/female_names.txt') + ' ' + lastName;
      const player = await createPlayer(playerName, Math.floor(Math.random() * 30) + 20, gender, [], [], false, null);
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

    // Create the colony
    const newColony = new Colony({
      colonyId: uuidv4(),
      name: colonyName,
      gameId: null, // This will be set after the game is created
      players: players.map(player => ({ player: player._id, role: 'colonist' })),
      leader: oldestPlayer._id,
      yearsTillElection: 4,
    });
    await newColony.save();

    // Update players with the colony ID
    for (const player of players) {
      player.colony = newColony._id;
      await player.save();
    }

    // Create the game
    const newGame = new Game({
      name,
      description,
      colony: newColony._id,
    });
    await newGame.save();

    // Update the colony with the game ID
    newColony.gameId = newGame._id;
    await newColony.save();

    console.log('Created game:', newGame);
    res.status(201).json({ game: newGame });
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
  const updateData = req.body;

  try {
    const game = await Game.findByIdAndUpdate(id, updateData, { new: true }).populate('colony');
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }
    res.status(200).json({ game });
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
    // Optionally, delete associated colony and players
    await Colony.findByIdAndDelete(game.colony);
    await Player.deleteMany({ colony: game.colony });
    res.status(200).json({ message: 'Game and associated colony and players deleted successfully' });
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