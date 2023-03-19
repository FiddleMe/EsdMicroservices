const functions = require("firebase-functions");

exports.myFunction = functions.https.onRequest((req, res) => {
  res.send("Hello World!");
});

// // Create and deploy your first functions
// // https://firebase.google.com/docs/functions/get-started
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
