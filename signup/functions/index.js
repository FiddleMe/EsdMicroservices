// imports Firebase Functions and Admin SDK modules
const functions = require('firebase-functions');
const admin = require('firebase-admin');

//initialize FIrebase Admin SDK
admin.initializeApp();

//create esd-userDetails collection in variable db
const db = admin.firestore().collection('esd-userDetails');

// create HTTP [POST] request to add user details to db
exports.addUserDetails = functions.https.onRequest(async (
  /*http request object*/ request,
  /* http response object*/ response
) => {
  try {
    //store request body object values
    const { email, password } = request.body;
    //add new user details to db
    const addNewUser = await db.add({ email, password });
    //get newly added user from db
    const newUserDetails = await addNewUser.get();
    //terminate request with new user added to db
    response.send(newUserDetails.data());
  } catch (error) {
    //log error
    console.error(error);
    //terminate request if an error occurs
    response.status(500).send(error);
  }
});

// create HTTP [GET] request to fetch user details from db
exports.getUserDetails = functions.https.onRequest(async (
  /*http request object*/ request,
  /* http response object*/ response
) => {
  try {
    //get all user details from db
    const userDetails = await db.get();
    // new array created to storae all user details
    const users = [];
    //iterate and extract email and password values and add to array
    userDetails.forEach((doc) => {
      users.push({
        id: doc.id,
        email: doc.data().email,
        password: doc.data().password
      });
    });
    //terminate request with user details from db
    response.send(users);
  } catch (error) {
    //log error
    console.error(error);
    //terminate request if an error occurs
    response.status(500).send(error);
  }
});

