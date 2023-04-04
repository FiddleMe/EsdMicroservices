const { auth } = require('express-openid-connect');
const express = require('express');
const { requiresAuth } = require('express-openid-connect');
const cors = require('cors')
const config = {
  authRequired: false,
  auth0Logout: true,
  baseURL: 'http://localhost:3001',
  clientID: '8gHh32NW8sgTiptC4I7gh2xpW7wze8N4',
  issuerBaseURL: 'https://dev-1fqam8raxz3k3fsr.us.auth0.com',
  secret: 'd0cdbcde1ec02a79998b7cdb4b9495ba88a483ddeb60ea1f9f469d703f3ae6f8'
};
const manager = "manager@restaurant.com"

const app = express();
app.use(cors())
const port = 3001
// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));
var email;
// req.isAuthenticated is provided from the auth router
app.get('/', requiresAuth(), (req, res) => {
    email = req.oidc.user.email;
    if (email == manager)
    {
        res.redirect("http://localhost:3000/admin-dashboard")
    }
    res.redirect('http://localhost:3000/menu?email='+email);
    });

app.get('/profile', (req, res) => {
    res.send(JSON.stringify(req.oidc.user));
    });

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
    })

app.get('/islogin', requiresAuth(), (req, res) => {
    res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
    });