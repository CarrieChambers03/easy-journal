function validateIcon(icon){
    const iconRegex = /^U\+[0-9A-Fa-f]{1,5}$/;
    return iconRegex.test(icon);
};

module.exports = validateIcon;