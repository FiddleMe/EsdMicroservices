// login.js
//firebase.initializeApp(firebaseConfig);
const loginForm = document.getElementById('login');

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Get user info
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  // Sign in the user
  firebase.auth().signInWithEmailAndPassword(email, password).then((cred) => {
    console.log(cred.user);
    // Redirect the user to the home page or any other page
    window.location.href = "home.html";
  }).catch((error) => {
    console.log(error.message);
    const loginError = document.querySelector('.error');
    loginError.textContent = error.message;
  });
});
