const jwt = require("jsonwebtoken");
require("dotenv").config();
const userDao = require("../../dao/user-dao.js");

function handleRefreshToken (req, res){
    const cookies = req.cookies;
    if(!cookies?.jwt){
        return res.sendStatus(401)
    }

    const refreshToken = cookies.jwt;
    const userList = userDao.list();
    const user = userList.find(u => u.refreshToken === refreshToken);
    if(!user){
        return res.status(403)
    }

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decToken) => {
            if(err || user.id !== decToken.id){
                return res.sendStatus(403)
            };
            const accessToken = jwt.sign(
                { id: decToken.id },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: "5m" }
            );
            res.status(200).cookie("access", accessToken, { httpOnly: true, secure: true, sameSite: "None", maxAge: 5 * 60 * 1000 });
        }
    );
}

module.exports = handleRefreshToken;