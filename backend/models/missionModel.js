const mongoose = require('mongoose');

const missionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  missionType: {
    type: String,
    required: true,
    enum: ['exploration', 'resource gathering', 'maintenance', 'research'],
  },
  resourcesRequired: {
    oxygen: { type: Number, required: true },
    water: { type: Number, required: true },
    food: { type: Number, required: true },
    power: { type: Number, required: true },
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed', 'failed'],
    default: 'pending',
  },
  completionTime: {
    type: Date,
  },
  reward: {
    resources: {
      oxygen: { type: Number, default: 0 },
      water: { type: Number, default: 0 },
      food: { type: Number, default: 0 },
      power: { type: Number, default: 0 },
    },
    other: { type: String, default: 'None' },
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player',
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Mission = mongoose.model('Mission', missionSchema);

module.exports = Mission;
