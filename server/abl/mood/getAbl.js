const Ajv = require("ajv");
const ajv = new Ajv();

const moodDao = require("../../dao/mood-dao.js");

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
        const valid = ajv.validate(schema, req.params);
        if (!valid) {
            res.status(400).json({
                code: "dtoInIsNotValid",
                message: "dtoIn is not valid",
                validationError: ajv.errors,
            });
            return;
        }
        const mood = moodDao.getById(req.params.id);
        if(!mood){
            res.status(404).json({
                code: "moodNotFound",
                message: `mood ${req.params.id} not found`,
            });
            return;
        }

        res.json(mood);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

module.exports = getAbl;