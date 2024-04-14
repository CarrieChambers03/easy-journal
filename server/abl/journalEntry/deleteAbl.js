const Ajv = require("ajv");
const ajv = new Ajv();

const journalEntryDao = require("../../dao/journalEntry-dao.js");

const schema = {
    type: "object",
    properties: {
        id: { type: "string" },
    },
    required: ["id"],
    additionalProperties: false,
};

function deleteAbl(req, res){
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

        //delete the entry
        const result = journalEntryDao.deleteEntry(id);
        if (!result){
            res.status(404).json({
                code: "entryNotFound",
                message: `Entry with id ${id} not found`,
            });
            return;
        }
        res.json({ message: "Entry deleted" });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

module.exports = deleteAbl;