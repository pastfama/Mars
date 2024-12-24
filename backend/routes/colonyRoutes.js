const express = require('express');
const router = express.Router();
const { createColony, getColony, updateColony, deleteColony } = require('../controllers/colonyController');

// Debugging: Log when the route is accessed
router.post('/colony', createColony);

router.get('/colony/:id', getColony);

router.put('/colony/:id', updateColony);

router.delete('/colony/:id', deleteColony);

module.exports = router;
