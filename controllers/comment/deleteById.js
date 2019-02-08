const DataBase = require('../../dataBase').getInstance();
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
        const CommentModel = DataBase.getModel('Comment');
        const CommentActivityModel = dataBase.getModel('CommentActivity');
        const token = req.get('Authorization');
        if (!token) throw new Error('No token');
        const id = req.params.id;
        if (!id) throw new Error('Bad request');
        const {role} = tokenVerifiactor(token, secret);
        if (role !== 1) throw new Error('You are not admin');

        const isCommentPresent = await CommentModel.findOne({
            where: {
                id
            }
        });

        if (!isCommentPresent) throw new Error('Comment not found');

        await CommentActivityModel.destroy({
            where: {
                comment_id: id
            }
        });

        await CommentModel.destroy({
            where: {
                id
            }
        });

        res.json({
            success: true,
            message: 'Comment is deleted'
        })
    } catch (e) {
        console.log(e.message);
        res.json({
            success: false,
            message: e.message
        })
    }
};