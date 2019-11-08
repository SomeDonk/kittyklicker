const express = require('express')

const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('public'));

let kittykount = 0;
const port = 4200

app.get('/api/kittykount', (req, res) =>
{
    console.log("in kittykount GET");
    res.send(kittykount.toString());
});

app.post('/api/kittykount', (req, res) =>
{
    console.log("in kittykount POST");
    kittykount++;
    res.send(kittykount.toString());
});

app.listen(port, () => console.log('Server listening on port 4200!'));
