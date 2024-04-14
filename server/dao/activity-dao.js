const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const activityFolderPath = path.join(__dirname, "storage", "activityList");

function create(activity) {
    try {
        activity.id = crypto.randomBytes(16).toString("hex");
        const filePath = path.join(activityFolderPath, `${activity.id}.json`);
        const fileData = JSON.stringify(activity);
        fs.writeFileSync(filePath, fileData, "utf8");
        return activity;
    } catch (e) {
        throw { code: "failedToCreateActivity", message: e.message };
    }
}

function getById(id){
    try {
        const filePath = path.join(activityFolderPath, `${id}.json`);
        const fileData = fs.readFileSync(filePath, "utf8");
        return JSON.parse(fileData);
    } catch (e) {
        if (e.code === "ENOENT") {
            return null;
        }
        throw { code: "failedToGetActivity", message: e.message };
    }
}

function list(){
    const files = fs.readdirSync(activityFolderPath);
    const activityList = files.map(file => {
        let fileData = fs.readFileSync(path.join(activityFolderPath, file), "utf8");
        fileData = JSON.parse(fileData);
        return fileData;
    })
    return activityList;
}

function update(activity){
    try {
        const filePath = path.join(activityFolderPath, `${activity.id}.json`);
        const fileData = JSON.stringify(activity);
        fs.writeFileSync(filePath, fileData, "utf8");
        return activity;
    } catch (e) {
        if (e.code === "ENOENT") {
            return null;
        }
        throw { code: "failedToUpdateActivity", message: e.message };
    }
}

function deleteActivity(id) {
    try {
        const filePath = path.join(activityFolderPath, `${id}.json`);
        fs.unlinkSync(filePath);
        return {};
    } catch (e) {
        if (e.code === "ENOENT") {
            return null;
        }
        throw { code: "failedToDeleteActivity", message: e.message };
    }
}

module.exports = {
    create,
    getById,
    list,
    update,
    deleteActivity,
}