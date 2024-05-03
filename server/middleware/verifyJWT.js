const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyJWT = (req, res, next) => {
    const cookies = req.cookies;
    if(!cookies?.access){
        return res.sendStatus(401)
    }
    const token = cookies.access;
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