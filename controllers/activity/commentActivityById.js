const dataBase = require('../../dataBase').getInstance();
const tokenVerifiactor = require('../../helper/tokenVerificator');
const secret = require('../../config/secrets').secret;

/**
 * This method using for get all comment of book
 * We get info about add new comment and update old comments.
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
module.exports = async (req, res) => {
    try {
        const bookId = req.params.id;
        if (!bookId) throw new Error('Bad request');
        const CommentModel = dataBase.getModel('CommentActivity');
        const UserModel = dataBase.getModel('User');
        const token = req.get('Authorization');
        if (!token) throw new Error('Not authorized');
        const {role} = tokenVerifiactor(token, secret);
        if (role !== 1) throw new Error('Bad credentials');

        // SELECT * FROM reading_activity JOIN user ON ***** ORDER BY created_at DESC
        let commentActivity = await CommentModel.findAll({
            where: {
                book_id: bookId
            },
            include: [{
                model: UserModel,
                attributes: ['name']
            }],
            order: [['created_at', 'DESC']]
        });

        res.json({
            success: true,
            message: commentActivity
        })
    } catch (e) {
        console.log(e);
        res.json({
            success: false,
            message: e.message
        })
    }
};