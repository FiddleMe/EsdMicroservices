const express = require("express");
const serveStatic = require("serve-static");


const app = express();
const port = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile("/UI/shop.html", { root: __dirname });
});

app.use(serveStatic(__dirname + "/UI"));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
