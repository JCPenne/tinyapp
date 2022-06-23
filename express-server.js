const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 8080;
app.set(`view engine`, `ejs`);
app.use(bodyParser.urlencoded({ extended: true }));

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
app.post('/urls', (req, res) => {
  const longURL = Object.values(req.body).toString();
  const shortURL = generateRandomString(longURL);
  URLDatabase[shortURL] = longURL;
  res.redirect(302, `/urls/${shortURL}`);
});
app.get('/urls', (req, res) => {
  const templateVars = { urls: URLDatabase };
  res.render(`urls-index`, templateVars);
});
app.get('/urls/new', (req, res) => {
  res.render('urls-new');
});
app.get('/urls/:shortURL', (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: URLDatabase[req.params.shortURL] };
  res.render(`urls-show`, templateVars);
});
app.get('/u/:shortURL', (req, res) => {
  const longURL = URLDatabase[req.params.shortURL];
  res.redirect(longURL);
});
app.post('/urls/:shortURL/delete', (req, res) => {
  delete URLDatabase[req.params.shortURL];
  res.redirect('/urls');
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
