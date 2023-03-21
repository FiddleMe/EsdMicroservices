// declare a helper function for firebase

const firebase = require('../helper/firebase_helper');

const config = {
    apiKey: "AIzaSyDrZru6I9Sq0HfLlERZcB-FefHUdXffC1U",
    authDomain: "esd-login-signup.firebaseapp.com",
    projectId: "esd-login-signup",
    storageBucket: "esd-login-signup.appspot.com",
    messagingSenderId: "245618021914",
    appId: "1:245618021914:web:8dc1b6bd2202c47db923a3"
};

firebase.initializeApp(config);

class FirebaseService {
  constructor() {
    this.auth = firebase.auth();
    this.firestore = firebase.firestore();
  }
}

module.exports = new FirebaseService();
