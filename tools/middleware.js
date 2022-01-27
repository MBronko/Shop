const User = require('../models/userSchema');

function loggedIn(req, res, next) {
  if (req.session.logged) {
    return next();
  }
  res.redirect('/');
}

function loggedOut(req, res, next) {
  if (!req.session.logged) {
    return next();
  }
  res.redirect('/');
}

async function isAdmin(req, res, next) {
  if (req.session.logged) {
    const user = await User.findOne({_id: req.session.userId});
    if (user && user.isAdmin) {
      return next();
    }
  }
  res.redirect('/');
}

module.exports = {loggedIn, loggedOut, isAdmin};
