require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); // Mongoose for MongoDB connection
const logger = require('./utils/logger'); // Import the logger
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

// Request logging middleware for debugging
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

// MongoDB connection
const connectToDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    logger.logDebug('Connected to MongoDB');
  } catch (error) {
    logger.logError('Error connecting to MongoDB', error);
    process.exit(1); // Exit if the database connection fails
  }
};

// Establish database connection
connectToDB();

// Home route
app.get('/', (req, res) => {
  logger.logDebug('Received request at /');
  res.send('Mars: A New Hope Backend');
});

// Register routes
app.use('/game', gameRoutes); // Ensure the /game route is correctly registered

// Handle 404 - Route not found
app.use((req, res, next) => {
  logger.logDebug('404 - Not Found', { url: req.originalUrl });
  res.status(404).json({ error: 'Not Found' });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  logger.logError(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start server and listen for incoming requests
const server = app.listen(PORT, () => {
  logger.logDebug(`Server running on http://localhost:${PORT}`);
});

// Graceful shutdown on process interrupt (Ctrl+C)
process.on('SIGINT', () => {
  console.log('Gracefully shutting down');
  server.close(() => {
    console.log('Closed out remaining connections');
    process.exit(0);
  });
});
