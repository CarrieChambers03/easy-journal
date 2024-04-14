const Ajv = require("ajv");
const addFormats = require("ajv-formats");

const ajv = new Ajv();
addFormats(ajv);

const getEntryListAbl = require("./getEntryListAbl.js");

const schema = {
    anyOf: [
        { 
            type: "object", 
            properties: {
                date: {type: "string", format: "date" }
            }
        }, // single date
        { 
            type: "object", 
            properties: {
                date: { type: "array", items: { type: "string", format: "date" } } // array of dates
            }
        }
    ]
}

function getByDateAbl(req, res) {
    try {
        //validate input
        const valid = ajv.validate(schema, req.body);
        if(!valid){
            res.status(400).json({
                code: "dateIsNotValid",
                message: "date is not valid",
                validationError: ajv.errors,
            });
            return;
        };

        const date = req.body.date;
    
        //getting the array of entries
        const entries = getEntryListAbl(req, res);
        let entriesByDate = [];
        if(date instanceof Array){
            entriesByDate = entries.filter(entry => date.some(d => entry.date.includes(d)));
        } else {
            entriesByDate = entries.filter(entry => entry.date.includes(date));
        }

        res.json(entriesByDate);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

module.exports = getByDateAbl;