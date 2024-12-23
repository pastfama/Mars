const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  actionType: {
    type: String,
    required: true,
    enum: ['building', 'repairing', 'exploring', 'training'],
  },
  duration: {
    type: Number, // Duration in hours or days
    required: true,
  },
  resourcesRequired: {
    oxygen: { type: Number, default: 0 },
    water: { type: Number, default: 0 },
    food: { type: Number, default: 0 },
    power: { type: Number, default: 0 },
  },
  taskStatus: {
    type: String,
    enum: ['pending', 'in-progress', 'completed'],
    default: 'pending',
  },
  assignedTo: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player',
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
