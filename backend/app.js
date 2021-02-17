"use strict"
const express = require("express");
const api = require("./routes");

const app = express();

app.use("/api", api);

//404 handling
app.use((req, res) => {
    res.status(404).send("404 page not found")
});

module.exports = app;