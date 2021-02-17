"use strict"
const express = require("express");
const fs = require("fs");
const {createBin} = require("../../utils");

const bin = express();

//get all
bin.get("/", (request, response) => {
    response.send("all bins");
});
//get
bin.get("/:id", (request, response) => {
    const id = request.params.id;
    response.send(`bin ${id}`);
});
//create
bin.post("/", (request, response) => {
    const id = createBin(request.body);
    response.send(`new bin ${id} created`);
});
//update
bin.put("/:id", (request, response) => {
    const id = request.params.id;
    response.send(`bin ${id} updated`);
});
//delete
bin.delete("/:id", (request, response) => {
    const id = request.params.id;
    response.send(`bin ${id} deleted`);
});



module.exports = bin;
