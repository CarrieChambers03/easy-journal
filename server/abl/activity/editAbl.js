const Ajv = require("ajv");
const ajv = new Ajv();

const activityDao = require("../../dao/activity-dao.js");

const schema = {
    type: "object",
    properties: {
        id: { type: "string" },
        name: { type: "string" }
    },
    required: ["id"],
    additionalProperties: false
};

function editAbl (req, res) {
    try {
        const activity = req.body;

        // Validate input
        const valid = ajv.validate(schema, activity);
        if (!valid) {
            res.status(400).json({
                code: "dtoInIsNotValid",
                message: "dtoIn is not valid",
                validationError: ajv.errors
            });
            return;
        }
    
        // Get the current activity data
        const existingData = activityDao.getById(activity.id);
        if (!existingData) {
            res.status(404).json({
                code: "activityNotFound",
                message: `Activity with id ${activity.id} not found`
            });
            return;
        }

        const updatedActivity = { ...existingData, ...activity };
        activityDao.update(updatedActivity);
        res.json(updatedActivity);

    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

module.exports = editAbl;