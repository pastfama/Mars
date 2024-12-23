const mongoose = require('mongoose');

const researchSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  cost: {
    oxygen: { type: Number, required: true },
    water: { type: Number, required: true },
    food: { type: Number, required: true },
    power: { type: Number, required: true },
  },
  progress: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  unlocks: [{
    type: String, // could be a feature unlocked, e.g., "advanced_living_modules"
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Research = mongoose.model('Research', researchSchema);

module.exports = Research;
