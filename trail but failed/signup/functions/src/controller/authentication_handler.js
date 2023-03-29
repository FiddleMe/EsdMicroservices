// Import required modules and dependencies
const { Request, Response } = require("express");
//const serviceRequest = require("request-promise");
const AuthService = require("../helper/authentication_helper.js");
const { httpURL: http } = require("../keys");

// Initialize the AuthService
const auth = new AuthService();

// Handle async login
exports.handleAsyncLogin = async function (request, response) {
  try {
    const { email, password } = request.body;
    const login = await auth.login(email, password);
    //const books = await innerLogin(`${http}/book/login`, { email, password });
    const user = await innerLogin(`${http}/user/login`, { email, password });
    response.send({ login, user });
  } catch (error) {
    console.error(error);
    response.status(500).send(error);
  }
};

// Handle login
exports.handleLogin = async function (request, response) {
  try {
    const { email, password } = request.body;
    const loggedIn = await auth.login(email, password);
    response.send(loggedIn);
  } catch (error) {
    console.error(error);
    response.status(500).send(error);
  }
};

// Handle async logout
exports.handleAsyncLogout = async function (request, response) {
  try {
    const nodes = await auth.logout();
    //const books = await innerLogout(`${http}/book/logout`);
    const user = await innerLogout(`${http}/user/logout`);
    response.send({ nodes, user });
  } catch (error) {
    console.error(error);
    response.status(500).send({ error });
  }
};

// Handle logout
exports.handleLogout = async function (request, response) {
  try {
    const nodes = await auth.logout();
    response.send(nodes);
  } catch (error) {
    console.error(error);
    response.status(500).send({ error });
  }
};

// Handle sign up
exports.handleSignUp = async function (request, response) {
  try {
    const { email, password } = request.body;
    const loggedIn = await auth.signUp(email, password);
    response.send(loggedIn);
  } catch (error) {
    console.error(error);
    response.status(500).send({ error });
  }
};

// Get current user
exports.currentUser = async function (request, response) {
  try {
    const user = await auth.currentUser();
    response.send({ user });
  } catch (error) {
    console.error(error);
    response.status(500).send({ error });
  }
};

// Handle user update
async function handleUserUpdate(request, response) {
    try {
      const update = request.body;
      const user = await auth.updateUser(update);
      response.send({ user });
    } catch (error) {
      console.error(error);
      response.status(500).send({ error });
    }
  }
  
  // Inner login function
  async function innerLogin(uri, body) {
    try {
      const request = await serviceRequest({
        method: "POST",
        uri,
        body,
        json: true
      });
      return Promise.resolve(request);
    } catch (error) {
      return Promise.reject(error);
    }
  }
  
  // Inner logout function
  /*async function innerLogout(uri){
    try {
      const books = await serviceRequest({
        uri,
        json: true
      });
      return Promise.resolve(books)
    } catch (error) {
      return Promise.reject(error)
    }
  }*/