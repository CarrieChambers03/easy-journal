const Ajv = require("ajv");
const ajv = new Ajv();

const roleDao = require("../../dao/role-dao");

const schema = {
    type: "object",
    properties: {
        id: { type: "string" },
    },
    required: ["id"],
    additionalProperties: false,
};

function getAbl(req, res){
    try {
        const valid = ajv.validate(schema, req.body);
        if (!valid) {
            res.status(400).json({
                code: "dtoInIsNotValid",
                message: "dtoIn is not valid",
                validationError: ajv.errors,
            });
            return;
        }

        const role = roleDao.getById(req.body.id);
        if(!role){
            res.status(404).json({
                code: "roleNotFound",
                message: `role ${req.body.id} not found`,
            });
            return;
        }

        res.json(role);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

module.exports = getAbl;