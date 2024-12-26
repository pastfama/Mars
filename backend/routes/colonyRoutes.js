const express = require('express');
const router = express.Router();
const { createColony, getColony, updateColony, deleteColony } = require('../controllers/colonyController');

// Middleware to log request details
const logRequestDetails = (req, res, next) => {
  console.log(`Received ${req.method} request for ${req.url}`);
  console.log('Request Headers:', req.headers);
  console.log('Request Body:', req.body);
  console.log('Request Params:', req.params);
  console.log('Request Query:', req.query);
  next();
};

// Apply the logging middleware to all routes
router.use(logRequestDetails);

// Route to create a new colony
router.post('/', createColony);

// Route to get a colony by ID
router.get('/:id', getColony);

// Route to update a colony by ID
router.put('/:id', updateColony);

// Route to delete a colony by ID
router.delete('/:id', deleteColony);

module.exports = router;
