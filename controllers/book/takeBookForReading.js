const chalk = require('chalk');
const DataBase = require('../../dataBase').getInstance();
const tokenVerifiactor = require('../../helper/tokenVerificator');
const secret = require('../../config/secrets').secret;

module.exports = async (req, res) => {
    try {
        const BookModel = DataBase.getModel('Book');
        const BookStatModel = DataBase.getModel('BookStat');
        const token = req.get('Authorization');
        if (!token) throw new Error('No token');
        const {id} = tokenVerifiactor(token, secret);
        const bookId = req.params.id;

        const backTime = new Date(Date.now() + 86400000 * 31).toISOString();

        await BookModel.update({
            is_reading: true,
        }, {
            where: {
                id: bookId
            }
        });

        await BookStatModel.create({
            book_id: bookId,
            user_id: id,
            get_time: new Date().toISOString(),
            back_time: backTime
        });
        console.log(chalk.magenta(`User ${id} get book ${bookId} for reading`));
        res.json({
            success: true,
            message: 'Book status is changed'
        })
    } catch
        (e) {
        console.log(e);
        res.json({
            success: false,
            message: e.message
        })
    }
};