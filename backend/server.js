require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose'); // Mongoose for MongoDB connection
const logger = require('./utils/logger'); // Import the logger
const playerRoutes = require('./routes/playerRoutes'); // Import player routes
const gameRoutes = require('./routes/gameRoutes'); // Import game-related routes
const colonyRoutes = require('./routes/colonyRoutes'); // Import colony routes
const eventsRoutes = require('./routes/eventsRoutes'); // Import events routes
const researchRoutes = require('./routes/researchRoutes'); // Import research routes
const missionsRoutes = require('./routes/missionsRoutes'); // Import missions routes
const activitiesRoutes = require('./routes/activitiesRoutes'); // Import activities routes
const ageUpRoutes = require('./routes/ageUpRoutes'); // Import age up routes

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware setup
app.use(cors()); // Enable CORS for all routes
app.use(express.json());
app.use(bodyParser.json());

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
app.use('/players', playerRoutes);
app.use('/game', gameRoutes);
app.use('/colony', colonyRoutes);
app.use('/events', eventsRoutes);
app.use('/research', researchRoutes);
app.use('/missions', missionsRoutes);
app.use('/activities', activitiesRoutes);
app.use('/ageUp', ageUpRoutes);

// Handle 404 - Route not found
app.use((req, res, next) => {
  logger.logDebug('404 - Not Found', { url: req.originalUrl });
  res.status(404).json({ error: 'Not Found' });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  logger.logError('Global error handler', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
