const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');
const Research = require('../models/researchModel'); // Assuming you have a Research model

// POST: Start a new research project
router.post('/start', async (req, res) => {
  const { name, description, duration } = req.body;

  // Log the incoming request
  logger.logDebug('Received request to start new research', { name, description, duration });

  try {
    const newResearch = new Research({
      name,
      description,
      duration,
      progress: 0,
    });

    await newResearch.save();

    logger.logDebug('New research started successfully', { researchId: newResearch._id });

    res.status(201).json({ message: 'Research started successfully', research: newResearch });
  } catch (error) {
    logger.logError('Error starting research', error);
    res.status(500).json({ error: 'Failed to start research' });
  }
});

// PUT: Update research progress
router.put('/:id/progress', async (req, res) => {
  const { id } = req.params;
  const { progress } = req.body;

  // Log the incoming request
  logger.logDebug('Received request to update research progress', { researchId: id, progress });

  try {
    const updatedResearch = await Research.findByIdAndUpdate(
      id,
      { progress },
      { new: true }
    );

    if (!updatedResearch) {
      logger.logDebug('Research not found for update', { researchId: id });
      return res.status(404).json({ error: 'Research not found' });
    }

    logger.logDebug('Research progress updated successfully', { researchId: updatedResearch._id });

    res.status(200).json({ message: 'Research progress updated successfully', research: updatedResearch });
  } catch (error) {
    logger.logError('Error updating research progress', error);
    res.status(500).json({ error: 'Failed to update research progress' });
  }
});

// PUT: Complete research project
router.put('/:id/complete', async (req, res) => {
  const { id } = req.params;

  // Log the incoming request
  logger.logDebug('Received request to complete research', { researchId: id });

  try {
    const completedResearch = await Research.findByIdAndUpdate(
      id,
      { status: 'completed' },
      { new: true }
    );

    if (!completedResearch) {
      logger.logDebug('Research not found for completion', { researchId: id });
      return res.status(404).json({ error: 'Research not found' });
    }

    logger.logDebug('Research completed successfully', { researchId: completedResearch._id });

    res.status(200).json({ message: 'Research completed successfully', research: completedResearch });
  } catch (error) {
    logger.logError('Error completing research', error);
    res.status(500).json({ error: 'Failed to complete research' });
  }
});

module.exports = router;
