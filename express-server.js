//Initial Server set up

const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const morgan = require('morgan');
const bcrypt = require('bcryptjs');
const methodOverride = require('method-override');

const app = express();
const PORT = 8080;

//Function imports

const { generateRandomString, userChecker, URLChecker } = require('./helpers');
const { users, URLDatabase } = require('./data');

//Initiate middleware

app.set(`view engine`, `ejs`);
app.use(morgan('tiny'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cookieSession({
    name: 'session',
    keys: ['key1', 'key2'],

    // Cookie Options
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  }),
);
app.use(methodOverride('_method'));

//GETS

app.get('/', (req, res) => {
  const userID = req.session.userID;

  if (!userChecker(users, 'id', userID).result && Object.keys(users).length === 1) {
    res.redirect('/home');
  }

  if (userChecker(users, 'id', userID).result) {
    res.redirect('/urls');
  }
});

app.get('/home', (req, res) => {
  const userID = req.session.userID;
  const user = users[userID];
  const templateVars = {
    user,
  };
  res.render('home', templateVars);
});

app.get('/urls', (req, res) => {
  const userID = req.session.userID;
  const user = users[userID];
  const UserURLS = URLChecker(URLDatabase, userID);

  const templateVars = {
    user,
    UserURLS,
  };

  if (!userChecker(users, 'id', userID).result && Object.keys(users).length === 1) {
    res.redirect('/home');
  }

  res.render(`urls-index`, templateVars);
});

app.get('/urls/register', (req, res) => {
  const userID = req.session.userID;
  const user = users[userID];

  const templateVars = {
    user,
  };

  res.render('urls-register', templateVars);
});

app.get('/urls/login', (req, res) => {
  const userID = req.session.userID;
  const user = users[userID];

  const templateVars = {
    user,
  };
  res.render('urls-login', templateVars);
});

app.get('/urls/new', (req, res) => {
  const userID = req.session.userID;
  const user = users[userID];

  if (!userID) {
    res.redirect('/urls/login');
  }

  const templateVars = {
    user,
  };

  res.render('urls-new', templateVars);
});

app.get('/urls/:shortURL', (req, res) => {
  const userID = req.session.userID;
  const user = users[userID];
  const shortURL = req.params.shortURL;

  if (!userChecker(users, 'id', userID).result) {
    res.send('404 please login to your account');
  }

  if (!URLChecker(URLDatabase, userID)[shortURL]) {
    res.send('That url does not belong to your account');
  }

  const templateVars = {
    user,
    shortURL,
    longURL: URLDatabase[shortURL].longURL,
  };

  res.render(`urls-show`, templateVars);
});

app.get('/u/:shortURL', (req, res) => {
  const userID = req.session.userID;
  const shortURL = req.params.shortURL;
  const longURL = URLDatabase[shortURL].longURL;

  if (!userChecker(users, 'id', userID).result) {
    res.redirect(longURL);
    res.send('404 user not found');
  }

  res.redirect(longURL);
});

//POSTS

app.post('/urls', (req, res) => {
  const userID = req.session.userID;
  const longURL = req.body.longURL;
  const shortURL = generateRandomString(longURL);

  if (!userID) {
    res.redirect('/urls/login');
    res.send('401, unauthorized user');
  }

  URLDatabase[shortURL] = { longURL, userID };

  res.redirect(302, `/urls/${shortURL}`);
});

app.post('/register', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const emailCheck = userChecker(users, 'email', email).result;

  if (!email || !password) {
    res.send(`400 Email and Password fields cannot be empty`);
  }
  if (emailCheck) {
    res.send('400 that email is already in use');
  }

  userID = generateRandomString();

  users[userID] = {
    id: userID,
    email,
    hashedPassword,
  };

  req.session.userID = userID;

  res.redirect('/urls');
});

app.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const emailCheck = userChecker(users, 'email', email).result;
  const userID = userChecker(users, 'email', email).user;
  const hashedPassword = users[userID].hashedPassword;
  const passwordCheck = bcrypt.compareSync(password, hashedPassword);

  if (!emailCheck) {
    res.send('403 email not found');
  }
  if (!passwordCheck) {
    res.send('403 password does not match');
  }

  req.session.userID = userID;

  res.redirect('/urls');
});

app.post('/logout', (req, res) => {
  req.session = null;

  res.redirect('/urls');
});

app.delete('/urls/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  const userID = req.session.userID;

  if (!userChecker(users, 'id', userID).result) {
    res.send('404 Please log in to your account');
  }
  if (!URLDatabase[shortURL]) {
    res.send('URL not found');
  }
  if (URLDatabase[shortURL].userID !== userID) {
    res.send('404 that URL does not belong to your account');
  }

  delete URLDatabase[shortURL];

  res.redirect('/urls');
});

app.put('/urls/:shortURL', (req, res) => {
  const userID = req.session.userID;
  const shortURL = req.params.shortURL;
  const newLongURL = req.body.URLedit;

  if (!userChecker(users, 'id', userID).result) {
    res.send('404 Please log in to your account');
  }
  if (!URLDatabase[shortURL]) {
    res.send('404 URL not found');
  }
  if (URLDatabase[shortURL].userID !== userID) {
    res.send('404 that URL does not belong to your account');
  }

  URLDatabase[shortURL].longURL = newLongURL;

  res.redirect('/urls');
});

//Message on server start up to confirm clean start up

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
