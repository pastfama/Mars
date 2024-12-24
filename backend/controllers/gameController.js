const Game = require('../models/Game');

// Controller to create a new game
const createGame = async (req, res) => {
  const { name, description, colony, playerName } = req.body;
  try {
    const newGame = new Game({
      name,
      description,
      colony,
      playerName,
    });

    await newGame.save();
    res.status(201).json({ game: newGame });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create game' });
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
