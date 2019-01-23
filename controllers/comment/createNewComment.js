const DataBase = require('../../dataBase').getInstance();
const tokenVerifiactor = require('../../helper/tokenVerificator');
const secret = require('../../config/secrets').secret;
module.exports = async (req, res) => {
    try {
        const CommentModel = DataBase.getModel('Comment');
        const token = req.get('Authorization');
        if (!token) throw new Error('No token');
        const {id, email} = tokenVerifiactor(token, secret);
        console.log(id);
        const {bookId, comment} = req.body;

        await CommentModel.create({
            user_id: id,
            created_at: new Date().toISOString(),
            comment,
            book_id: bookId
        });

        res.json({
            success: true,
            message: 'Comment is crated'
        })
    } catch (e) {
        console.log(e.message);
        res.json({
            success: false,
            message: e.message
        })
    }
};