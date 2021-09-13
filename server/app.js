// this code runs on a remote server
// separate code runs inside node for max
// syncs with this code using ServerDate
// and updates the server via /set

const express = require('express');
const app = express();
const port = 8080;

let transport = {};

app.use(express.json());
app.disable('x-powered-by');

app.use(express.static('public'));

app.get('/time', (req, res) => {
    res.append('X-Date', Date.now());
    res.send();
})

app.get('/transport', (req, res) => {
    res.send(transport);
})

// this endpoint should be restricted somehow
app.post('/transport', (req, res) => {
    transport = req.body;
    res.send();
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
})