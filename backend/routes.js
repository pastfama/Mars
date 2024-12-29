const express = require('express');
const router = express.Router();
const playerControllers = require('./controllers/playerController');

// ...existing routes...

router.post('/api/ageup', playerControllers.ageUpColonyMembers);
router.post('/api/retire', playerControllers.retireColonyMembers);

module.exports = router;