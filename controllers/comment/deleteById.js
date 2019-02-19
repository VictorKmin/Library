const dataBase = require('../../dataBase').getInstance();
const tokenVerifiactor = require('../../helper/tokenVerificator');
const secret = require('../../config/secrets').secret;

/**
 * This method using for delete comment by ID
 * If user role is not admin (1) we throw error
 * We need to delete all comments activity too
 * @returns {Promise<void>}
 * @param commentId
 * @param token
 */
module.exports = async (commentId, token) => {
    try {
        const CommentModel = dataBase.getModel('Comment');
        const CommentActivityModel = dataBase.getModel('CommentActivity');
        if (!token) throw new Error('No token');
        if (!commentId) throw new Error('Bad request');
        const {role} = tokenVerifiactor(token, secret);
        if (role !== 1) throw new Error('You are not admin');

        const isCommentPresent = await CommentModel.findOne({
            where: {
                id: commentId
            }
        });

        if (!isCommentPresent) throw new Error('Comment not found');

        const {book_id} = isCommentPresent.dataValues;

        await CommentActivityModel.destroy({
            where: {
                comment_id: commentId
            }
        });

        await CommentModel.destroy({
            where: {
                id: commentId
            }
        });

        return book_id;

    } catch (e) {
        console.log(e.message);
    }
};