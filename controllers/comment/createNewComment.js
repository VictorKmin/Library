const DataBase = require('../../DataBase').getInstance();
const tokenVerifiactor = require('../../helper/tokenVerificator');
const dateBuilder = require('../../helper/dateBuilder');
const secret = require('../../config/secrets').secret;
module.exports = async (req, res) => {
    try {
        const CommentModel = DataBase.getModel('Comment');
        const token = req.get('Authorization');
        if (!token) throw new Error('No token');
        const {id, email} = tokenVerifiactor(token, secret);
        const fulldate = dateBuilder();
        const {bookId, comment} = req.body;

        await CommentModel.create({
            authorid: id,
            fulldate,
            comment,
            bookid: bookId
        });

        // EMIT EVENT
        res.json({
            success: true,
            message: 'OK'
        })
    } catch (e) {
        console.log(e);
        res.json({
            success: false,
            message: e.message
        })
    }
};