const User = require('../models/userSchema');
const userTools = require('../tools/userTools');
const authTools = require('../tools/authTools');

async function authenticateUser(username, password) {
  return [true, '']; // todo
}

async function registerUser(username, password) {
  if (!userTools.validateUsername(username)) {
    return [false, 'Username contains forbidden characters'];
  }

  if (!userTools.validatePassword(username)) {
    return [false, 'Password doesnt meet requirements'];
  }

  const user = new User({username: username, password: password, salt: authTools.randomSalt()});

  try {
    await user.save();
  } catch (error) {
    return [false, error.errors['username'].message];
  }

  return [true, ''];
}

module.exports = {authenticateUser, registerUser};
