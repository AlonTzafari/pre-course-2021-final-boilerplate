const express = require("express");
const { Router } = express;
const bin = require("./bin");

const v1 = Router();
v1.use(express.json());
v1.use("/b", bin);

module.exports = v1;