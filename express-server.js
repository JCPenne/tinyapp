const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const app = express();
const PORT = 8080;
app.set(`view engine`, `ejs`);

const URLDatabase = {
  '2bxVn2': 'http://www.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.com',
};
const generateRandomString = URL => {
  result = '';
  for (let i = 0; i < 6; i++) {
    result += Math.random().toString(36).slice(-1);
  }
  return result;
};

// app.get('/', (req, res) => {
//   res.send(`Hello!`);
// });
// app.get('/urls.json', (req, res) => {
//   res.json(URLDatabase);
// });
// app.get('/Hello', (req, res) => {
//   res.send(`
//     <html>
//       <body>
//         Hello <b>World</b>
//       </body>
//       </html>
//     \n`);
// });
app.use(cookieParser());
app.use(morgan('tiny'));
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/urls', (req, res) => {
  const longURL = Object.values(req.body).toString();
  const shortURL = generateRandomString(longURL);
  URLDatabase[shortURL] = longURL;
  res.redirect(302, `/urls/${shortURL}`);
});
app.get('/urls', (req, res) => {
  const templateVars = {
    username: req.cookies['username'],
    urls: URLDatabase,
  };
  res.render(`urls-index`, templateVars);
});
app.get('/urls/new', (req, res) => {
  const templateVars = {
    username: req.cookies['username'],
  };
  res.render('urls-new', templateVars);
});
app.get('/urls/:shortURL', (req, res) => {
  const templateVars = {
    username: req.cookies['username'],
    shortURL: req.params.shortURL,
    longURL: URLDatabase[req.params.shortURL],
  };
  res.render(`urls-show`, templateVars);
});
app.get('/u/:shortURL', (req, res) => {
  const longURL = URLDatabase[req.params.shortURL];
  res.redirect(longURL);
});
app.post('/urls/:shortURL', (req, res) => {
  const newLongURL = Object.values(req.body);
  URLDatabase[req.params.shortURL] = newLongURL;
  res.redirect('/urls');
});
app.post('/urls/:shortURL/delete', (req, res) => {
  delete URLDatabase[req.params.shortURL];
  res.redirect('/urls');
});
app.post('/login', (req, res) => {
  res.cookie('username', req.body['username']);
  res.redirect('/urls');
  console.log(req.cookies);
  console.log(req.body);
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
