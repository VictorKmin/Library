const dataBase = require('../../dataBase').getInstance();
const tokenVerifiactor = require('../../helper/tokenVerificator');
const secret = require('../../config/secrets').secret;

module.exports = async (body) => {
    try {
        const {subjectId, token} = body;

        if (!token || !subjectId) throw new Error('Bad request');
        const {role} = tokenVerifiactor(token, secret);
        if (role !== 1) throw new Error('U r not admin');
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