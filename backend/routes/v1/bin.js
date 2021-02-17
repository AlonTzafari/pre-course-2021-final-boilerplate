"use strict"
const express = require("express");
const fs = require("fs");
const {createBin, getBin, getAll, updateBin, deleteBin} = require("../../utils");

const bin = express();

//get all
bin.get("/", (request, response) => {
    const allJsons = getAll(); 
    console.log(`sending: ${allJsons}`);
    response.send(allJsons);
});
//get
bin.get("/:id", (request, response) => {
    const id = request.params.id;
    try {
    const bin = getBin(id);
    console.log(`sending bin ${id}.json`);
    console.log(bin);
    response.send(bin);
} catch(error) {
    console.log("error: " + error);
    response.send(`bin ${id} not found`);
    }
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
