const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const roleFolderPath = path.join(__dirname, "storage", "roleList");

function create(role) {
    try {
        role.id = crypto.randomBytes(16).toString("hex");
        const filePath = path.join(roleFolderPath, `${role.id}.json`);
        const fileData = JSON.stringify(role);
        fs.writeFileSync(filePath, fileData, "utf8");
        return role;
    } catch (e) {
        throw { code: "failedToCreateRole", message: e.message };
    }
}

function getById(id) {
    try {
        const filePath = path.join(roleFolderPath, `${id}.json`);
        const fileData = fs.readFileSync(filePath, "utf8");
        return JSON.parse(fileData);
    } catch (e) {
        if (e.code === "ENOENT") {
            return null;
        }
        throw { code: "failedToGetRole", message: e.message };
    }
}

module.exports = {
    create,
    getById,
};