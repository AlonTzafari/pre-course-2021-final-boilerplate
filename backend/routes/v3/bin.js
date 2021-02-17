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
    response.status(200).send({
        "record": bin,
        "metadata": {
          "id": id,
          "private": false
        }
    });
    } catch(error) {
        console.log("error: " + error);
        response.status(404).send({
            "message": "Bin not found"
        });
    }
});

//create
bin.post("/", (request, response) => {
    const binName = request.header("X-BIN-NAME");
    let id = null;
    if (binName) id = binName;
    try {
        id = createBin(request.body, id);
        console.log(`bin ${id}.json created`);
        response.status(200).send({
            "record": request.body,
            "metadata": {
              "id": id,
              "createdAt": new Date().toISOString(),
              "private": false
            }
        });
    } catch (error) {
        response.status(400).send({"message": `${error}`});
    }
});

//update
bin.put("/:id", (request, response) => {
    const id = request.params.id;
    try {
        updateBin(id, request.body);
        response.status(200).send({
            "record": request.body,
            "metadata": {
              "parentId": id,
              "private": false
            }
        });
    } catch (error) {
        response.status(404).send({"message": `${error}`});
    }
});

//delete
bin.delete("/:id", (request, response) => {
    const id = request.params.id;
    try {
        deleteBin(id);
        response.send({
            "metadata": {
              "id": id,
              "versionsDeleted": 0
            },
            "message": "Bin deleted successfully"
          });
    } catch(error) {
        response.status(404).send({"message": "Bin not found"});
    }
});

function formatResponse(record) {

}

module.exports = bin;
