const Ajv = require("ajv");
const ajv = new Ajv();

const journalEntryDao = require("../../dao/journalEntry-dao.js");

const schema = {
    type: "string",
    minLength: 32,
    maxLength: 32,
    pattern: "^[a-f0-9]*$", //hexadecimal
}

function getByIdAbl (req, res) {
    try {
        let id = req.query.id;

        //validate input
        const valid = ajv.validate(schema, id);
        if(!valid){
            res.status(400).json({
                code: "idIsNotValid",
                message: "id is not valid",
                validationError: ajv.errors,
            });
            return;
        };

        const entry = journalEntryDao.getById(id);
        if(!entry){
            res.status(404).json({
                code: "journalEntryNotFound",
                message: `journal entry ${id} not found`,
            });
            return;
        }
        
        return entry; //returning the entry for other ABLs

    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

module.exports = getByIdAbl;