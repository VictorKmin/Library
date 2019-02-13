const dataBase = require('../../dataBase').getInstance();
const tokenVerifiactor = require('../../helper/tokenVerificator');
const secret = require('../../config/secrets').secret;
module.exports = async (req, res, next) => {
    try {
        const CommentModel = dataBase.getModel('Comment');
        const CommentActivity = dataBase.getModel('CommentActivity');
        const User = dataBase.getModel('User');

        const token = req.get('Authorization');
        if (!token) throw new Error('No token');
        const {id: userId} = tokenVerifiactor(token, secret);
        const {bookId, comment} = req.body;

        const createdComment = await CommentModel.create({
            user_id: userId,
            created_at: new Date().toISOString(),
            comment,
            book_id: bookId
        });

        const {id: commentId} = createdComment.dataValues;

        await CommentActivity.create({
            book_id: bookId,
            comment_id: commentId,
            user_id: userId,
            is_create: true,
            old_comment: '',
            new_comment: comment,
            created_at: new Date().toISOString()
        });

        const allComments = await CommentModel.findAll({
            where: {
                book_id: bookId
            },
            order: [["created_at", 'DESC']],
            include: [User]
        });

        res.json({
            success: true,
            message: 'Comment is crated'
        });

        req.io.sockets.emit('allComments' , {
            success: true,
            message: allComments
        })

    } catch (e) {
        console.log(e.message);
        res.json({
            success: false,
            message: e.message
        })
    }
};