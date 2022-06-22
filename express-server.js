const express = require('express');
const app = express();
const PORT = 8080;
app.set(`view engine`, `ejs`);

const URLDatabase = {
  '2bxVn2': 'http://www.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.com',
};

app.get('/', (req, res) => {
  res.send(`Hello!`);
});
app.get('/urls.json', (req, res) => {
  res.json(URLDatabase);
});
app.get('/Hello', (req, res) => {
  res.send(`
    <html>
      <body>
        Hello <b>World</b>
      </body>
      </html>
    \n`);
});
app.get('/urls', (req, res) => {
  const templateVars = { urls: URLDatabase };
  res.render(`urls-index`, templateVars);
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});