// how many milliseconds between syncing
const resyncPeriod = 1000;

// how many network delay samples to collect
const delaySamples = 16;

// how long between the initial samples in milliseconds
const initialSamplePeriod = 100;

let transport;
let networkDelay = 0.0;
let localTimeDiff = 0.0;

function milliseconds() {
    return performance.now();
}

function startWebSync() {
    const socket = io();
    let networkDelays = [];
    socket.on('transport', (data) => {
        // console.log('received transport', data.transport.state);

        if (data.sent) {
            const now = milliseconds();
            const diff = now - data.sent;
            networkDelays.push(diff);
            // console.log('network delay sample: ' + diff);
            if (delaySamples < networkDelays.length) networkDelays = networkDelays.slice(1);
            networkDelay = networkDelays.reduce((x, y) => x + y, 0.0) / networkDelays.length;
            networkDelay /= 2; // convert round-trip to one-way
            localTimeDiff = data.serverTime - now
        }

        transport = data.transport;
    });

    for (let i = 0; i < delaySamples; i++) {
        setTimeout(() => {
            socket.emit('time/req', { sent: milliseconds() });
        }, i * initialSamplePeriod);
    }

    setInterval(() => {
        socket.emit('get', { sent: milliseconds() });
    }, resyncPeriod);
}

function getRemoteTime() {
    return milliseconds() + localTimeDiff - networkDelay;
}

function getPlaybackTime() {
    if (transport) {
        return getRemoteTime() + transport.offset;
    }
    return 0;
}

export { transport, networkDelay, localTimeDiff, getPlaybackTime, startWebSync };