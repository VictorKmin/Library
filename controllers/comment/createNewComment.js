const dataBase = require('../../dataBase').getInstance();
const tokenVerifiactor = require('../../helper/tokenVerificator');
const secret = require('../../config/secrets').secret;
const getAllComments = require('../../controllers/comment/getAllBookComments');
module.exports = async (req, res) => {
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

        const allComments = getAllComments(bookId, 5);

        res.json({
            success: true,
            message: 'Comment is crated'
        });

        /**
         * I have socket in request. If all fine
         * I emit event with comments and catch this Event on Angular
         */
        req.io.sockets.emit('comments', allComments)

    } catch (e) {
        console.log(e.message);
        res.json({
            success: false,
            message: e.message
        })
    }
};