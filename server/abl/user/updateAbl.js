//ajv
const Ajv = require("ajv");
const addFormats = require("ajv-formats");
const ajv = new Ajv();
addFormats(ajv);
const validatePassword = require("../../helpers/validate-password.js");
ajv.addFormat("password", validatePassword);

const userDao = require("../../dao/user-dao.js");
const getByIdAbl = require("./getByIdAbl.js");

//schema
const schema = {
    type: "object",
    properties: {
        id: { type: "string" },
        email: { type: "string", format: "email" },
        password: { type: "string", format: "password" },
        role: { type: "string" },
        journalEntryList: { type: "array", items: { type: "string" } }
    },
    required: ["id"],
    additionalProperties: false,
};

//function
function updateAbl(req, res){
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

        if(user.email){
            const userList = userDao.list();
            const emailExists = userList.find(u => u.email === user.email);
            if(emailExists){
                res.status(400).json({
                    code: "emailAlreadyExists",
                    message: `User with email ${user.email} already exists`,
                });
                return;
            };
        }

        //get the current user data
        let idParam = {
            params: {
                id: user.id,
            }
        }
        const existingData = getByIdAbl(idParam, res);
        if (!existingData){
            res.status(404).json({
                code: "userNotFound",
                message: `User with id ${user.id} not found`,
            });
            return;
        }

        //merge the data
        user = {...existingData, ...user};

        //update the user
        user = userDao.update(user);
        return user; //used in other ABLs so only returning
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

module.exports = updateAbl;