const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if(!authHeader){return res.sendStatus(401).json( { message: "unauthorized" })}
    const token = authHeader.split(' ')[1];

    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decToken) => {
            if (err) { return res.status(403).json({ message: "unauthorized", error: err.message }) }
            req.user = decToken.id;
            next();
        }
    )
};

module.exports = verifyJWT;