//Server set up

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const app = express();
const PORT = 8080;

app.set(`view engine`, `ejs`);
app.use(cookieParser());
app.use(morgan('tiny'));
app.use(bodyParser.urlencoded({ extended: true }));

//Global Vars

const generateRandomString = URL => {
  result = '';

  for (let i = 0; i < 6; i++) {
    result += Math.random().toString(36).slice(-1);
  }

  return result;
};

const URLDatabase = {
  '2bxVn2': 'http://www.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.com',
};

const users = {
  userRandomID: {
    id: 'userRandom ID',
    email: 'user@example.com',
    password: 'testpassword',
  },
};

//Global Functions

const emailChecker = emailPara => {
  let result = false;
  for (let user in users) {
    let currentEmail = users[user].email;
    if (emailPara === currentEmail) {
      result = true;
    }
  }
  return result;
};

//Message on server start up

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

//GETS

app.get('/urls', (req, res) => {
  const userID = req.cookies.userID;
  const user = users[userID];

  const templateVars = {
    user,
    urls: URLDatabase,
  };
  res.render(`urls-index`, templateVars);
});

app.get('/urls/new', (req, res) => {
  const userID = req.cookies.userID;
  const user = users[userID];

  const templateVars = {
    user,
  };
  res.render('urls-new', templateVars);
});

app.get('/urls/register', (req, res) => {
  const userID = req.cookies.userID;
  const user = users[userID];

  const templateVars = {
    user,
  };
  res.render('urls-register', templateVars);
});

app.get('/urls/:shortURL', (req, res) => {
  const userID = req.cookies.userID;
  const user = users[userID];

  const templateVars = {
    user,
    shortURL: req.params.shortURL,
    longURL: URLDatabase[req.params.shortURL],
  };
  res.render(`urls-show`, templateVars);
});

app.get('/u/:shortURL', (req, res) => {
  const longURL = URLDatabase[req.params.shortURL];
  res.redirect(longURL);
});

//POSTS

app.post('/urls', (req, res) => {
  const longURL = Object.values(req.body).toString();
  const shortURL = generateRandomString(longURL);

  URLDatabase[shortURL] = longURL;
  res.redirect(302, `/urls/${shortURL}`);
});

app.post('/register', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    throw new Error(`400 Email and Password fields cannot be empty`);
  }
  if (emailChecker(email)) {
    throw new Error('400 that email is already in use');
  }

  userID = generateRandomString();
  users[userID] = {
    id: userID,
    email: req.body.email,
    password: req.body.password,
  };
  res.cookie('userID', userID);
  res.redirect('/urls');
});

app.post('/login', (req, res) => {
  res.cookie('userID', req.body[userID]);
  res.redirect('/urls');
});

app.post('/logout', (req, res) => {
  res.clearCookie('userID');
  res.redirect('/urls');
});

app.post('/urls/:shortURL/delete', (req, res) => {
  delete URLDatabase[req.params.shortURL];
  res.redirect('/urls');
});

app.post('/urls/:shortURL', (req, res) => {
  const newLongURL = Object.values(req.body);
  URLDatabase[req.params.shortURL] = newLongURL;
  res.redirect('/urls');
});
