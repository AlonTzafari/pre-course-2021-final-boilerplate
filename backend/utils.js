"use strict"

const { json } = require("express");
const fs = require("fs");

function randomId(length) {
    let result = '';
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }

function createBin(data, binName = null) {
    const binNames = fs.readdirSync(`${__dirname}/database/bins`);
    let id = binName;
    if (id) {
        if ( binNames.includes(`${id}.json`) ) throw new Error("Bin name taken");
    } else {
        id = randomId(8);
        while ( binNames.includes(`${id}.json`) ) {
            id = randomId(8);
        }
    }
    
    const content = JSON.stringify(data);
    fs.writeFileSync(`${__dirname}/database/bins/${id}.json`, content);
    return id;
}

function getBin(id) {
    const rawJson = fs.readFileSync(`${__dirname}/database/bins/${id}.json`, "utf8");
    return JSON.parse(rawJson);
}

function getAll() {
    const files = fs.readdirSync(`${__dirname}/database/bins`);
    const binNames = files.filter(name => name.split(".")[1] === "json"); //filter all non json file names
    const bins = [];
    for(const binName of binNames) {
        const rawJson = fs.readFileSync(`${__dirname}/database/bins/${binName}`, "utf8");
        bins.push( JSON.parse(rawJson) );
    }
    return bins;
}

function updateBin(id, data) {
    const binNames = fs.readdirSync(`${__dirname}/database/bins`);
    if( !binNames.includes(`${id}.json`) ) throw new Error(`Bin ${id}.json doesn't exist`);
    const content = JSON.stringify(data);
    fs.writeFileSync(`${__dirname}/database/bins/${id}.json`, content);
    return id;
}

function deleteBin(id) {
    fs.unlinkSync(`${__dirname}/database/bins/${id}.json`);
}

module.exports = {
    createBin,
    getBin,
    getAll,
    updateBin,
    deleteBin
}