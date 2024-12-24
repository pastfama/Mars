const Game = require('../models/game');
const Colony = require('../models/colonyModel'); // Ensure this import is present

// Controller to create a new game
const createGame = async (req, res) => {
  const { name, description, colonyName, playerName } = req.body;

  try {
    // Create a new colony
    const newColony = new Colony({
      name: colonyName,
      resources: {
        food: 100, // Default resource values
        water: 100,
        power: 100,
      },
    });

    await newColony.save();

    // Create a new game and associate it with the colony
    const newGame = new Game({
      name,
      description,
      colony: newColony._id, // Link the colony
      playerName,
    });

    await newGame.save();

    res.status(201).json({ game: newGame, colony: newColony });
  } catch (error) {
    console.error('Error creating game and colony:', error);
    res.status(500).json({ error: 'Failed to create game and colony' });
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
