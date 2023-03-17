// home.js
// Imports the getUserDetails function from the userdetails.js file
//import { getUserDetails } from './userdetails.js';

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        // User is signed in
        const email = user.email;
        console.log(email);

        // Get the email span element
        const emailSpan = document.getElementById('email');
        // checks for changes in user authentication status
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                // User is signed in, sets the email span's text to the user's email
                emailSpan.textContent = user.email;
            }
        });

        // Get the user's email and photo URL
        getUserDetails().then((user) => {
            // Update the user's email address in the DOM
                const emailSpan = document.getElementById('email');
                emailSpan.textContent = user.email;

                // Update the user's profile picture in the DOM
                const profileImg = document.getElementById('profile_image');
                profileImg.src = user.photoURL;
            });

        } else {
        // No user is signed in
        console.log("No user is signed in.");
        // Redirect the user to the login page
        window.location.href = "login.html";
        }
    });
  
    document.addEventListener('DOMContentLoaded', () => {
        const logoutButton = document.getElementById('logout');
        logoutButton.addEventListener('click', (e) => {
          e.preventDefault();
          firebase.auth().signOut().then(() => {
            console.log("User signed out.");
            // Redirect the user to the login page
            window.location.href = "login.html";
          }).catch((error) => {
            console.log(error.message);
          });
        });
      });