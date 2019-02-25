const dataBase = require('../../dataBase').getInstance();
const tokenVerifiactor = require('../../helper/tokenVerificator');
const {secret} = require('../../config/secrets');
const {ADMIN_ROLES} = require('../../constants/values');


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
        if (!ADMIN_ROLES.includes(role)) throw new Error('You are noy admin');

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