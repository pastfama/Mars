const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');
const Event = require('../models/eventModel'); // Assuming you have an Event model

// POST: Create a new event
router.post('/new', async (req, res) => {
  const { description, type, impact } = req.body;

  // Log the incoming request
  logger.logDebug('Received request to create a new event', { description, type, impact });

  try {
    const newEvent = new Event({
      description,
      type,
      impact,
      resolved: false,
    });

    await newEvent.save();

    logger.logDebug('New event created successfully', { eventId: newEvent._id });

    res.status(201).json({ message: 'Event created successfully', event: newEvent });
  } catch (error) {
    logger.logError('Error creating event', error);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

// GET: List all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find();

    logger.logDebug('Fetched list of events', { eventsCount: events.length });

    res.status(200).json(events);
  } catch (error) {
    logger.logError('Error fetching events', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// PUT: Resolve an event
router.put('/:id/resolve', async (req, res) => {
  const { id } = req.params;

  // Log the incoming request
  logger.logDebug('Received request to resolve event', { eventId: id });

  try {
    const resolvedEvent = await Event.findByIdAndUpdate(
      id,
      { resolved: true },
      { new: true }
    );

    if (!resolvedEvent) {
      logger.logDebug('Event not found for resolution', { eventId: id });
      return res.status(404).json({ error: 'Event not found' });
    }

    logger.logDebug('Event resolved successfully', { eventId: resolvedEvent._id });

    res.status(200).json({ message: 'Event resolved successfully', event: resolvedEvent });
  } catch (error) {
    logger.logError('Error resolving event', error);
    res.status(500).json({ error: 'Failed to resolve event' });
  }
});

module.exports = router;
