const Ajv = require("ajv");
const ajv = new Ajv();

const activityDao = require("../../dao/activity-dao.js");

const schema = {
    type: "object",
    properties: {
        name: { type: "string" }
    },
    required: ["name"],
    additionalProperties: false
}

function createAbl(req, res) {
    try {
        const activity = req.body;
        const valid = ajv.validate(schema, activity);
        if (!valid) {
            res.status(400).json({
                code: "dtoInIsNotValid",
                message: "dtoIn is not valid",
                validationError: ajv.errors
            });
            return;
        }
        if (activity.name === "") {
            res.status(400).json({
                code: "emptyActivityName",
                message: "Activity name cannot be empty"
            });
            return;
        }

        const createdActivity = activityDao.create(activity);
        res.json(createdActivity);

    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

module.exports = createAbl;