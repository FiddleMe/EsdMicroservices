// logout.js

const logoutButton = document.getElementById('logout');

logoutButton.addEventListener('click', (e) => {
  e.preventDefault();

  firebase.auth().signOut().then(() => {
    console.log('User signed out successfully');
    // Redirect the user to the login page or any other page
    window.location.href = "login.html";
  }).catch((error) => {
    console.log(error.message);
  });
});
