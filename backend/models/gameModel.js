const mongoose = require('mongoose');

// Define the Game schema
const gameSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  colony: {
    type: String, // Store colonyId as a string
    required: true,
  },
  playerName: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware to update `updatedAt` before save (optional)
gameSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;