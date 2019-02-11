const dataBase = require('../../dataBase').getInstance();
const tokenVerifiactor = require('../../helper/tokenVerificator');
const secret = require('../../config/secrets').secret;
module.exports = async (req, res) => {
    try {
        const CommentModel = dataBase.getModel('Comment');
        const CommentActivityModel = dataBase.getModel('CommentActivity');
        const token = req.get('Authorization');
        if (!token) throw new Error('No token');
        const {role, id: userId} = tokenVerifiactor(token, secret);
        if (role !== 1) throw new Error('You are not admin');
        const commentId = req.params.id;
        if (!commentId) throw new Error('Bad request');
        const {comment: newComment} = req.body;

        const isCommentPresent = await CommentModel.findOne({
            where: {
                id: commentId
            }
        });

        if (!isCommentPresent) throw new Error('Comment not found');

        const {comment: oldComment, book_id} = isCommentPresent.dataValues;

        await CommentModel.update({
            comment: newComment
        }, {
            where: {
                id: commentId
            }
        });

        // Insert record into statistic activity table
        await CommentActivityModel.create({
            book_id,
            comment_id: commentId,
            user_id: userId,
            is_update: true,
            old_comment: oldComment,
            new_comment: newComment,
            created_at: new Date().toISOString()
        });


        res.json({
            success: true,
            message: 'Comment is updated'
        })
    } catch (e) {
        console.log(e.message);
        res.json({
            success: false,
            message: e.message
        })
    }
};