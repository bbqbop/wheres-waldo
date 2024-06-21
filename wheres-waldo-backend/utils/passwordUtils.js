const bcrypt = require('bcrypt');

function generatePassword(password){
    return bcrypt.hash(password, 10)
};

function verifyPassword(password, hash){
    return bcrypt.compare(password, hash)
}

module.exports = {
    generatePassword,
    verifyPassword,
}