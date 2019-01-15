const crypto = require('bcrypt');

module.exports = (password)=> {
    if (!password) throw new Error('Please enter password first');
    let pass = crypto.createHash('md5').update(password).digest('hex');
    if (!pass) throw new Error('Cant protect your password');
    return pass
};