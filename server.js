// express implements a high-level webserver api
const express = require("express");

// create webserver instance
const app = express();
const port = 4444;

// get handler on /test
app.get("/chat", function (req, res) {
    // todo verify key exists and is valid length
    res.send(req.query.key);
});

// everything else served from public/
app.use(express.static("public"));

// start listening
app.listen(port);
