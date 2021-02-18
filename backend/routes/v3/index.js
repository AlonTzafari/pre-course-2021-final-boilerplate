"use strict"
const express = require("express");
const { Router } = express;
const bin = require("./bin");

const v3 = Router();
v3.use("/b", bin);

module.exports = v3;