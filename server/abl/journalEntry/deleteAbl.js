const Ajv = require("ajv");
const ajv = new Ajv();

const journalEntryDao = require("../../dao/journalEntry-dao.js");
const getUserById = require("../user/getByIdAbl.js");
const updateUser = require("../user/updateAbl.js");

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

        //update the user
        const user = getUserById({params: {id: req.user}}, res);
        if(!user){
            res.status(404).json({
                code: "userNotFound",
                message: "user not found",
            });
            return;
        };
        const position = user.journalEntryList.indexOf(id);
        user.journalEntryList.splice(position, 1);
        updateUser({body: {id: user.id, journalEntryList: user.journalEntryList}}, res);

        res.json({ message: "Entry deleted" });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

module.exports = deleteAbl;