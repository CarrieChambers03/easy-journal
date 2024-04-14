const Ajv = require("ajv");
const ajv = new Ajv();
const addFormats = require("ajv-formats");
addFormats(ajv);
const validateIcon = require("../../helpers/validate-icon.js");
ajv.addFormat("icon", validateIcon);

const moodDao = require("../../dao/mood-dao.js");

const schema = {
    type: "object",
    properties: {
        name: { type: "string" },
        icon: { type: "string", format: "icon" },
        value: { type: "number" }
    },
    required: ["name", "icon", "value"],
    additionalProperties: false,
};

function createAbl(req, res) {
    try {
        const mood = req.body;
        const valid = ajv.validate(schema, req.body);
        if (!valid) {
            res.status(400).json({
                code: "dtoInIsNotValid",
                message: "dtoIn is not valid",
                validationError: ajv.errors,
            });
            return;
        }
        if (mood.name === "") {
            res.status(400).json({
                code: "emptyMoodName",
                message: "Mood name cannot be empty",
            });
            return;
        }

        const createdMood = moodDao.create(mood);
        res.json(createdMood);

    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

module.exports = createAbl;