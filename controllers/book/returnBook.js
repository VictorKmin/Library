const chalk = require('chalk');
const dataBase = require('../../dataBase').getInstance();
const secret = require('../../config/secrets').secret;
const tokenVerifiactor = require('../../helper/tokenVerificator');
// const getBookById = require('../../controllers/book/getBookById');

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

        if (user_id !== userId && role !== 1) throw new Error('Bad request');

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
        //
        // const book = await getBookById(bookId);
        //
        // res.json({
        //     success: true,
        //     message: 'Book successful updated'
        // });
        //
        // const io = req.io;
        // const s = req.s;
        // io.emit('book', book);

    } catch (e) {
        console.log(e);
        // res.json({
        //     success: false,
        //     message: e.message
        // })
    }
};