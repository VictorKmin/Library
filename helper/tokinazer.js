const jwt = require('jsonwebtoken');
const secretWorld = require('../config/secrets').secret;
const refreshSecret = require('../config/secrets').refreshSecret;


module.exports.accessAndRefresh = (id, email, role) => {
    const accessToken = jwt.sign({id, role}, secretWorld, {expiresIn: 9999999});
    const refreshToken = jwt.sign({id, email, role}, refreshSecret, {expiresIn: 999999999999});
    const tokens = {
        accessToken,
        refreshToken
    };
    if (!tokens) throw new Error('TOKEN WAS NOT CREATED');
    return tokens;
};