const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  colony: { type: String, required: true },
  playerName: { type: String, required: true },
});

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;
