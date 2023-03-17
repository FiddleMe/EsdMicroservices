const express = require('express');
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert('./serviceAccountKey.json'),
  databaseURL: 'https://esd--user-login-signup.firebaseio.com'
});

const app = express();
const port = process.env.PORT || 3000;

app.get('/users/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    const user = await admin.auth().getUser(uid);
    res.json(user.toJSON());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
