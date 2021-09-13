const Max = require('max-api');
const path = require('path');

const express = require('express');
const app = express();
const port = 8081;

const ServerDate = require('./ServerDate.js');

Max.addHandler('time', (time) => {
    console.log(`Input: ${time}`);
});

app.get('/hello', (req, res) => {
    res.send('Hello, world!');
})

app.listen(port, () => {
    console.log(`Node version ${process.version}`);
    console.log(`Server listening at http://localhost:${port}`);
})