const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  playerName: { type: String, required: true },
  colony: {
    food: { type: Number, default: 100 },
    water: { type: Number, default: 100 },
    power: { type: Number, default: 100 },
  },
  status: { type: String, default: 'active' },
  createdAt: { type: Date, default: Date.now },
});

// Export the model correctly
const Game = mongoose.model('Game', gameSchema);
module.exports = Game;
