const dataBase = require('../../dataBase').getInstance();
const tokenVerifiactor = require('../../helper/tokenVerificator');
const secret = require('../../config/secrets').secret;

/**
 * This method using for delete comment by ID
 * If user role is not admin (1) we throw error
 * We need to delete all comments activity too
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
module.exports = async (req, res) => {
    try {
        const CommentModel = dataBase.getModel('Comment');
        const User = dataBase.getModel('User');
        const CommentActivityModel = dataBase.getModel('CommentActivity');
        const token = req.get('Authorization');
        if (!token) throw new Error('No token');
        const commentId = req.params.id;
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
        const allComments = await CommentModel.findAll({
            where: {
                book_id
            },
            order: [["created_at", 'DESC']],
            include: [User]
        });

        res.json({
            success: true,
            message: 'Comment is deleted'
        });

        /**
         * I have socket in request. If all fine
         * I emit event with comments and catch this Event on Angular
         */
        req.io.sockets.emit('comments' , allComments)

    } catch (e) {
        console.log(e.message);
        res.json({
            success: false,
            message: e.message
        })
    }
};