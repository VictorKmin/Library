const dataBase = require('../../dataBase').getInstance();
const tokenVerifiactor = require('../../helper/tokenVerificator');
const secret = require('../../config/secrets').secret;

module.exports = async (req, res) => {
    try {
        const bookId = req.params.id;
        if (!bookId) throw new Error('Bad request');
        const ReadingActivityModel = dataBase.getModel('ReadingActivity');
        const UserModel = dataBase.getModel('User');
        const token = req.get('Authorization');
        if (!token) throw new Error('Not authorized');
        const {role} = tokenVerifiactor(token, secret);
        if (role !== 1) throw new Error('Bad credentials');

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