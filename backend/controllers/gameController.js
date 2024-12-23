const Game = require('../models/gameModel'); // Assuming you have a Game model

// Start a new game
exports.startNewGame = async (req, res) => {
  try {
    const { playerName } = req.body;

    if (!playerName) {
      return res.status(400).json({ message: 'Player name is required' });
    }

    // Initialize new game with default settings
    const newGame = new Game({
      playerName,
      colony: { food: 100, water: 100, power: 100 },
      status: 'active',
      createdAt: new Date(),
    });

    await newGame.save();
    res.status(201).json({ message: 'New game started', game: newGame });

  } catch (error) {
    console.error('Error starting new game:', error); // Log the full error
    res.status(500).json({ message: 'Error starting new game', error: error.message });
  }
};

// Save the current game state
exports.saveGame = async (req, res) => {
  try {
    const { gameId, colony, status } = req.body;

    if (!gameId) {
      return res.status(400).json({ message: 'Game ID is required' });
    }

    // Find the game by its ID and update its state
    const game = await Game.findById(gameId);

    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    // Update game state
    game.colony = colony || game.colony;
    game.status = status || game.status;
    game.updatedAt = new Date();

    await game.save();

    res.status(200).json({ message: 'Game saved successfully', game });
  } catch (error) {
    res.status(500).json({ message: 'Error saving game', error });
  }
};

// Get the current game state
exports.getGameState = async (req, res) => {
  try {
    const { gameId } = req.query; // Assuming gameId is passed as a query parameter

    if (!gameId) {
      return res.status(400).json({ message: 'Game ID is required' });
    }

    // Find the game by its ID
    const game = await Game.findById(gameId);

    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    // Return the current state of the game
    res.status(200).json({
      playerName: game.playerName,
      colony: game.colony,
      status: game.status,
      createdAt: game.createdAt,
      updatedAt: game.updatedAt,
    });
  } catch (error) {
    console.error('Error fetching game state:', error);
    res.status(500).json({ message: 'Error fetching game state', error: error.message });
  }
};
