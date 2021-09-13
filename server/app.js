// this code runs on a remote server
// separate code runs inside node for max
// syncs with this code using ServerDate
// and updates the server via /set

const express = require('express');
const app = express();
const port = 8080;

let playbackOffset = 0;
let playbackStatus = 0;

app.use(express.urlencoded({ extended: true }));
app.disable('x-powered-by');

app.use(express.static('public'));

app.get('/time', (req, res) => {
    res.append('X-Date', Date.now());
    res.append('Playback-Offset', playbackOffset);
    res.append('Playback-Status', playbackStatus);
    res.send();
})

app.post('/set', (req, res) => {
    playbackOffset = req.body.playbackOffset;
    playbackStatus = req.body.playbackStatus;
    res.send();
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
})