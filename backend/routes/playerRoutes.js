// routes/playerRoutes.js
const express = require('express');
const { createPlayer, getPlayerById, updatePlayer, deletePlayer, ageUpColonyMembers, retireColonyMembers, getMainPlayer, getPlayerRelationships } = require('../controllers/playerController');
const router = express.Router();

router.post('/', createPlayer);
router.get('/:id', getPlayerById);
router.put('/:id', updatePlayer);
router.delete('/:id', deletePlayer);
router.post('/ageUpColonyMembers', ageUpColonyMembers);
router.post('/retireColonyMembers', retireColonyMembers);
router.get('/main/:colonyId', getMainPlayer); // Get main player by colony ID
router.get('/:id/relationships', getPlayerRelationships); // New endpoint

module.exports = router;
