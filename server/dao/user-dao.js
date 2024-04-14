const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const bcrypt = require("bcrypt");

const userFolderPath = path.join(__dirname, "storage", "userList");

//method to write a user to a file
async function create(user){
    try {
        user.id = crypto.randomBytes(16).toString("hex");
        user.journalEntryList = [];
        user.password = await bcrypt.hash(user.password, 10);

        const filePath = path.join(userFolderPath, `${user.id}`);
        const fileData = JSON.stringify(user);
        fs.writeFileSync(filePath, fileData, "utf8");
        return user;
    } catch (e) {
        throw { code: "failedToCreateUser", message: e.message };
    }
};

//method to list all users in the folder
function list(){
    const files = fs.readdirSync(userFolderPath);
    const userList = files.map(file => {
        let fileData = fs.readFileSync(path.join(userFolderPath, file), "utf8");
        fileData = JSON.parse(fileData);
        delete fileData.password;
        return fileData;
    });
    return userList;
};

function login(userID, token){
    const filePath = path.join(userFolderPath, `${userID}`);
    let fileData = fs.readFileSync(filePath);
    fileData = JSON.parse(fileData);
    fileData.refreshToken = token;
    fs.writeFileSync(filePath, JSON.stringify(fileData), "utf8");
}

function getById(id){
    try {
        const filePath = path.join(userFolderPath, `${id}`);
        const fileData = fs.readFileSync(filePath, "utf8");
        return JSON.parse(fileData);
    } catch (e) {
        if (e.code === "ENOENT"){ return null; }
        throw { code: "failedToGetUser", message: e.message };
    }
}

function update(user){
    try {
        if (user.password !== getById(user.id).password){
            user.password = bcrypt.hashSync(user.password, 10);
        }
        const filePath = path.join(userFolderPath, `${user.id}`);
        const fileData = JSON.stringify(user);
        fs.writeFileSync(filePath, fileData, "utf8");
        return user;
    } catch (e) {
        if (e.code === "ENOENT"){ return null; }
        throw { code: "failedToUpdateUser", message: e.message };
    }
}

module.exports = {
    userFolderPath,
    create,
    list,
    login,
    getById,
    update,
};