const mongoose = require('mongoose');

// Define the Player schema
const playerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true, // Remove extra spaces
  },
  age: {
    type: Number,
    required: true,
  },
  skills: {
    engineering: {
      type: Number,
      default: 0, // Start with basic skill levels
    },
    biology: {
      type: Number,
      default: 0,
    },
    medical: {
      type: Number,
      default: 0,
    },
    // You can add more skills like physics, communication, etc.
  },
  health: {
    type: Number,
    required: true,
    min: 0,
    max: 100, // Health ranges from 0 to 100
    default: 100,
  },
  happiness: {
    type: Number,
    required: true,
    min: 0,
    max: 100, // Happiness ranges from 0 to 100
    default: 50,
  },
  smarts: {
    type: Number,
    required: true,
    min: 0,
    max: 100, // Intelligence ranges from 0 to 100
    default: 50,
  },
  looks: {
    type: Number,
    required: true,
    min: 0,
    max: 100, // Looks rating ranges from 0 to 100
    default: 50,
  },
  role: {
    type: String,
    required: true,
    enum: ['engineer', 'biologist', 'doctor', 'scientist', 'colonist'],
    default: 'colonist', // The player will have a role in the colony
  },
  energy: {
    type: Number,
    required: true,
    min: 0,
    max: 100, // Energy ranges from 0 to 100
    default: 100,
  },
  stress: {
    type: Number,
    required: true,
    min: 0,
    max: 100, // Stress level ranges from 0 to 100
    default: 0,
  },
  colonyPosition: {
    type: String,
    required: true,
    default: 'Base Camp', // The current position of the player in the colony
  },
  inventory: [{
    item: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware to update `updatedAt` before save
playerSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Method to reduce player's energy based on an action
playerSchema.methods.useEnergy = function (amount) {
  this.energy = Math.max(0, this.energy - amount);
};

// Method to improve player's happiness
playerSchema.methods.improveHappiness = function (amount) {
  this.happiness = Math.min(100, this.happiness + amount);
};

// Method to add an item to the inventory
playerSchema.methods.addItemToInventory = function (itemName, quantity) {
  const itemIndex = this.inventory.findIndex(item => item.item === itemName);
  if (itemIndex !== -1) {
    this.inventory[itemIndex].quantity += quantity;
  } else {
    this.inventory.push({ item: itemName, quantity });
  }
};

// Method to remove an item from the inventory
playerSchema.methods.removeItemFromInventory = function (itemName, quantity) {
  const itemIndex = this.inventory.findIndex(item => item.item === itemName);
  if (itemIndex !== -1 && this.inventory[itemIndex].quantity >= quantity) {
    this.inventory[itemIndex].quantity -= quantity;
    if (this.inventory[itemIndex].quantity === 0) {
      this.inventory.splice(itemIndex, 1);
    }
  } else {
    console.log('Insufficient quantity or item not found');
  }
};

const Player = mongoose.model('Player', playerSchema);

module.exports = Player;
