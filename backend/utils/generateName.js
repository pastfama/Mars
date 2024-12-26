const fs = require('fs');
const path = require('path');

// Helper function to get random name from file
const getRandomName = (filePath) => {
  const names = fs.readFileSync(path.resolve(__dirname, filePath), 'utf-8').split('\n').filter(Boolean);
  return names[Math.floor(Math.random() * names.length)];
};

// Helper function to generate random gender
const generateRandomGender = () => {
  return Math.random() < 0.5 ? 'male' : 'female';
};

module.exports = { getRandomName, generateRandomGender };