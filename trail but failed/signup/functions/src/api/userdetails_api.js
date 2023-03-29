// Import required modules
const express = require('express');
const cors = require('cors');
const {
  currentUser,
  handleUserUpdate,
  handleLogin,
  handleLogout,
} = require('../controllers/authentication_handler.js');

// Create an Express application
const service = express();

// Use CORS middleware
service.use(cors());

// Set up the routes for the authentication endpoints
service.post('/login', handleLogin);
service.get('/profile', currentUser);
service.get('/update', handleUserUpdate);
service.get('/logout', handleLogout);

// Export the service object to be used in other modules
module.exports = {
  service,
};
