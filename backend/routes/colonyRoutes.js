const express = require('express');
const router = express.Router();
const colonyController = require('../controllers/colonyController'); // Importing the controller

// POST: Create a new colony
router.post('/new', colonyController.createColony);

// GET: Get colony status
router.get('/:id', colonyController.getColonyStatus);

// PUT: Update colony resources
router.put('/:id/resources', colonyController.updateColonyResources);

module.exports = router;
