const Ajv = require("ajv");
const ajv = new Ajv();

const journalEntryDao = require("../../dao/journalEntry-dao.js");
const getUserById = require("../user/getByIdAbl.js");

const schema = {
    type: "string",
    minLength: 32,
    maxLength: 32,
    pattern: "^[a-f0-9]*$", //hexadecimal
};

function getEntryListAbl(req, res){
    try {
        let userId = req.user;

        //validate input
        const valid = ajv.validate(schema, userId);
        if(!valid){
            res.status(400).json({
                code: "idIsNotValid",
                message: "id is not valid",
                validationError: ajv.errors,
            });
            return;
        };

        //getting the array of entry ids
        const user = getUserById({params: {id: userId}}, res);
        if(!user){
            res.status(404).json({
                code: "userNotFound",
                message: `user ${userId} not found`,
            });
            return;
        }
        const entryIds = user.journalEntryList;

        //getting the journal entries
        const entries = journalEntryDao.getEntries(entryIds);

        return entries; //used in other ABLs so only returning
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

module.exports = getEntryListAbl;