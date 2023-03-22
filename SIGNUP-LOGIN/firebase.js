const { initializeApp } = require("firebase/app");
const { getAuth } = require("firebase/auth");

const firebaseConfig = {
    apiKey: "AIzaSyB7rDn1qvBFYyVuw_Pi-1v3l8m8PD2LcZo",
    authDomain: "esd-signup-login.firebaseapp.com",
    projectId: "esd-signup-login",
    storageBucket: "esd-signup-login.appspot.com",
    messagingSenderId: "722843795622",
    appId: "1:722843795622:web:47277a9417211e9d1ab467",
    measurementId: "G-285QJG0C38"
};

initializeApp(firebaseConfig);

const auth = getAuth();

module.exports = auth;
