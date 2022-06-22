const express = require('express');
const app = express();
const PORT = 8080;

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

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
