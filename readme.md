# ableton-web-sync

Sub-frame synchronization between Ableton Live and websites running on remote devices.

This is currently designed for consistent playback without frequent starts/stops or jumps over a WAN. For more frequent jumps while on a shared LAN, check out [node-abletonlink](https://github.com/2bbb/node-abletonlink) and [node-abletonlink-example](https://github.com/2bbb/node-abletonlink-example).

## Setup

Install the code in `server` on a remote server and run with `node app.js`.

Modify the definition of `timeServer` in `ableton/ServerDate.js` to correspond to the remote server address.

Drop the `ableton/device.amxd` onto a track in Ableton Live.

Load the example page on the server and start the playback in Ableton Live.