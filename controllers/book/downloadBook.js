const DataBase = require('../../dataBase').getInstance();
const tokenVerifiactor = require('../../helper/tokenVerificator');
const secret = require('../../config/secrets').secret;
const {ADMIN_ROLES, BLOCKED_ROLES} = require('../../constants/values');

module.exports = async (req, res) => {
    try {
        const BookModel = DataBase.getModel('Book');
        const DigitalModel = DataBase.getModel('DigitalInfo');
        const token = req.get('Authorization');
        if (!token) throw new Error('No token');
        const {role} = tokenVerifiactor(token, secret);
        const bookId = req.params.id;
        if (!bookId) throw new Error('Please select book first');
        const isBookPresent = await BookModel.findByPk(bookId);
        if (!isBookPresent) throw new Error('Book not found');
        if (!isBookPresent.dataValues.is_digital) throw new Error('Book is not digital');
        if (BLOCKED_ROLES.includes(role)) throw new Error('You have not permissions');

        const bookInfo = await DigitalModel.findAll({
            where: {
                book_id: bookId
            }
        });

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