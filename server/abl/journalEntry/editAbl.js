//ajv
const Ajv = require("ajv");
const addFormats = require("ajv-formats");
const ajv = new Ajv();
addFormats(ajv);

const getByIdAbl = require("./getByIdAbl.js");
const journalEntryDao = require("../../dao/journalEntry-dao.js");

const schema = {
    type: "object",
    properties: {
        id: { type: "string" },
        textInput: { type: "string" },
        date: { type: "string", format: "date-time" },
        moodID: { type: "string" },
        activityList: { type: "array", items: { type: "string" } }
    },
    required: ["id"],
    additionalProperties: false,
}

function editAbl(req, res){
    try {
        const entry = req.body;

        //validate input
        const valid = ajv.validate(schema, entry);
        if(!valid){
            res.status(400).json({
                code: "dtoInIsNotValid",
                message: "dtoIn is not valid",
                validationError: ajv.errors,
            });
            return;
        };

        //get the current entry data
        let idQuery = {
            query: {
                id: entry.id,
            }
        }
        const existingData = getByIdAbl(idQuery, res);
        if (!existingData){
            res.status(404).json({
                code: "entryNotFound",
                message: `Entry with id ${entry.id} not found`,
            });
            return;
        }

        //merge the data
        const updatedEntry = {...existingData, ...entry};

        //update the entry
        journalEntryDao.update(updatedEntry);

        res.json(updatedEntry);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

module.exports = editAbl;