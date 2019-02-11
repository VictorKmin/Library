const chalk = require('chalk');
const dataBase = require('../../dataBase').getInstance();
const secret = require('../../config/secrets').secret;
const tokenVerifiactor = require('../../helper/tokenVerificator');

module.exports = async (req, res) => {
    try {
        const BookStatModel = dataBase.getModel('BookStat');
        const BookModel = dataBase.getModel('Book');
        const ReaddingActvityModel = dataBase.getModel('ReadingActivity');

        const bookId = req.params.id;
        if (!bookId) throw new Error('Something wrong with URL');
        const token = req.get('Authorization');
        if (!token) throw new Error('No token');
        const {id: userId} = tokenVerifiactor(token, secret);

        const book = await BookStatModel.destroy({
            where: {
                book_id: bookId,
                user_id: userId
            }
        });

        console.log(book);
        if (!book) throw new Error('Book not found');

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

        res.json({
            success: true,
            message: 'Book successful updated'
        })
    } catch (e) {
        console.log(e);
        res.json({
            success: false,
            message: e.message
        })
    }
};