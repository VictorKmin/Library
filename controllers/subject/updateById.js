const dataBase = require('../../dataBase').getInstance();
const tokenVerifiactor = require('../../helper/tokenVerificator');
const secret = require('../../config/secrets').secret;

module.exports = async (body) => {
    try {
        console.log(body);
        const {subjectId, subject, token} = body;
        if (!token || !subjectId || !subject) throw new Error('Bad request');
        const {role} = tokenVerifiactor(token, secret);
        if (role !== 1) throw new Error('U r not admin');
        const SubjectModel = dataBase.getModel('Subject');
        const subjectsToUpdate = await SubjectModel.findById(subjectId);
        if (!subjectsToUpdate) throw new Error('Subject not found');

        await SubjectModel.update({
            subject
        }, {
            where: {
                id: subjectId
            }
        });

    } catch (e) {
        console.log(e);
    }
};