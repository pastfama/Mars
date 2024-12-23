const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['disaster', 'discovery', 'research', 'maintenance'],
  },
  description: {
    type: String,
    required: true,
  },
  impact: {
    type: String,
    required: true,
    enum: ['positive', 'negative', 'neutral'],
  },
  resourcesAffected: {
    oxygen: { type: Number, default: 0 },
    water: { type: Number, default: 0 },
    food: { type: Number, default: 0 },
    power: { type: Number, default: 0 },
  },
  date: {
    type: Date,
    default: Date.now,
  },
  resolved: {
    type: Boolean,
    default: false,
  },
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
