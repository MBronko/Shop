const User = require('../models/userSchema');
const userTools = require('../tools/userTools');

async function authenticateUser(username, password) {
  const user = await User.findOne({username: username});

  if (!user) {
    return [false, null];
  }

  return [await user.authenticatePassword(password), user];
}

async function registerUser(username, password) {
  if (!userTools.validateUsername(username)) {
    return [false, 'Username contains forbidden characters'];
  }

  if (!userTools.validatePassword(password)) {
    return [false, 'Password doesnt meet requirements'];
  }

  const user = new User();

  user.username = username;
  await user.setPassword(password);

  try {
    await user.save();
  } catch (error) {
    return [false, error.errors['username'].message];
  }

  return [true, ''];
}

module.exports = {authenticateUser, registerUser};
