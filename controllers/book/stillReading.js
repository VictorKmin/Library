const chalk = require('chalk');
const dataBase = require('../../dataBase').getInstance();
const tokenVerifiactor = require('../../helper/tokenVerificator');
const secret = require('../../config/secrets').secret;
const MILLISECONDS_ID_DAY = require('../../constants/values').MILLISECONDS_ID_DAY;
const getBookById = require('../../controllers/book/getBookById');

module.exports = async (req, res) => {
    try {
        const BookStatModel = dataBase.getModel('BookStat');
        const ReaddingActvityModel = dataBase.getModel('ReadingActivity');
        const {bookId} = req.body;
        if (!bookId) throw new Error('Bad request');
        const token = req.get('Authorization');
        if (!token) throw new Error('No token');
        const {id: userId} = tokenVerifiactor(token, secret);

        const bookStat = await BookStatModel.findOne({
            where: {
                book_id: bookId,
                user_id: userId
            }
        });
        if (!bookStat) throw new Error('Book not find');

        const {back_time, is_delaying} = bookStat.dataValues;
        if (is_delaying) throw new Error('U already delay this book');
        const newDate = new Date(back_time).getTime() + 14 * MILLISECONDS_ID_DAY;

        await BookStatModel.update({
            back_time: newDate,
            is_delaying: true,
            notification_count: 0
        }, {
            where: {
                book_id: bookId,
                user_id: userId
            }
        });

        // Insert record into statistic activity table
        await ReaddingActvityModel.create({
            user_id: userId,
            book_id: bookId,
            continue_read: true,
            created_at: new Date().toISOString()
        });

        console.log(chalk.magenta(`User with id ${userId} still reading book ${bookId}`));

        const book = await getBookById(bookId);

        res.json({
            success: true,
            message: 'Book time is changed'
        });

        req.io.sockets.emit('book', book);

    } catch (e) {
        console.log(e);
        res.json({
            success: false,
            message: e.message
        })
    }
};