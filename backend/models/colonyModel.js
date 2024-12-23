const mongoose = require('mongoose');

const colonySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  resources: {
    oxygen: { type: Number, required: true, default: 1000 },
    water: { type: Number, required: true, default: 1000 },
    food: { type: Number, required: true, default: 1000 },
    power: { type: Number, required: true, default: 1000 },
  },
  infrastructure: {
    livingModules: { type: Number, required: true, default: 1 },
    researchLabs: { type: Number, required: true, default: 0 },
    greenhouses: { type: Number, required: true, default: 0 },
    powerPlants: { type: Number, required: true, default: 1 },
  },
  colonyStatus: {
    type: String,
    enum: ['stable', 'at risk', 'critical'],
    default: 'stable',
  },
  activeResearch: {
    type: String,
    default: 'None',
  },
  eventHistory: [{
    event: String,
    date: {
      type: Date,
      default: Date.now,
    },
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Colony = mongoose.model('Colony', colonySchema);

module.exports = Colony;