const express = require("express");
const serveStatic = require("serve-static");
const cors = require("cors")


const app = express();
const port = 3000;

app.use(express.json());
app.use(cors())


app.get("/", (req, res) => {
  res.sendFile("/UI/login.html", { root: __dirname });
});

app.get("/menu", (req, res) => {
  res.sendFile("/UI/menu.html", { root: __dirname });
});


app.get("/shoppingcart", (req, res) => {
  res.sendFile("/UI/shoppingcart.html", { root: __dirname });
})

app.get("/checkout", (req, res) => {
  res.sendFile("/UI/checkout.html", { root: __dirname });
})

app.get("/success", (req, res) => {
  res.sendFile("/UI/success.html", { root: __dirname });
})

app.get("/refund", (req, res) => {
  res.sendFile("/UI/refund.html", { root: __dirname });
})

app.get("/admin-dashboard", (req, res) => {
  res.sendFile("/UI/dashboard.html", { root: __dirname });
})

app.use(serveStatic(__dirname + "/UI"));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
