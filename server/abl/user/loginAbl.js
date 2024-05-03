const Ajv = require("ajv");
const addFormats = require("ajv-formats");
const ajv = new Ajv();
addFormats(ajv);
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const fs = require("fs");

const userDao = require("../../dao/user-dao.js");

const schema = {
    type: "object",
    properties: {
        email: { type: "string", format: "email" },
        password: { type: "string" }
    },
    required: ["email", "password"],
    additionalProperties: false,
};

async function loginAbl(req, res){
    try {
        let credentials = req.body;

        //validate input
        const valid = ajv.validate(schema, credentials);
        if(!valid){
            res.status(400).json({
                code: "dtoInIsNotValid",
                message: "dtoIn is not valid",
                validationError: ajv.errors,
            });
            return;
        };

        const userList = userDao.list();
        let user = userList.find(u => u.email === credentials.email);
        if(!user){
            res.status(400).json({
                code: "userNotFound",
                message: `User with email ${credentials.email} not found`,
            });
            return;
        };

        const userPath = path.join(userDao.userFolderPath, `${user.id}`);
        user = JSON.parse(fs.readFileSync(userPath, "utf8"));

        //check password
        const match = await bcrypt.compare(credentials.password, user.password);
        if(match){
            const accessToken = jwt.sign(
                { id: user.id }, 
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: "5m" }
            );
            const refreshToken = jwt.sign(
                { id: user.id },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: "1d" }
            );

            res.cookie('jwt', refreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000});
            res.cookie('access', accessToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 5 * 60 * 1000});
            userDao.login(user.id, refreshToken);
            res.json({ accessToken });
        } else {
            res.status(400).json({
                code: "incorrectPassword",
                message: "Incorrect password",
            });
        }

    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

module.exports = loginAbl;