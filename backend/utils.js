"use strict"

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

function createBin(data) {
    const binNames = fs.readdirSync(`${__dirname}/database/bins`);
    let id = randomId(8);
    while (binNames.includes(`${id}.json`)) {
        id = randomId(8);
    }
    
    const content = JSON.stringify(data);
    fs.appendFileSync(`${__dirname}/database/bins/${id}.json`, content);
    return id;
}

function getBin(id) {
    
}

function getAll() {
    const binNames = fs.readdirSync(`${__dirname}/database/bins`);
    const bins = [];
    for(const binName of binNames) {
        const rawJson = fs.readFileSync(`${__dirname}/database/bins/${binName}`);
        bins.push(rawJson);
    }
    return bins;
}

function updateBin(id) {

}

function deleteBin(id) {

}

module.exports = {
    createBin,
    getBin,
    getAll,
    updateBin,
    deleteBin
}