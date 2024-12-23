const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');
const Colony = require('../models/colonyModel'); // Assuming you have a Colony model

// POST: Create a new colony
router.post('/new', async (req, res) => {
  const { name, resources } = req.body;

  // Log the incoming request
  logger.logDebug('Received request to create a new colony', { name, resources });

  try {
    const newColony = new Colony({
      name,
      resources,
    });

    await newColony.save();

    logger.logDebug('New colony created successfully', { colonyId: newColony._id });

    res.status(201).json({ message: 'Colony created successfully', colony: newColony });
  } catch (error) {
    logger.logError('Error creating colony', error);
    res.status(500).json({ error: 'Failed to create colony' });
  }
});

// GET: Get colony status
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  // Log the incoming request
  logger.logDebug('Received request to get colony status', { colonyId: id });

  try {
    const colony = await Colony.findById(id);

    if (!colony) {
      logger.logDebug('Colony not found', { colonyId: id });
      return res.status(404).json({ error: 'Colony not found' });
    }

    logger.logDebug('Colony status fetched successfully', { colonyId: id });

    res.status(200).json(colony);
  } catch (error) {
    logger.logError('Error fetching colony status', error);
    res.status(500).json({ error: 'Failed to fetch colony status' });
  }
});

// PUT: Update colony resources
router.put('/:id/resources', async (req, res) => {
  const { id } = req.params;
  const { resources } = req.body;

  // Log the incoming request
  logger.logDebug('Received request to update colony resources', { colonyId: id, resources });

  try {
    const updatedColony = await Colony.findByIdAndUpdate(
      id,
      { resources },
      { new: true }
    );

    if (!updatedColony) {
      logger.logDebug('Colony not found for update', { colonyId: id });
      return res.status(404).json({ error: 'Colony not found' });
    }

    logger.logDebug('Colony resources updated successfully', { colonyId: updatedColony._id });

    res.status(200).json({ message: 'Colony resources updated successfully', colony: updatedColony });
  } catch (error) {
    logger.logError('Error updating colony resources', error);
    res.status(500).json({ error: 'Failed to update colony resources' });
  }
});

module.exports = router;
