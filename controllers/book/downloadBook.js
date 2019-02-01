const chalk = require('chalk');
const DataBase = require('../../dataBase').getInstance();
const tokenVerifiactor = require('../../helper/tokenVerificator');
const secret = require('../../config/secrets').secret;

module.exports = async (req, res) => {
    try {
        const BookModel = DataBase.getModel('Book');
        const DigitalModel = DataBase.getModel('DigitalInfo');
        const token = req.get('Authorization');
        if (!token) throw new Error('No token');
        const {id} = tokenVerifiactor(token, secret);
        const bookId = req.params.id;
        if (!bookId) throw new Error('Please select book first');
        const isBookPresent = await BookModel.findByPk(bookId);
        if (!isBookPresent) throw new Error('Book not found');
        if (!isBookPresent.dataValues.is_digital) throw new Error('Book is not digital');

        const bookInfo = await DigitalModel.findAll({
            where: {
                book_id: bookId
            }
        });

        if (!bookInfo) throw new Error('No files');

        res.json({
            success: true,
            message: bookInfo
        })
    } catch
        (e) {
        console.log(e);
        res.json({
            success: false,
            message: e.message
        })
    }
}
;