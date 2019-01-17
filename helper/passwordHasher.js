const bcrypt = require('bcrypt');

module.exports = (pass) => {
    const saltRounds = 10;
    bcrypt.genSalt(saltRounds, function (err, salt) {
        bcrypt.hash(pass, salt, function (err, hash) {
            if (err) throw new Error(err.message);
            console.log(hash);
            return hash
        });
    });
};
