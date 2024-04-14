const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const journalEntryFolderPath = path.join(__dirname, "storage", "journalEntryList");

//method to write a journal entry to a file
function create(entry){
    try {
        entry.id = crypto.randomBytes(16).toString("hex");
        const filePath = path.join(journalEntryFolderPath, `${entry.id}`);
        const fileData = JSON.stringify(entry);
        fs.writeFileSync(filePath, fileData, "utf8");
        return entry;
    } catch (e) {
        throw { code: "failedToCreateJournalEntry", message: error.message };
    }
};

function getById(id){
    try {
        const filePath = path.join(journalEntryFolderPath, `${id}`);
        const fileData = fs.readFileSync(filePath, "utf8");
        return JSON.parse(fileData);
    } catch (e) {
        if (e.code === "ENOENT"){ return null; }
        throw { code: "failedToGetJournalEntry", message: error.message };
    }
}

function getEntries(ids){
    try {
        const entryIds = ids;
        const entries = [];

        entryIds.forEach(id => {
            const entry = getById(id);
            if(entry) entries.push(entry);
        })

        return entries;
    } catch (e) {
        throw { code: "failedToGetJournalEntries", message: error.message };
    }
}

function update(entry){
    try {
        const filePath = path.join(journalEntryFolderPath, `${entry.id}`);
        const fileData = JSON.stringify(entry);
        fs.writeFileSync(filePath, fileData, "utf8");
        return entry;
    } catch (e) {
        throw { code: "failedToUpdateJournalEntry", message: error.message };
    }
}

function deleteEntry(id){
    try {
        const filePath = path.join(journalEntryFolderPath, `${id}`);
        fs.unlinkSync(filePath);
        return {};
    } catch (e) {
        if (e.code === "ENOENT"){ return null; }
        throw { code: "failedToDeleteJournalEntry", message: error.message };
    }
}

module.exports = {
    create,
    getById,
    getEntries,
    update,
    deleteEntry,
};