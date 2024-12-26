const Game = require('../models/game');
const Colony = require('../models/colonyModel');
const Player = require('../models/playerModel');

// Controller to create a new game
const createGame = async (req, res) => {
  const { name, description, colonyName, playerName } = req.body;

  try {
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

    // Create a new colony and associate it with the players
    const newColony = new Colony({
      name: colonyName,
      resources: {
        food: 100, // Default resource values
        water: 100,
        power: 100,
      },
      players: players.map(player => ({ player: player._id, role: 'colonist' })),
      leader: leader._id,
    });

    await newColony.save();
    console.log('Created colony with ID:', newColony.colonyId);

    // Create a new game and associate it with the colony
    const newGame = new Game({
      name,
      description,
      colony: newColony.colonyId, // Link the colonyId
      playerName,
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
    const games = await Game.find(); // Fetch all games from the database
    res.status(200).json({ games });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch games' });
  }
};

// Controller to get a specific game by ID
const getGame = async (req, res) => {
  const { id } = req.params;
  try {
    const game = await Game.findById(id); // Fetch game by ID from the database
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }
    res.status(200).json({ game });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch game' });
  }
};

// Controller to delete a game by ID
const deleteGame = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedGame = await Game.findByIdAndDelete(id); // Delete game by ID
    if (deletedGame) {
      res.status(200).json({ message: 'Game deleted successfully' });
    } else {
      res.status(404).json({ error: 'Game not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete game' });
  }
};

module.exports = { createGame, getAllGames, getGame, deleteGame };