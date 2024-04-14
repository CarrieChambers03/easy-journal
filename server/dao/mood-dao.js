const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { get } = require("http");

const moodFolderPath = path.join(__dirname, "storage", "moodList");

function create(mood) {
    try {
        mood.id = crypto.randomBytes(16).toString("hex");
        const filePath = path.join(moodFolderPath, `${mood.id}.json`);
        const fileData = JSON.stringify(mood);
        fs.writeFileSync(filePath, fileData, "utf8");
        return mood;
    } catch (e) {
        throw { code: "failedToCreateMood", message: e.message };
    }
}

function getById(id){
    try {
        const filePath = path.join(moodFolderPath, `${id}.json`);
        const fileData = fs.readFileSync(filePath, "utf8");
        return JSON.parse(fileData);
    } catch (e) {
        if (e.code === "ENOENT") {
            return null;
        }
        throw { code: "failedToGetMood", message: e.message };
    }
}

module.exports = {
    create,
    getById,
}