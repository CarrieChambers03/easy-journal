const express = require("express");
const router = express.Router();

const createAbl = require("../abl/activity/createAbl.js");
const getAbl = require("../abl/activity/getAbl.js");
const listAbl = require("../abl/activity/listAbl.js");
const editAbl = require("../abl/activity/editAbl.js");
const deleteAbl = require("../abl/activity/deleteAbl.js");

router.post("/create", (req, res) => {
    createAbl(req, res);
});

router.get("/get/:id", (req, res) => {
    getAbl(req, res);
});

router.get("/list", (req, res) => {
    listAbl(req, res);
});

router.post("/edit", (req, res) => {
    editAbl(req, res);
});

router.post("/delete", (req, res) => {
    deleteAbl(req, res);
})

module.exports = router;