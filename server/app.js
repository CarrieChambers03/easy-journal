const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
const port = 8000;

const journalEntryController = require("./controller/journalEntry.js");
const userController = require("./controller/user.js");
const roleController = require("./controller/role.js");
const moodController = require("./controller/mood.js");
const activityController = require("./controller/activity.js");
const verifyJWT = require("./middleware/verifyJWT.js");
const authenticate = require("./abl/auth.js");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: "http://localhost:5000",
    credentials: true
}));
app.use(cookieParser());

app.use("/journalEntry", verifyJWT, journalEntryController);
app.use("/user", userController);
app.use("/role", roleController);
app.use("/mood", moodController);
app.use("/activity", activityController);
app.get("/authenticate", authenticate);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});