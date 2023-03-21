// Import required modules
const express = require('express');
const cors = require('cors');

// Import authentication handlers from the authentication.handler module
const {
  handleSignUp,
  handleAsyncLogin,
  handleAsyncLogout,
} = require('../controllers/authentication_handler.js');

// Create an Express application
const app = express();

// Usually, you'd want to whitelist endpoints that can access this API.
// For the sake of this project, we'd leave it open by using CORS middleware.
app.use(cors());

// Set up the routes for the authentication endpoints
// Signup route
app.post('/signup', handleSignUp);
// Login route
app.post('/login', handleAsyncLogin);
// Logout route
app.get('/logout', handleAsyncLogout);

// Export the app object to be used in other modules
module.exports = {
  app,
};
