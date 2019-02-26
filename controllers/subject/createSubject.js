const dataBase = require('../../dataBase').getInstance();
const tokenVerifiactor = require('../../helper/tokenVerificator');
const {secret} = require('../../config/secrets');
const {ADMIN_ROLES} = require('../../constants/values');
const chalk = require('chalk');

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
        console.log(chalk.green(`New subject is created`));

    } catch (e) {
        console.log(e);
    }
};