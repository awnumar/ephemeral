// express implements a high-level webserver api
const express = require("express");

// create webserver instance
const app = express();
const port = 4444;

// serve the web-app files
app.use(express.static("web-app/dist"));

// attach the websocket server
const ws = require('express-ws')(app);

// Store active rooms here along with their participants
// rooms["roomID"] = { participants: [ ws.client ] }
let rooms = {};

// remove client from room
function remove_from_room(client, room) {
    let i = rooms[roomID].indexOf(s);
    if (i != -1) rooms[roomID].splice(i, 1);
}

// send a message to all clients in a particular room
// except the sender
function broadcast(from, roomID, payload) {
    // iterate over all the clients in the room
    for (let i = 0; i < rooms[roomID].length; i++) {
        // except the sender
        if (rooms[roomID][i] != from) {
            // if client is ready for data
            if (rooms[roomID][i].readyState == WebSocket.OPEN) {
                rooms[roomID][i].send(payload, { binary: true });
            } else {
                // otherwise remove him
                remove_from_room(rooms[roomID][i], roomID);
            }
        }
    }
}

// WebSocket connection handling
app.ws("/", function connection(s, req) {
    // grab the room id from the request
    let roomID = req.headers["sec-websocket-protocol"]
    //let roomID = new URL(req.url).searchParams.get("room");
    
    // check that the roomid is valid
    let r = /^[A-Fa-f0-9]{64}$/;
    if (!r.test(roomID)) {
        s.close(0, "error: invalid room key");
        return;
    }

    // check if this room exists
    if (roomID in rooms) {
        // add this client to that room
        rooms[roomID].push(s);
    } else {
        // create a new room with only this client
        rooms[roomID] = [s];
    }

    // attach an incoming message handler
    s.on("message", function message(m) {
        broadcast(s, roomID, m);
    });

    // attach a cleanup handler
    s.on("close", function(code, reason) {
        // supress warnings
        code = code;
        reason = reason;

        // remove client from their room
        remove_from_room(s, roomID);
    });
});

// start listening
app.listen(port);
