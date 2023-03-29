const admin = require('firebase-admin');
const serviceAccount = require('./Private_key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;
