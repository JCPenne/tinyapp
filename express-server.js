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

//Message on server start up

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

//Global Vars

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
    password: 'a',
  },
  abc123: {
    id: 'abc123',
  },
};

//Global Functions

const generateRandomString = URL => {
  result = '';

  for (let i = 0; i < 6; i++) {
    result += Math.random().toString(36).slice(-1);
  }

  return result;
};

const userChecker = (key, value) => {
  let resultObj = {
    result: false,
  };

  for (let user in users) {
    let currentKey = users[user][key];

    if (value === currentKey) {
      resultObj = {
        user,
        result: true,
      };
    }
  }
  return resultObj;
};

const URLChecker = (obj, user) => {
  let result = {};

  for (entry in obj) {
    userID = obj[entry].userID;
    if (userID === user) {
      result[entry] = obj[entry];
    }
  }
  return result;
};

//GETS

app.get('/urls', (req, res) => {
  const userID = req.cookies.userID;
  const user = users[userID];
  const UserURLS = URLChecker(URLDatabase, userID);
  if (!userChecker('id', userID).result) {
    res.redirect('/urls/login');
    throw new Error('404 account not found');
  }
  const templateVars = {
    user,
    UserURLS,
  };
  res.render(`urls-index`, templateVars);
});

app.get('/urls/register', (req, res) => {
  const userID = req.cookies.userID;
  const user = users[userID];

  const templateVars = {
    user,
  };
  res.render('urls-register', templateVars);
});

app.get('/urls/login', (req, res) => {
  const userID = req.cookies.userID;
  const user = users[userID];

  const templateVars = {
    user,
  };
  res.render('urls-login', templateVars);
});

app.get('/urls/new', (req, res) => {
  const userID = req.cookies.userID;
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
  const user = users[req.cookies.userID];
  const shortURL = req.params.shortURL;

  if (!userChecker('id', user.id).result) {
    throw new Error('404 please login to your account');
  }

  if (!URLChecker(URLDatabase, user.id).shortURL) {
    throw new Error('That url does not belong to your account');
  }

  const templateVars = {
    user,
    shortURL,
    longURL: URLDatabase[shortURL].longURL,
  };

  res.render(`urls-show`, templateVars);
});

app.get('/u/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = URLDatabase[shortURL].longURL;

  const userID = req.cookies.userID;

  if (!userChecker('id', userID).result) {
    res.redirect(longURL);
    throw new Error('404 user not found');
  }
  res.redirect(longURL);
});

//POSTS

app.post('/urls', (req, res) => {
  const userID = req.cookies.userID;
  const longURL = req.body.longURL;
  const shortURL = generateRandomString(longURL);

  if (!userID) {
    res.redirect('/urls/login');
    throw new Error('401, unauthorized user');
  }

  URLDatabase[shortURL] = { longURL, userID };

  res.redirect(302, `/urls/${shortURL}`);
});

app.post('/register', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const emailCheck = userChecker('email', email).result;

  if (!email || !password) {
    throw new Error(`400 Email and Password fields cannot be empty`);
  }
  if (emailCheck) {
    throw new Error('400 that email is already in use');
  }

  userID = generateRandomString();

  users[userID] = {
    id: userID,
    email,
    password,
  };
  res.cookie('userID', userID);
  res.redirect('/urls');
});

app.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const emailCheck = userChecker('email', email).result;
  const passwordCheck = userChecker('password', password).result;
  const user = userChecker('email', email).user;

  if (!emailCheck) {
    throw new Error('403 email not found');
  }
  if (!passwordCheck) {
    throw new Error('403 password does not match');
  }
  res.cookie('userID', user);
  res.redirect('/urls');
});

app.post('/logout', (req, res) => {
  res.clearCookie('userID');

  res.redirect('/urls');
});

app.post('/urls/:shortURL/delete', (req, res) => {
  const shortURL = req.params.shortURL;

  const user = req.cookies.userID;

  if (!userChecker('id', user).result) {
    throw new Error('404 Please log in to your account');
  }
  if (!URLDatabase[shortURL]) {
    throw new Error('URL not found');
  }
  if (URLDatabase[shortURL].userID !== user) {
    throw new Error('404 that URL does not belong to your account');
  }

  delete URLDatabase[shortURL];

  res.redirect('/urls');
});

app.post('/urls/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  const newLongURL = req.body.URLedit;

  const URLUserID = URLDatabase[shortURL].userID;
  const userID = req.cookies.userID;

  if (!userChecker('id', user).result) {
    throw new Error('404 Please log in to your account');
  }
  if (!URLDatabase.shortURL) {
    throw new Error('URL not found');
  }
  if (URLDatabase[shortURL].userID !== user) {
    throw new Error('404 that URL does not belong to your account');
  }

  URLDatabase[shortURL].longURL = newLongURL;

  res.redirect('/urls');
});
