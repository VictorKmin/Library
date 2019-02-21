const crypto = require('crypto');
const requestPromise = require('request-promise');
const {ENCRYPT_METHOD, FIRST_SECRET, SECOND_SECRET, HR_HOST} = require('../config/HRSystemInfo');
/**
 *
 * @param email
 * @param password
 * @returns {Promise<void>}
 */
module.exports = async (email, password) => {
    const encrypt = function (plain_text, encryptionMethod, secret, iv) {
        const encryptor = crypto.createCipheriv(encryptionMethod, secret, iv);
        return encryptor.update(plain_text, 'utf8', 'base64')
            + encryptor.final('base64');
    };

    const decrypt = function (encryptedMessage, encryptionMethod, secret, iv) {
        const decryptor = crypto.createDecipheriv(encryptionMethod, secret, iv);
        return decryptor.update(encryptedMessage, 'base64', 'utf8')
            + decryptor.final('utf8');
    };

    const firstIV = FIRST_SECRET.substr(0, 16);
    const secondIV = SECOND_SECRET.substr(0, 16);

    const encryptedEmail = encrypt(email, ENCRYPT_METHOD, FIRST_SECRET, firstIV);
    const encryptedPassword = encrypt(password, ENCRYPT_METHOD, FIRST_SECRET, firstIV);

    const firstRequestOptions = {
        method: 'POST',
        uri: `${HR_HOST}/api/users`,
        body: {
            "email": encryptedEmail,
            "password": encryptedPassword
        },
        json: true
    };

    let firstHRResponse = await requestPromise(firstRequestOptions);

    if (!firstHRResponse) throw new Error('HR System return FALSE');

    const decryptedMessage = decrypt(firstHRResponse, ENCRYPT_METHOD, FIRST_SECRET, firstIV);
    const encryptedSec = encrypt(decryptedMessage, ENCRYPT_METHOD, SECOND_SECRET, secondIV);


    // "parameters":"name,position,email,phone_office,phone_personal,photo,email_personal,start_work,finish_work,role"
    const secondRequestOptions = {
        method: 'POST',
        uri: `${HR_HOST}/api/token`,
        body: {
            "token": encryptedSec,
            "parameters": "name,position,email,role"
        },
        json: true
    };

    let infoAboutUser = await requestPromise(secondRequestOptions);

    console.log(infoAboutUser);

    return infoAboutUser
};