const Ajv = require("ajv");
const addFormats = require("ajv-formats");
const ajv = new Ajv({useDefaults: true});
addFormats(ajv);

const journalEntryDao = require("../../dao/journalEntry-dao.js");
const getUserById = require("../user/getByIdAbl.js");
const updateUser = require("../user/updateAbl.js");

const schema = {
    type: "object",
    properties: {
        date: { type: "string", format: "date-time", default: new Date().toISOString()},
        textInput: { type: "string", default: "" },
        moodID: { type: "string", default: "" },
        activityList: { type: "array", items: { type: "string" }, default: [] }
    },
    required: ["date", "textInput", "moodID", "activityList"],
    additionalProperties: false,
};

async function createAbl(req, res) {
    try {
        let entry = req.body;
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

        if(entry.textInput === "" && entry.activityList.length === 0 && entry.moodID === ""){
            res.status(400).json({
                code: "emptyJournalEntry",
                message: "cannot save an empty journal entry",
            });
            return;
        };

        //getting the user
        const user = await getUserById({params: {id: req.user}},res);
        if(!user){
            res.status(404).json({
                code: "userNotFound",
                message: "user not found",
            });
            return;
        };

        //creating the entry
        entry.userID = req.user;
        entry = journalEntryDao.create(entry);
        user.journalEntryList.push(entry.id);

        //updating the user with the new journal entry
        await updateUser({body: {id: user.id, journalEntryList: user.journalEntryList}}, res);

        res.json({
            entry: entry,
            list: user.journalEntries
        });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

module.exports = createAbl;