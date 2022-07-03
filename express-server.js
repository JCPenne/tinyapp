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
    res.redirect('/register');
  }

  if (!userChecker(users, 'id', userID).result) {
    res.redirect('/login');
  }
  res.render(`urls-index`, templateVars);
});

app.get('/register', (req, res) => {
  const userID = req.session.userID;
  const user = users[userID];

  const templateVars = {
    user,
  };

  res.render('urls-register', templateVars);
});

app.get('/login', (req, res) => {
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
    res.redirect('/login');
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
    const templateVars = {
      user: '',
      error: 401,
      message: 'Please log in to your account',
    };
    return res.render('error', templateVars);
  }

  if (!URLDatabase[shortURL]) {
    const templateVars = {
      user: '',
      error: 404,
      message: 'URL not found',
    };
    return res.render('error', templateVars);
  }

  if (!URLChecker(URLDatabase, userID)[shortURL]) {
    const templateVars = {
      user: '',
      error: 403,
      message: 'That url does not belong to your account',
    };
    return res.render('error', templateVars);
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
    const templateVars = {
      user: '',
      error: 401,
      message: 'Please log in to your account',
    };
    return res.render('error', templateVars);
  }

  res.redirect(longURL);
});

//POSTS

app.post('/urls', (req, res) => {
  const userID = req.session.userID;
  const longURL = req.body.longURL;
  const shortURL = generateRandomString(longURL);

  if (!userID) {
    res.redirect('/login');
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
    const templateVars = {
      user: '',
      error: 400,
      message: 'Email and Password fields cannot be empty',
    };
    return res.render('error', templateVars);
  }
  if (emailCheck) {
    const templateVars = {
      user: '',
      error: 400,
      message: 'That email is already in use!',
    };
    return res.render('error', templateVars);
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
    const templateVars = {
      user: '',
      error: 404,
      message: 'Email not found',
    };
    return res.render('error', templateVars);
  }
  if (!passwordCheck) {
    const templateVars = {
      user: '',
      error: 400,
      message: 'Password does not match',
    };
    return res.render('error', templateVars);
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
    const templateVars = {
      user: '',
      error: 403,
      message: 'Please log in to your account first!',
    };
    return res.render('error', templateVars);
  }
  if (!URLDatabase[shortURL]) {
    const templateVars = {
      user: '',
      error: 404,
      message: 'URL not found',
    };
    return res.render('error', templateVars);
  }
  if (URLDatabase[shortURL].userID !== userID) {
    const templateVars = {
      user: '',
      error: 403,
      message: 'That URL does not belong to your account!',
    };
    return res.render('error', templateVars);
  }

  delete URLDatabase[shortURL];

  res.redirect('/urls');
});

app.put('/urls/:shortURL', (req, res) => {
  const userID = req.session.userID;
  const shortURL = req.params.shortURL;
  const newLongURL = req.body.URLedit;

  if (!userChecker(users, 'id', userID).result) {
    const templateVars = {
      user: '',
      error: 403,
      message: 'Please log in to your account first!',
    };
    return res.render('error', templateVars);
  }
  if (!URLDatabase[shortURL]) {
    const templateVars = {
      user: '',
      error: 404,
      message: 'URL not found',
    };
    return res.render('error', templateVars);
  }
  if (URLDatabase[shortURL].userID !== userID) {
    const templateVars = {
      user: '',
      error: 403,
      message: 'That URL does not belong to your account!',
    };
    return res.render('error', templateVars);
  }

  URLDatabase[shortURL].longURL = newLongURL;

  res.redirect('/urls');
});

//Message on server start up to confirm clean start up

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
