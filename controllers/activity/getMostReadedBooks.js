const dataBase = require('../../dataBase').getInstance();
const tokenVerifiactor = require('../../helper/tokenVerificator');
const secret = require('../../config/secrets').secret;
const Sequelize = require("sequelize");

module.exports = async (req, res) => {
    try {
        const limit = req.params.limit;
        if (!limit) throw new Error('Bad request');
        const ReadingActivityModel = dataBase.getModel('ReadingActivity');
        const BookModel = dataBase.getModel('Book');
        const token = req.get('Authorization');
        if (!token) throw new Error('Not authorized');
        const {role} = tokenVerifiactor(token, secret);
        if (role !== 1) throw new Error('Bad credentials');
        // SELECT COUNT(r.id), b.title, b.id b.is_digital
        // FROM reading_activity r
        // JOIN book b on r.book_id = b.id
        // WHERE take_read = true
        // GROUP By b.title, b.id
        // ORDER BY (COUNT(r.id)) DESC limit ?;
        const readingActivity = await ReadingActivityModel.findAll({
            attributes: [
                [Sequelize.fn('COUNT', Sequelize.col('ReadingActivity.id')), 'countOfRead']
            ],
            group: ['ReadingActivity.book_id', "Book.id"],
            order: [[Sequelize.fn('COUNT', Sequelize.col('ReadingActivity.id')), 'DESC']],
            limit,
            include: [{
                model: BookModel,
                attributes: ['title', "id", "is_digital"]
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