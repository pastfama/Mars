const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

// Define the Colony schema
const colonySchema = new mongoose.Schema({
  colonyId: { 
    type: String, 
    default: uuidv4, // Automatically generate a UUID for each new colony
    unique: true, // Ensure the colonyId is unique
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  resources: {
    oxygen: { type: Number, required: true, default: 1000, min: [0, 'Oxygen cannot be negative'] },
    water: { type: Number, required: true, default: 1000, min: [0, 'Water cannot be negative'] },
    food: { type: Number, required: true, default: 1000, min: [0, 'Food cannot be negative'] },
    power: { type: Number, required: true, default: 1000, min: [0, 'Power cannot be negative'] },
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
  players: [{
    player: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' }, // Link to Player model
    role: { type: String, enum: ['engineer', 'biologist', 'doctor', 'scientist', 'colonist'], default: 'colonist' },
    health: { type: Number, default: 100 },
    energy: { type: Number, default: 100 },
    mood: { type: String, enum: ['happy', 'neutral', 'unhappy', 'angry'], default: 'neutral' },
    stress: { type: Number, default: 0 },
    skills: {
      engineering: { type: Number, default: 0 },
      biology: { type: Number, default: 0 },
      medical: { type: Number, default: 0 },
    },
  }],
  leader: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', default: null }, // Optional: Leader of the colony
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date, // Optional: Track when the colony was last updated
    default: Date.now,
  },
});

// Middleware to update `updatedAt` before save (optional)
colonySchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const Colony = mongoose.model('Colony', colonySchema);

module.exports = Colony;
