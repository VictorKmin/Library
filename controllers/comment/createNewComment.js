const dataBase = require('../../dataBase').getInstance();
const tokenVerifiactor = require('../../helper/tokenVerificator');
const secret = require('../../config/secrets').secret;
module.exports = async (comment, bookId, token) => {
    try {
        const CommentModel = dataBase.getModel('Comment');
        const CommentActivity = dataBase.getModel('CommentActivity');

        if (!token) throw new Error('No token');
        const {id: userId} = tokenVerifiactor(token, secret);

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

    } catch (e) {
        console.log(e.message);
    }
};