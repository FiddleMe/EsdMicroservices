// signup.js

const signupForm = document.getElementById('signup');

signupForm.addEventListener('click', (e) => {
  e.preventDefault();

  // Get user info
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('Cpassword').value;

  // Check if password and confirm password match
  if (password !== confirmPassword) {
    const error = document.querySelector('.error');
    error.textContent = "Passwords do not match!";
    return;
  }

  // Sign up the user
  firebase.auth().createUserWithEmailAndPassword(email, password).then((cred) => {
    console.log(cred.user);
    // Redirect the user to the home page or any other page
    window.location.href = "home.html";
  }).catch((error) => {
    console.log(error.message);
  });
});
