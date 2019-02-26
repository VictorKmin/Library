const dataBase = require('../../dataBase').getInstance();
const tokenVerificatpr = require('../../helper/tokenVerificator');
const {secret} = require('../../config/secrets');
const {BLOCKED_ROLES} = require('../../constants/values');
const chalk = require('chalk');

module.exports = async (body) => {
    try {
        const {token, bookId} = body;
        if (!token || !bookId) throw new Error('Body is not correct');
        let {role, id: user_id} = tokenVerificatpr(token, secret);
        if (BLOCKED_ROLES.includes(role)) throw new Error('You have not permissions');
        const RatingModel = dataBase.getModel('Rating');

        await RatingModel.destroy({
            where: {
                user_id,
                book_id: bookId
            }
        });

        console.log(chalk.green(`Vote on book ${bookId} is deleted by user ${user_id}`));

    } catch (e) {
        console.log(e);
    }
};