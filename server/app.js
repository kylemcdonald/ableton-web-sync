// this code runs on a remote server
// separate code runs inside node for max
// syncs with this code using ServerDate
// and updates the server via /set

const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);
const port = 8080;

let transport = {};

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('websocket connection');
    socket.on('transport', (data) => {
        const stateChange = transport.state != data.state;
        transport = data;
        if (stateChange) {
            io.emit('transport', { transport });
        }
    });
    socket.on('time/req', ({ sent }) => {
        socket.emit('time/res', {
            sent,
            serverTime: new Date().getTime()
        });
    });
    socket.on('get', ({ sent }) => {
        socket.emit('transport', {
            transport,
            sent,
            serverTime: new Date().getTime()
        });
    });
});

server.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
