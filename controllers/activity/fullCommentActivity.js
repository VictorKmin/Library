const dataBase = require('../../dataBase').getInstance();
const tokenVerifiactor = require('../../helper/tokenVerificator');
const secret = require('../../config/secrets').secret;
const {ADMIN_ROLES} = require('../../constants/values');

/**
 * Method for get all comment activity.
 * When we select info from data base we join it to book and user model
 * For get full info about action
 * @returns {Promise<void>}
 * @param body
 */
module.exports = async (body) => {
    try {
        const CommentActivityModel = dataBase.getModel('CommentActivity');
        const UserModel = dataBase.getModel('User');
        const BookModel = dataBase.getModel('Book');
        const {token, limit} = body;
        if (!token) throw new Error('Not authorized');
        const {role} = tokenVerifiactor(token, secret);
        if (!ADMIN_ROLES.includes(role)) throw new Error('You are noy admin');

        // SELECT * FROM comment_activity JOIN user JOIN book ON ***** ORDER BY created_at DESC
        let readingActivity = await CommentActivityModel.findAll({
            include: [{
                model: UserModel,
                attributes: ['name']
            }, {
                model: BookModel,
                attributes: ['title']
            }],
            limit,
            order: [['created_at', 'DESC']]
        });

        return readingActivity

    } catch (e) {
        console.log(e);
    }
};