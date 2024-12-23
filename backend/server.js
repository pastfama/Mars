const express = require('express');
const cors = require('cors');
const logger = require('./logger'); // Import the logger
const playerRoutes = require('./routes/playerRoutes'); // Import player routes
const gameRoutes = require('./routes/gameRoutes'); // Import game-related routes
const colonyRoutes = require('./routes/colonyRoutes'); // Import colony routes
const eventsRoutes = require('./routes/eventsRoutes'); // Import events routes
const researchRoutes = require('./routes/researchRoutes'); // Import research routes
const missionsRoutes = require('./routes/missionsRoutes'); // Import missions routes

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware setup
app.use(cors());
app.use(express.json());

// Log every incoming request for debugging
app.use((req, res, next) => {
  logger.logDebug('Incoming Request', {
    method: req.method,
    url: req.url,
    headers: req.headers,
    body: req.body,
    query: req.query,
  });
  next();
});

// Home route
app.get('/', (req, res) => {
  logger.logDebug('Received request at /');
  res.send('Mars: A New Hope Backend');
});

// Player routes
app.use('/players', playerRoutes);

// Game routes
app.use('/game', gameRoutes);

// Colony routes
app.use('/colony', colonyRoutes);

// Events routes
app.use('/events', eventsRoutes);

// Research routes
app.use('/research', researchRoutes);

// Missions routes
app.use('/missions', missionsRoutes);

// Handle 404 - Not Found
app.use((req, res, next) => {
  logger.logDebug('404 - Not Found', { url: req.originalUrl });
  res.status(404).json({ error: 'Not Found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.logError(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start the server
const server = app.listen(PORT, () => {
  logger.logDebug(`Server running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Gracefully shutting down');
  server.close(() => {
    console.log('Closed out remaining connections');
    process.exit(0);
  });
});
