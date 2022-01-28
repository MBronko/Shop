const express = require('express');
const session = require('express-session');
const multer = require('multer');
const userQueries = require('./queries/userQueries');
const itemRouter = require('./routers/itemRouter');
const User = require('./models/userSchema');
const Item = require('./models/itemSchema');
// const Order = require('./models/ordersSchema');
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

app.set('view engine', 'ejs');
app.use('/static', express.static('static'));


app.use(session({
  secret: env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {maxAge: 1000*60*5},
}));


app.get('/', async function(req, res) {
  const items = await Item.find();

  res.render('main_page', {session: req.session, items: items});
});

app.get('/login', mw.loggedOut, function(req, res) {
  res.render('login', {session: req.session, err: false});
});

app.post('/login', mw.loggedOut, upload.none(), async function(req, res) {
  const username = req.body.username;
  const password = req.body.password;

  const [success, user] = await userQueries.authenticateUser(username, password);

  if (success) {
    req.session.logged = true;
    req.session.username = username;
    req.session.userId = user._id;
    req.session.isAdmin = user.isAdmin;

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

app.post('/register', mw.loggedOut, upload.none(), async function(req, res) {
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

app.get('/cart', mw.loggedIn, function(req, res) {
  res.render('cart', {session: req.session}); // TODO
});

app.post('/cart', mw.loggedIn, upload.none(), function(req, res) {
  res.render('cart', {session: req.session}); // TODO
});

app.get('/admin', mw.isAdmin, async function(req, res) {
  const users = await User.find();
  const orders = []; // TODO after creating order schema

  console.log(users);

  res.render('admin_page', {session: req.session, users: users, orders: orders});
});

app.use('/item', itemRouter);

app.listen(env.APP_PORT, function() {
  console.log('App running');
});
