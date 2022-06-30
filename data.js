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
//testPassword for encrypt assignment use only

const user123abchashedPassword = bcrypt.hashSync('abc', 10);

const users = {
  '123abc': {
    id: '123abc',
    email: 'a@a.com',
    password: 'abc',
    hashedPassword: user123abchashedPassword,
  },
  abc123: {
    id: 'abc123',
  },
};

module.exports = { users, URLDatabase };
