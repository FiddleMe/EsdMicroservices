// Import Firebase Functions, Admin SDK, and API modules
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { app: auths } = require('./api/authentication_api.js');
const { service: users } = require('./api/userdetails_api.js');
//const { service: books } = require('../api/books_api.js');

// Firebase Cloud Functions based on Express apps
const auth = functions.https.onRequest(auths);
const user = functions.https.onRequest(users);
//const book = functions.https.onRequest(books);

// Firestore triggers not used to delete
//const onCreateUser = functions.auth.user().onCreate(onCreate);
//const onCreateBook = functions.firestore.document('books/{booksId}').onCreate(onBookArrival);

// Initialize Firebase Admin SDK
admin.initializeApp();

// Create esd-userDetails collection in variable db
const db = admin.firestore().collection('esd-userDetails');

// Create HTTP [POST] request to add user details to db
exports.addUserDetails = functions.https.onRequest(async (request, response) => {
  try {
    const { email, password } = request.body;
    const addNewUser = await db.add({ email, password });
    const newUserDetails = await addNewUser.get();
    response.send(newUserDetails.data());
  } catch (error) {
    console.error(error);
    response.status(500).send(error);
  }
});

// Create HTTP [GET] request to fetch user details from db
exports.getUserDetails = functions.https.onRequest(async (request, response) => {
  try {
    const userDetails = await db.get();
    const users = [];
    userDetails.forEach((doc) => {
      users.push({
        id: doc.id,
        email: doc.data().email,
        password: doc.data().password,
      });
    });
    response.send(users);
  } catch (error) {
    console.error(error);
    response.status(500).send(error);
  }
});

// Export the created Firebase Cloud Functions and Firestore triggers
module.exports = {
  auth,
  user,
  //book,
  //onCreateUser,
  //onCreateBook,
};
