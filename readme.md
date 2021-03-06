# ableton-web-sync

Sub-frame synchronization between Ableton Live and websites running on remote devices.

## Setup

Install the code in `server` on a remote server and run with `node app.js`.

Modify the definition of `timeServer` in `ableton/ServerDate.js` to correspond to the remote server address.

Drop the `ableton/device.amxd` onto a track in Ableton Live.

Load the example page on the server and start the playback in Ableton Live.

## Nginx Configuration

Add the following to your Nginx configuration to add socket.io support:

```
server {
  ...
  location / {
    ...
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_cache_bypass $http_upgrade; 
  }
}
```
