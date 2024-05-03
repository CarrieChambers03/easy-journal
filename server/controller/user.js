const express = require("express");
const router = express.Router();

const listAbl = require("../abl/user/listAbl.js");
const createAbl = require("../abl/user/createAbl.js");
const loginAbl = require("../abl/user/loginAbl.js");
const refreshTokenAbl = require("../abl/user/refreshTokenAbl.js")
const getByIdAbl = require("../abl/user/getByIdAbl.js");
const updateAbl = require("../abl/user/updateAbl.js");

router.get("/list", (req, res) => {
    listAbl(req, res);
});

router.post("/create", (req, res) => {
    createAbl(req, res);
});

router.post("/login", (req, res) => {
    loginAbl(req, res);
});

router.get("/refresh", (req, res) => {
    refreshTokenAbl(req, res);
})

router.get("/getById/:id", (req, res) => {
    try {
        const user = getByIdAbl(req, res);
        res.json(user);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});

router.post("/update", (req, res) => {
    try {
        const user = updateAbl(req, res);
        res.json(user);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
})

module.exports = router;