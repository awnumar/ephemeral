// express implements a high-level webserver api
const express = require("express");

// create webserver instance
const app = express();
const port = 4444;

// everything else served from public/
app.use(express.static("ephemeral-webapp/dist"));

// start listening
app.listen(port);
