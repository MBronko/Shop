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

function isAdmin(req, res, next) {
  if (req.session.is_admin) {
    return next();
  }
  res.redirect('/');
}

module.exports = {loggedIn, loggedOut, isAdmin};
