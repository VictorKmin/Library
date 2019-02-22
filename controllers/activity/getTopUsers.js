const dataBase = require('../../dataBase').getInstance();
const tokenVerifiactor = require('../../helper/tokenVerificator');
const secret = require('../../config/secrets').secret;
const Sequelize = require("sequelize");
const {ADMIN_ROLES, BLOCKED_ROLES} = require('../../constants/values');

module.exports = async (req, res) => {
    try {
        const limit = req.params.limit;
        if (!limit) throw new Error('Bad request');
        const ReadingActivityModel = dataBase.getModel('ReadingActivity');
        const UserModel = dataBase.getModel('User');
        const token = req.get('Authorization');
        if (!token) throw new Error('Not authorized');
        const {role} = tokenVerifiactor(token, secret);
        if (!ADMIN_ROLES.includes(role)) throw new Error('You are noy admin');
        if (BLOCKED_ROLES.includes(role)) throw new Error('You have not permissions');

        const readingActivity = await ReadingActivityModel.findAll({
            attributes: [
                [Sequelize.fn('COUNT', Sequelize.col('ReadingActivity.id')), 'countOfRead']
            ],
            group: ["User.id"],
            order: [[Sequelize.fn('COUNT', Sequelize.col('ReadingActivity.id')), 'DESC']],
            limit,
            include: [{
                model: UserModel,
                attributes: ['name']
            }],
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