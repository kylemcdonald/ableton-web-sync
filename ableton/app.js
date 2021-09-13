const Max = require('max-api');
const path = require('path');

const fetch = require('node-fetch');

const ServerDate = require('./ServerDate.js');
const timeServer = 'http://localhost:8080/transport';

// there is around +/- 5 ms of jitter in triggering this handler,
// to get higher accuracy, it may be possible to look at the
// earliest (smallest) offset over 10 or so calls
Max.addHandler('transport', (bars, beats, units, resolution, tempo, signatureTop, signatureBottom, state, ticks) => {
    const now = ServerDate.now()
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
    fetch(timeServer, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' }
    }).catch(err => console.error(err));
});