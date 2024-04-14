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

function deleteAbl (req, res) {
    try {
        let id = req.body.id;

        //validate input
        const valid = ajv.validate(schema, req.body);
        if(!valid){
            res.status(400).json({
                code: "idIsNotValid",
                message: "id is not valid",
                validationError: ajv.errors,
            });
            return;
        };

        //delete the activity
        const result = activityDao.deleteActivity(id);
        if (!result){
            res.status(404).json({
                code: "activityNotFound",
                message: `Activity with id ${id} not found`,
            });
            return;
        }

        res.json({ message: "Activity deleted" });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

module.exports = deleteAbl;