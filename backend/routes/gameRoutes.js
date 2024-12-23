// backend/routes/gameRoutes.js
const express = require('express');
const router = express.Router();

// Example route
router.get('/', (req, res) => {
  res.json({ message: 'Game routes' });
});

module.exports = router;
