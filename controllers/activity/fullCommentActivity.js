const dataBase = require('../../dataBase').getInstance();
const tokenVerifiactor = require('../../helper/tokenVerificator');
const secret = require('../../config/secrets').secret;

/**
 * Method for get all comment activity.
 * When we select info from data base we join it to book and user model
 * For get full info about action
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
module.exports = async (req, res) => {
    try {
        const CommentActivityModel = dataBase.getModel('CommentActivity');
        const UserModel = dataBase.getModel('User');
        const BookModel = dataBase.getModel('Book');
        const token = req.get('Authorization');
        if (!token) throw new Error('Not authorized');
        const {role} = tokenVerifiactor(token, secret);
        if (role !== 1) throw new Error('Bad credentials');

        // SELECT * FROM comment_activity JOIN user JOIN book ON ***** ORDER BY created_at DESC
        let readingActivity = await CommentActivityModel.findAll({
            include: [{
                model: UserModel,
                attributes: ['name']
            }, {
                model: BookModel,
                attributes: ['title']
            }],
            order: [['created_at', 'DESC']]
        });

        res.json({
            success: true,
            message: readingActivity
        })
    } catch (e) {
        console.log(e);
        res.json({
            success: false,
            message: e.message
        })
    }
};