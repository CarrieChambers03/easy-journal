const Ajv = require("ajv");
const ajv = new Ajv();

const getEntryListAbl = require("./getEntryListAbl.js");

const schema = {
    type: "string",
    minLength: 1,
    maxLength: 100,
}

function getByTextAbl(req, res){
    try {
        const text = req.body.text;

        //validate input
        const valid = ajv.validate(schema, text);
        if(!valid){
            res.status(400).json({
                code: "textIsNotValid",
                message: "text is not valid",
                validationError: ajv.errors,
            });
            return;
        };

        //getting the array of entries
        const entries = getEntryListAbl(req, res);
        const entriesByText = entries.filter(entry => entry.textInput.includes(text));

        res.json(entriesByText);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

module.exports = getByTextAbl;