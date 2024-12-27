const express = require('express');
const router = express.Router();
const { getActivities } = require('../controllers/activitiesController');

router.get('/:lifeStage', getActivities);

module.exports = router;