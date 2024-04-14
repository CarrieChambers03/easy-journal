function validatePassword(password){
    const passwordRegex = /^[^\s]{8,}$/;
    return passwordRegex.test(password);
};

module.exports = validatePassword;