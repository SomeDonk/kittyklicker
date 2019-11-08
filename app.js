const express = require('express')

const bodyParser = require("body-parser");

const app = express();

app.use(express.static('public'));

let kittykount = 0;

app.get('/api/kittykount', (req, res) => {
  res.send(kittykount);
});

app.post('/api/kittykount', (req, res) => {
  kittykount++;
});