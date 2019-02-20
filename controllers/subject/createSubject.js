const dataBase = require('../../dataBase').getInstance();
const tokenVerifiactor = require('../../helper/tokenVerificator');
const secret = require('../../config/secrets').secret;

module.exports = async (body) => {
    try {
        console.log(body);
        const {subject, token} = body;
        if (!token || !subject) throw new Error('Bad request');
        const {role} = tokenVerifiactor(token, secret);
        if (role !== 1) throw new Error('U r not admin');
        const SubjectModel = dataBase.getModel('Subject');

        await SubjectModel.create({
            subject
        });

    } catch (e) {
        console.log(e);
    }
};