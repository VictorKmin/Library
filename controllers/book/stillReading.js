const chalk = require('chalk');
const dataBase = require('../../dataBase').getInstance();
const MILLISECONDS_ID_DAY = require('../../constants/values').MILLISECONDS_ID_DAY;

module.exports = async (req, res) => {
    try {
        const {bookId, userId} = req.body;
        if (!bookId || !userId) throw new Error('Something wrong with body');
        const BookStatModel = dataBase.getModel('BookStat');

        const book = await BookStatModel.findOne({
            where: {
                book_id: bookId,
                user_id: userId
            }
        });
        if (!book) throw new Error('Book not find');

        const {back_time} = book.dataValues;
        const newDate = new Date(back_time).getTime() + 14 * MILLISECONDS_ID_DAY;

        await BookStatModel.update({
            back_time: newDate,
            is_delaying: true
        }, {
            where: {
                book_id: bookId,
                user_id: userId
            }
        });

        console.log(chalk.magenta(`User with id ${userId} still reading book ${bookId}`));

        res.json({
            success: true,
            message: 'Book time is changed'
        })
    } catch (e) {
        console.log(e);
        res.json({
            success: false,
            message: e.message
        })
    }
};