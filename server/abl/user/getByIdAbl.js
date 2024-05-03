const Ajv = require("ajv");
const ajv = new Ajv();

const userDao = require("../../dao/user-dao.js");

const schema = {
    type: "string",
    minLength: 32,
    maxLength: 32,
    pattern: "^[a-f0-9]*$", //hexadecimal
}

function getByIdAbl (req, res) {
    try {
        const id = req.params.id;

        //validate input
        const valid = ajv.validate(schema, id);
        if(!valid){
            res.status(400).json({
                code: "idIsNotValid",
                message: "id is not valid",
                validationError: ajv.errors,
            });
            return;
        };

        const user = userDao.getById(id);

        if(!user){
            res.status(404).json({
                code: "userNotFound",
                message: `user ${id} not found`,
            });
            return;
        }

        return user; //used in other ABLs so only returning

    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

module.exports = getByIdAbl;