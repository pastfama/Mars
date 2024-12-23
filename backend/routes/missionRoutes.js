const express = require('express');
const router = express.Router();
const logger = require('../logger');
const Mission = require('../models/missionModel'); // Assuming you have a Mission model

// POST: Create a new mission
router.post('/new', async (req, res) => {
  const { name, description, difficulty, reward } = req.body;

  // Log the incoming request
  logger.logDebug('Received request to create a new mission', { name, description, difficulty, reward });

  try {
    const newMission = new Mission({
      name,
      description,
      difficulty,
      reward,
      status: 'pending',
    });

    await newMission.save();

    logger.logDebug('New mission created successfully', { missionId: newMission._id });

    res.status(201).json({ message: 'Mission created successfully', mission: newMission });
  } catch (error) {
    logger.logError('Error creating mission', error);
    res.status(500).json({ error: 'Failed to create mission' });
  }
});

// PUT: Assign a mission to a player
router.put('/:id/assign', async (req, res) => {
  const { id } = req.params;
  const { playerId } = req.body;

  // Log the incoming request
  logger.logDebug('Received request to assign mission', { missionId: id, playerId });

  try {
    const assignedMission = await Mission.findByIdAndUpdate(
      id,
      { playerId, status: 'in-progress' },
      { new: true }
    );

    if (!assignedMission) {
      logger.logDebug('Mission not found for assignment', { missionId: id });
      return res.status(404).json({ error: 'Mission not found' });
    }

    logger.logDebug('Mission assigned successfully', { missionId: assignedMission._id });

    res.status(200).json({ message: 'Mission assigned successfully', mission: assignedMission });
  } catch (error) {
    logger.logError('Error assigning mission', error);
    res.status(500).json({ error: 'Failed to assign mission' });
  }
});

// PUT: Complete a mission
router.put('/:id/complete', async (req, res) => {
  const { id } = req.params;

  // Log the incoming request
  logger.logDebug('Received request to complete mission', { missionId: id });

  try {
    const completedMission = await Mission.findByIdAndUpdate(
      id,
      { status: 'completed' },
      { new: true }
    );

    if (!completedMission) {
      logger.logDebug('Mission not found for completion', { missionId: id });
      return res.status(404).json({ error: 'Mission not found' });
    }

    logger.logDebug('Mission completed successfully', { missionId: completedMission._id });

    res.status(200).json({ message: 'Mission completed successfully', mission: completedMission });
  } catch (error) {
    logger.logError('Error completing mission', error);
    res.status(500).json({ error: 'Failed to complete mission' });
  }
});

module.exports = router;
