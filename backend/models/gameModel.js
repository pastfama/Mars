const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  playerName: { type: String, required: true },
  colony: { type: mongoose.Schema.Types.ObjectId, ref: 'Colony', required: true },  // Reference to Colony model
  status: { type: String, default: 'active' },
  createdAt: { type: Date, default: Date.now },
});

const Game = mongoose.model('Game', gameSchema);
module.exports = Game;
