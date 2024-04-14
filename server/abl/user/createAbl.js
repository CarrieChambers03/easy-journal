//ajv
const Ajv = require("ajv");
const addFormats = require("ajv-formats");
const ajv = new Ajv({useDefaults: true});
addFormats(ajv);
const validatePassword = require("../../helpers/validate-password.js");
ajv.addFormat("password", validatePassword);

const userDao = require("../../dao/user-dao.js");

//schema
const schema = {
    type: "object",
    properties: {
        email: { type: "string", format: "email" },
        password: { type: "string", format: "password" },
        role: { type: "string", default: "a51e9c7869bd68b8e6adf15e1797d7a6"}
    },
    required: ["email", "password", "role"],
    additionalProperties: false,
};

//function
async function createAbl(req, res){
    try{
        let user = req.body;

        //validate input
        const valid = ajv.validate(schema, user);
        if(!valid){
            res.status(400).json({
                code: "dtoInIsNotValid",
                message: "dtoIn is not valid",
                validationError: ajv.errors,
            });
            return;
        };
        const userList = userDao.list();
        const emailExists = userList.find(u => u.email === user.email);
        if(emailExists){
            res.status(400).json({
                code: "emailAlreadyExists",
                message: `User with email ${user.email} already exists`,
            });
            return;
        };

        user = await userDao.create(user);
        res.json(user);
    } catch (e) {
        res.status(500).json({ message: e.message });
    };
};

module.exports = createAbl;