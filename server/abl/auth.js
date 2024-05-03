const jwt = require('jsonwebtoken');
require("dotenv").config();
const userDao = require('../dao/user-dao.js');

function authenticate(req, res){
    const cookies = req.cookies;
    const auth = {
        auth: false,
        user: null
    };
    if(!cookies?.access){
        res.json(auth);
        return;
    }

    try{
        const decToken = jwt.verify(cookies.access, process.env.ACCESS_TOKEN_SECRET);
        req.user = decToken.id;
        auth.user = userDao.getById(decToken.id);
        if(!auth.user){
            res.json(auth);
            return;
        }
        delete auth.user.password;
        auth.auth = true;
    } catch (err) {
        console.error(err);
        res.json(auth);
        return;
    }

    res.json(auth);

}

module.exports = authenticate;