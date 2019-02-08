const DataBase = require('../../dataBase').getInstance();
const tokenVerifiactor = require('../../helper/tokenVerificator');
const secret = require('../../config/secrets').secret;
module.exports = async (req, res) => {
    try {
        const CommentModel = DataBase.getModel('Comment');
        const token = req.get('Authorization');
        if (!token) throw new Error('No token');
        const {role} = tokenVerifiactor(token, secret);
        if (role !== 1) throw new Error('You are not admin');
        const id = req.params.id;
        if (!id) throw new Error('Bad request');
        const {comment} = req.body;

        const isCommentPresent = await CommentModel.findOne({
            where: {
                id
            }
        });

        if (!isCommentPresent) throw new Error('Comment not found');

        await CommentModel.update({
            comment
        }, {
            where: {
                id
            }
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