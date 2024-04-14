const express = require("express");
const router = express.Router();

const createAbl = require("../abl/journalEntry/createAbl.js");
const getByIdAbl = require("../abl/journalEntry/getByIdAbl.js");
const getEntryListAbl = require("../abl/journalEntry/getEntryListAbl.js");
const getByDateAbl = require("../abl/journalEntry/getByDateAbl.js");
const getByTextAbl = require("../abl/journalEntry/getByTextAbl.js");
const editAbl = require("../abl/journalEntry/editAbl.js");
const deleteAbl = require("../abl/journalEntry/deleteAbl.js");

router.post("/create", (req, res) => {
    createAbl(req, res);
});

router.get("/getById", (req, res) => {
    try {
        const entry = getByIdAbl(req, res);
        res.json(entry);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});

router.get("/myList", (req, res) => {
    try {
        const entries = getEntryListAbl(req, res);
        res.json(entries);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});

router.get("/getByDate", (req, res) => {
    getByDateAbl(req, res);
});

router.get("/getByText", (req, res) => {
    getByTextAbl(req, res);
});

router.post("/edit", (req, res) => {
    editAbl(req, res);
})

router.post("/delete", (req, res) => {
    deleteAbl(req, res);
})

module.exports = router;