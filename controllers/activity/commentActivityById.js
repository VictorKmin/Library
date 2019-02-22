const dataBase = require('../../dataBase').getInstance();
const tokenVerifiactor = require('../../helper/tokenVerificator');
const secret = require('../../config/secrets').secret;
const {ADMIN_ROLES, BLOCKED_ROLES} = require('../../constants/values');

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
        if (!ADMIN_ROLES.includes(role)) throw new Error('You are noy admin');
        if (BLOCKED_ROLES.includes(role)) throw new Error('You have not permissions');

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