const chalk = require('chalk');
const dataBase = require('../../dataBase').getInstance();
const tokenVerifiactor = require('../../helper/tokenVerificator');
const {secret} = require('../../config/secrets');
const {ADMIN_ROLES, BLOCKED_ROLES, MILLISECONDS_ID_DAY} = require('../../constants/values');

const getBookById = require('../../controllers/book/getBookById');

module.exports = async (req, res) => {
    try {
        const BookModel = dataBase.getModel('Book');
        const BookStatModel = dataBase.getModel('BookStat');
        const ReaddingActvityModel = dataBase.getModel('ReadingActivity');
        const token = req.get('Authorization');
        if (!token) throw new Error('No token');
        const {id: userId, role} = tokenVerifiactor(token, secret);
        const bookId = req.params.id;

        if (BLOCKED_ROLES.includes(role)) throw new Error('You have not permissions');

        const backTime = new Date(Date.now() + MILLISECONDS_ID_DAY * 31).toISOString();

        await BookModel.update({
            is_reading: true,
        }, {
            where: {
                id: bookId
            }
        });

        await BookStatModel.create({
            book_id: bookId,
            user_id: userId,
            get_time: new Date().toISOString(),
            back_time: backTime
        });

        // Insert record into statistic activity table
        await ReaddingActvityModel.create({
            user_id: userId,
            book_id: bookId,
            take_read: true,
            created_at: new Date().toISOString()
        });

        console.log(chalk.magenta(`User ${userId} get book ${bookId} for reading`));

        const book = await getBookById(bookId);

        res.json({
            success: true,
            message: 'Book status is changed'
        });

        req.io.sockets.emit('book', book);

    } catch
        (e) {
        console.log(e);
        res.json({
            success: false,
            message: e.message
        })
    }
};