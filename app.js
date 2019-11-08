const express = require('express')

const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('public'));

let kittykount = 0;
let klickpower = 1;
let klickupgradecost = 10;
const port = 4200

app.get('/api/kittykount', (req, res) =>
{
    console.log("in kittykount GET");
    res.send(kittykount.toString());
});

app.get('/api/klickpower', (req, res) =>
{
    console.log("in klickpower GET");
    res.send(klickpower.toString());
});

app.get('/api/klickupgradecost', (req, res) =>
{
    console.log("in klickupgradecost GET");
    res.send(klickupgradecost.toString());
});

app.post('/api/kittykount', (req, res) =>
{
    console.log("in kittykount POST");
    kittykount += req.body.klickpower;
    res.send(kittykount.toString());
});

app.post('/api/doublepower', (req, res) =>
{
    console.log("in doublepower POST");
    kittykount = req.body.kittykount;
    klickpower = req.body.klickpower;
    klickupgradecost = req.body.klickupgradecost;
    res.send(kittykount.toString());
});


app.listen(port, () => console.log('Server listening on port 4200!'));
