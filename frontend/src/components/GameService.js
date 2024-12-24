import axios from 'axios';

const API_URL = 'http://localhost:5000/api/game'; // Adjust this URL if your backend is hosted elsewhere

// Create a new game
export const createGame = async (gameData) => {
  try {
    const response = await axios.post(API_URL, gameData);
    return response.data;
  } catch (error) {
    console.error('Error creating game:', error);
    throw error;
  }
};

// Get game details by ID
export const getGame = async (gameId) => {
  try {
    const response = await axios.get(`${API_URL}/${gameId}`);
    return response.data;
  } catch (error) {
    console.error('Error retrieving game:', error);
    throw error;
  }
};

// Update game details by ID
export const updateGame = async (gameId, updatedData) => {
  try {
    const response = await axios.put(`${API_URL}/${gameId}`, updatedData);
    return response.data;
  } catch (error) {
    console.error('Error updating game:', error);
    throw error;
  }
};

// Delete a game by ID
export const deleteGame = async (gameId) => {
  try {
    const response = await axios.delete(`${API_URL}/${gameId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting game:', error);
    throw error;
  }
};
