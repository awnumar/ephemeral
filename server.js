// express implements a high-level webserver api
const express = require("express");

// create webserver instance
const app = express();
const port = 4444;

// get handler on /test
app.get("/test", function (req, res) {
    res.send("hello world");
});

// everything else served from public/
app.use(express.static("public"));

// start listening
app.listen(port);
