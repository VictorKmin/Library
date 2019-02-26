const chalk = require('chalk');
const dataBase = require('../../dataBase').getInstance();
const secret = require('../../config/secrets').secret;
const tokenVerifiactor = require('../../helper/tokenVerificator');
const {ADMIN_ROLES} = require('../../constants/values')
module.exports = async (body) => {
    try {

        const {bookId, token} = body;
        if (!bookId) throw new Error('Something wrong with URL');
        if (!token) throw new Error('No token');

        const BookStatModel = dataBase.getModel('BookStat');
        const BookModel = dataBase.getModel('Book');
        const ReaddingActvityModel = dataBase.getModel('ReadingActivity');

        const {id: userId, role} = tokenVerifiactor(token, secret);

        const isBookPresent = await BookStatModel.findOne({
            where: {
                book_id: bookId
            }
        });

        if (!isBookPresent) throw new Error('Bad request');

        const {user_id} = isBookPresent.dataValues;

        if (user_id !== userId && !ADMIN_ROLES.includes(role)) throw new Error('You have not permissions');

        const deletedBook = await BookStatModel.destroy({
            where: {
                book_id: bookId,
            }
        });

        if (!deletedBook) throw new Error('Book not found');

        await BookModel.update({
            is_reading: false
        }, {
            where: {
                id: bookId
            }
        });

        // Insert record into statistic activity table
        await ReaddingActvityModel.create({
            user_id: userId,
            book_id: bookId,
            get_back: true,
            created_at: new Date().toISOString()
        });

        console.log(chalk.magenta(`User ${userId} return book ${bookId}`));


    } catch (e) {
        console.log(e);
    }
};