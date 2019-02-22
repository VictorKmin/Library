const dataBase = require('../../dataBase').getInstance();
const tokenVerifiactor = require('../../helper/tokenVerificator');
const {secret} = require('../../config/secrets');
const {ADMIN_ROLES, BLOCKED_ROLES} = require('../../constants/values');

module.exports = async (body) => {
    try {
        console.log(body);
        const {subject, token} = body;
        if (!token || !subject) throw new Error('Bad request');
        const {role} = tokenVerifiactor(token, secret);
        if (!ADMIN_ROLES.includes(role)) throw new Error('You are noy admin');

        const SubjectModel = dataBase.getModel('Subject');

        await SubjectModel.create({
            subject
        });

    } catch (e) {
        console.log(e);
    }
};