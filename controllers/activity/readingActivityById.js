const dataBase = require('../../dataBase').getInstance();
const tokenVerifiactor = require('../../helper/tokenVerificator');
const secret = require('../../config/secrets').secret;
const {ADMIN_ROLES, BLOCKED_ROLES} = require('../../constants/values');

module.exports = async (req, res) => {
    try {
        const bookId = req.params.id;
        if (!bookId) throw new Error('Bad request');
        const ReadingActivityModel = dataBase.getModel('ReadingActivity');
        const UserModel = dataBase.getModel('User');
        const token = req.get('Authorization');
        if (!token) throw new Error('Not authorized');
        const {role} = tokenVerifiactor(token, secret);
        if (!ADMIN_ROLES.includes(role)) throw new Error('You are noy admin');
        if (BLOCKED_ROLES.includes(role)) throw new Error('You have not permissions');

        let readingActivity = await ReadingActivityModel.findAll({
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