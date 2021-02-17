"use strict"
const express = require("express");
const fs = require("fs");
const {createBin, getBin, getAll, updateBin, deleteBin} = require("../../utils");

const bin = express();

//get all
bin.get("/", (request, response) => {
    console.log( getAll() );
    response.send("getAll()");
});
//get
bin.get("/:id", (request, response) => {
    const id = request.params.id;
    response.send(`bin ${id}`);
});
//create
bin.post("/", (request, response) => {
    console.log("post received");
    const id = createBin(request.body);
    console.log(`bin ${id}.json created`);
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
