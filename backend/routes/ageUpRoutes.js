const express = require('express');
const router = express.Router();
const playerControllers = require('../controllers/playerController');

router.post('/ageup', (req, res, next) => {
  console.log('Received request to /api/ageup');
  next();
}, playerControllers.ageUpColonyMembers);

module.exports = router;