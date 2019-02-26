const dataBase = require('../../dataBase').getInstance();
const {BLOCKED_ROLES} = require('../../constants/values');
const tokenVerificator = require('../../helper/tokenVerificator');
const {secret} = require('../../config/secrets');
const chalk = require('chalk');

module.exports = async body => {
    try {
        const {token} = body;
        const {id: userId, role} = tokenVerificator(token, secret);
        if (BLOCKED_ROLES.includes(role)) throw new Error('U have not permissions');

        const ReadingActivityModel = dataBase.getModel('ReadingActivity');
        const BookModel = dataBase.getModel('Book');

        const bookInfo = await ReadingActivityModel.findAll({
            where: {
                user_id: userId,
                get_back: false
            }
        });

        const booKIdtoSearch = bookInfo.map(book => book.dataValues.book_id);

        const allReadedBooks = await BookModel.findAll({
            where: {
                is_reading: true,
                id: booKIdtoSearch
            }
        });

        console.log(chalk.green(`User ${userId} get his readed books`));
        return allReadedBooks;

    } catch (e) {
        console.log(e);
    }
};