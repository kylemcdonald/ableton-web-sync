const Max = require('max-api');
const path = require('path');

const ServerDate = require('./ServerDate.js');
const timeServer = 'http://localhost:8080/transport';
const io = require('socket.io-client')
const socket = io('ws://localhost:8080/');

// there is around +/- 5 ms of jitter in triggering this handler,
// to get higher accuracy, it may be possible to look at the
// earliest (smallest) offset over 10 or so calls

let now = ServerDate.now();

let diffs = [];
let diff = 0.0;

setInterval(() => {
    socket.emit('time/req', { sent: new Date().getTime() });
}, 500);

socket.on('time/res', (data) => {
    diffs.push((new Date().getTime() - data.sent) * 0.5);
    if(16 < diffs.length) diffs = diffs.slice(1);
    diff = -diffs.reduce((x, y) => x + y, 0.0) / diffs.length;
});

Max.addHandler('transport', (bars, beats, units, resolution, tempo, signatureTop, signatureBottom, state, ticks) => {
    const time = 1000. * 60. / (tempo * resolution) * ticks;
    const offset = time - (new Date().getTime() + diff);
    const body = {
        bars: bars,
        beats: beats,
        units: units,
        resolution: resolution,
        tempo: tempo,
        signatureTop: signatureTop,
        signatureBottom: signatureBottom,
        state: state,
        ticks: ticks,
        time: time,
        offset: offset
    };
    socket.emit('transport', body);
});
