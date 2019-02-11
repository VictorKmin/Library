const dataBase = require('../../dataBase').getInstance();
const tokenVerifiactor = require('../../helper/tokenVerificator');
const secret = require('../../config/secrets').secret;
const Sequelize = require("sequelize");

module.exports = async (req, res) => {
    try {
        const limit = req.params.limit;
        if (!limit) throw new Error('Bad request');
        const ReadingActivityModel = dataBase.getModel('ReadingActivity');
        const UserModel = dataBase.getModel('User');
        const token = req.get('Authorization');
        if (!token) throw new Error('Not authorized');
        const {role} = tokenVerifiactor(token, secret);
        if (role !== 1) throw new Error('Bad credentials');

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