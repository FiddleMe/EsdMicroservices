const express = require("express");
const bodyParser = require("body-parser");
const auth = require("./firebase");

const app = express();
app.use(bodyParser.json());

app.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  try {
    const userCredential = await auth.createUserWithEmailAndPassword(
      email,
      password
    );
    const user = userCredential.user;
    res
      .status(201)
      .json({
        message: "User account created",
        data: { uid: user.uid, email: user.email },
      });
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    res.status(400).json({ message: errorMessage });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const userCredential = await auth.signInWithEmailAndPassword(
      email,
      password
    );
    const user = userCredential.user;
    res
      .status(200)
      .json({ message: "Login successful", data: { uid: user.uid, email: user.email } });
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    res.status(401).json({ message: errorMessage });
  }
});

app.post("/logout", (req, res) => {
  auth.signOut()
    .then(() => {
      res.status(200).json({ message: "Logout successful" });
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      res.status(500).json({ message: errorMessage });
    });
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
