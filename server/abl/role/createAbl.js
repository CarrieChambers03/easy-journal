const Ajv = require("ajv");
const ajv = new Ajv();

const roleDao = require("../../dao/role-dao.js");

const schema = {
    type: "object",
    properties: {
        name: { type: "string" },
    },
    required: ["name"],
    additionalProperties: false,
};

function createAbl(req, res) {
    try {
        const role = req.body;
        const valid = ajv.validate(schema, role);
        if (!valid) {
            res.status(400).json({
                code: "dtoInIsNotValid",
                message: "dtoIn is not valid",
                validationError: ajv.errors,
            });
            return;
        }
        if (role.name === "") {
            res.status(400).json({
                code: "emptyRoleName",
                message: "Role name cannot be empty",
            });
            return;
        }

        const createdRole = roleDao.create(role);
        res.json(createdRole);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

module.exports = createAbl;