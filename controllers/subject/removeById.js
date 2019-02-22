const dataBase = require('../../dataBase').getInstance();
const tokenVerifiactor = require('../../helper/tokenVerificator');
const {secret} = require('../../config/secrets');
const {ADMIN_ROLES, BLOCKED_ROLES} = require('../../constants/values');

module.exports = async (body) => {
    try {
        const {subjectId, token} = body;

        if (!token || !subjectId) throw new Error('Bad request');
        const {role} = tokenVerifiactor(token, secret);
        if (!ADMIN_ROLES.includes(role)) throw new Error('You are noy admin');

        const SubjectModel = dataBase.getModel('Subject');
        const subjectsToRemove = await SubjectModel.findById(subjectId);
        if (!subjectsToRemove) throw new Error('Subject not found');

        await SubjectModel.destroy({
            where: {
                id: subjectId
            }
        });

    } catch (e) {
        console.log(e);
    }
};