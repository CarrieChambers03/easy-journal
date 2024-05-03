const Ajv = require("ajv");
const ajv = new Ajv();

const activityDao = require("../../dao/activity-dao.js");

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

        const activity = activityDao.getById(req.params.id);
        if(!activity){
            res.status(404).json({
                code: "activityNotFound",
                message: `activity ${req.params.id} not found`,
            });
            return;
        }

        res.json(activity);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

module.exports = getAbl;