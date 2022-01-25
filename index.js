const express = require('express');
const session = require('express-session');
const multer = require('multer');
const userQueries = require('./queries/userQueries');
const mw = require('./tools/middleware.js');

const env = require('process').env;
require('dotenv').config();

const mongoose = require('mongoose');
const uri = `mongodb://${env.DB_IP}:${env.DB_PORT}/${env.DB_NAME}`;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).catch((err) => console.error(err));

const app = express();

const upload = multer();
app.use(upload.none());

app.set('view engine', 'ejs');
app.use('/static', express.static('static'));


app.use(session({
  secret: env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {maxAge: 1000*60*5},
}));


app.get('/', function(req, res) {
  res.render('main_page', {session: req.session});
});

app.get('/login', mw.loggedOut, function(req, res) {
  res.render('login', {session: req.session, err: false});
});

app.post('/login', mw.loggedOut, async function(req, res) {
  const username = req.body.username;
  const password = req.body.password;

  const [success, user] = await userQueries.authenticateUser(username, password);

  if (success) {
    req.session.logged = true;
    req.session.username = username;
    req.session.is_admin = user.is_admin;

    res.redirect('/');
  } else {
    res.render('login', {session: req.session, err: 'Invalid login or password'});
  }
});

app.get('/register', mw.loggedOut, function(req, res) {
  if (session.logged) {
    res.redirect('/');
  } else {
    res.render('register', {session: req.session, err: false});
  }
});

app.post('/register', mw.loggedOut, async function(req, res) {
  const username = req.body.username;
  const password = req.body.password;

  const [success, msg] = await userQueries.registerUser(username, password);

  if (success) {
    res.redirect('/login');
  } else {
    res.render('register', {session: req.session, err: msg});
  }
});

app.get('/logout', mw.loggedIn, function(req, res) {
  req.session.destroy();
  res.redirect('/');
});


app.listen(env.APP_PORT, function() {
  console.log('App running');
});
