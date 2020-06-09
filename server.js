// express implements a high-level webserver api
const express = require("express");

// create webserver instance
const app = express();
const port = 4444;

// serve the web-app files
app.use(express.static("web-app/dist"));

// attach the websocket server
const ws = require('express-ws')(app, undefined, { clientTracking: true });

// encode and wrap message in metadata
function encapsulate(from, message) {
    let payload = {
        server: false,
        message: Buffer.from(message, 'binary').toString('base64'),
    };
    if (from === null) payload[server] = true;
    return JSON.stringify(payload);
}

// send a message to all clients in a particular room
// except the sender
function broadcast(from, roomID, payload) {
    // iterate over all the clients
    ws.getWss().clients.forEach(function each(client) {
        // if client is not sender and can receive messages
        if (client !== from && client.readyState === 1) {
            // if client is in this room
            if (client.protocol === roomID) {
                client.send(encapsulate(from, payload));
            }
        }
    });
}

// WebSocket connection handling
app.ws("/", function connection(s, req) {
    // grab the room id from the request
    let roomID = req.headers["sec-websocket-protocol"];
    //let roomID = new URL(req.url).searchParams.get("room");
    
    // check that the roomid is valid
    let r = /^[A-Fa-f0-9]{64}$/;
    if (!r.test(roomID)) {
        s.close(0, "error: invalid room key");
        return;
    }

    // attach an incoming message handler
    s.on("message", function message(m) {
        broadcast(s, roomID, m);
    });

    // broadcast a joined message
    broadcast(null, roomID, "new client joined the room");
});

// start listening
app.listen(port);
