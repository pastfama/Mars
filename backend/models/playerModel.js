const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const relationshipSchema = new mongoose.Schema({
  player: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', required: true },
  relationshipType: { 
    type: String, 
    enum: [
      'parent', 'sibling', 'relative', 'friend', 'enemy', 'father', 'mother', 
      'grandfather', 'grandmother', 'greatgrandfather', 'greatgrandmother',
      'uncle', 'aunt', 'cousin', 'nephew', 'niece', 'colonist'
    ], 
    required: true 
  },
  trustLevel: { type: Number, required: true, min: 0, max: 100, default: 50 },
});

// Define the Player schema
const playerSchema = new mongoose.Schema({
  uuid: {
    type: String,
    required: true,
    unique: true,
    default: () => uuidv4(),
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  age: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    required: true,
    enum: ['male', 'female'],
  },
  skills: {
    engineering: { type: Number, default: 0 },
    biology: { type: Number, default: 0 },
    medical: { type: Number, default: 0 },
  },
  health: { type: Number, required: true, min: 0, max: 100, default: 100 },
  happiness: { type: Number, required: true, min: 0, max: 100, default: 50 },
  smarts: { type: Number, required: true, min: 0, max: 100, default: 50 },
  looks: { type: Number, required: true, min: 0, max: 100, default: 50 },
  role: { type: String, required: true, enum: ['engineer', 'biologist', 'doctor', 'scientist', 'colonist'], default: 'colonist' },
  energy: { type: Number, required: true, min: 0, max: 100, default: 100 },
  stress: { type: Number, required: true, min: 0, max: 100, default: 0 },
  mood: { type: String, enum: ['happy', 'neutral', 'unhappy', 'angry'], default: 'neutral' },
  colonyPosition: { type: String, required: true, default: 'Base Camp' },
  inventory: [{ item: { type: String, required: true }, quantity: { type: Number, required: true, min: 0, default: 0 } }],
  relationships: [relationshipSchema],
  parents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }],
  siblings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }],
  relatives: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }],
  mainPlayer: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  deceased: { type: Boolean, default: false },
  causeOfDeath: { type: String, default: null },
  colony: { type: mongoose.Schema.Types.ObjectId, ref: 'Colony' },
});

// Middleware to update `updatedAt` before save
playerSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Methods for player actions (useEnergy, improveHappiness, etc.)
playerSchema.methods.useEnergy = function (amount) { this.energy = Math.max(0, this.energy - amount); };
playerSchema.methods.improveHappiness = function (amount) { this.happiness = Math.min(100, this.happiness + amount); };
playerSchema.methods.addItemToInventory = function (itemName, quantity) {
  const itemIndex = this.inventory.findIndex(item => item.item === itemName);
  if (itemIndex !== -1) { this.inventory[itemIndex].quantity += quantity; }
  else { this.inventory.push({ item: itemName, quantity }); }
};
playerSchema.methods.removeItemFromInventory = function (itemName, quantity) {
  const itemIndex = this.inventory.findIndex(item => item.item === itemName);
  if (itemIndex !== -1 && this.inventory[itemIndex].quantity >= quantity) {
    this.inventory[itemIndex].quantity -= quantity;
    if (this.inventory[itemIndex].quantity === 0) { this.inventory.splice(itemIndex, 1); }
  }
  else { console.log('Insufficient quantity or item not found'); }
};

const Player = mongoose.model('Player', playerSchema);

module.exports = Player;
