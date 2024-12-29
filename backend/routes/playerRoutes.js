// routes/playerRoutes.js
const express = require('express');
const { createPlayer, getPlayerById, updatePlayer, deletePlayer, ageUpColonyMembers, retireColonyMembers, getMainPlayerByColonyId } = require('../controllers/playerController');
const router = express.Router();

router.post('/', createPlayer);
router.get('/:id', getPlayerById);
router.put('/:id', updatePlayer);
router.delete('/:id', deletePlayer);
router.post('/ageUpColonyMembers', ageUpColonyMembers);
router.post('/retireColonyMembers', retireColonyMembers);
router.get('/main/:colonyId', getMainPlayerByColonyId);

module.exports = router;
