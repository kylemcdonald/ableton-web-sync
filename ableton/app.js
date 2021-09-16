const Max = require('max-api');
const path = require('path');

const io = require('socket.io-client')
const socket = io('ws://localhost:8080/');

let now = new Date().getTime();

let networkDelays = [];
let networkDelay = 0.0;
let localTimeDiff = 0.0;

setInterval(() => {
    socket.emit('time/req', { sent: new Date().getTime() });
}, 500);

socket.on('time/res', (data) => {
    const now = new Date().getTime();
    networkDelays.push(now - data.sent);
    if(16 < networkDelays.length) networkDelays = networkDelays.slice(1);
    networkDelay = networkDelays.reduce((x, y) => x + y, 0.0) / networkDelays.length;
    networkDelay /= 2; // convert round-trip to one-way
    localTimeDiff = data.serverTime - now;
});

// there is around +/- 5 ms of jitter in triggering this handler,
// to get higher accuracy, it may be possible to look at the
// earliest (smallest) offset over 10 or so calls
Max.addHandler('transport', (bars, beats, units, resolution, tempo, signatureTop, signatureBottom, state, ticks) => {
    const now = new Date().getTime() + localTimeDiff + networkDelay;
    const time = 1000. * 60. / (tempo * resolution) * ticks;
    const offset = time - now;
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
