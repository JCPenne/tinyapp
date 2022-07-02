const bcrypt = require('bcryptjs');

const URLDatabase = {
  '2bxVn2': {
    longURL: 'http://www.lighthouselabs.ca',
    userID: '123abc',
  },
  '9sm5xK': {
    longURL: 'http://www.google.com',
    userID: '',
  },
};

const users = {
  '123abc': {
    id: '123abc',
    email: 'a@a.com',
    password: 'abc',
    hashedPassword: '',
  },
};

module.exports = { users, URLDatabase };
