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
    while (binNames.indexOf(`${id}.json`) === -1) {
        id = randomId(8);
    }
    
    const content = JSON.stringify(data);
    fs.appendFileSync(`${__dirname}/database/bins/${id}.json`, content);
    return id;
}

function getBin(id) {
    
}

module.exports = {
    createBin
}