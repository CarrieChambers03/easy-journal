const express = require("express");
const router = express.Router();

const createAbl = require("../abl/role/createAbl.js");
const getAbl = require("../abl/role/getAbl.js");

router.post("/create", (req, res) => {
    createAbl(req, res);
});

router.get("/get/:id", (req, res) => {
    getAbl(req, res);
})
 
module.exports = router;