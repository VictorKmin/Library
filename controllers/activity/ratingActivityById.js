const dataBase = require('../../dataBase').getInstance();
const tokenVerifiactor = require('../../helper/tokenVerificator');
const secret = require('../../config/secrets').secret;

/**
 * This method for search rating history of book.
 * Get BookId from params req.param and search all rating of this book
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
module.exports = async (req, res) => {
    try {
        const bookId = req.params.id;
        if (!bookId) throw new Error('Bad request');
        const RatingModel = dataBase.getModel('Rating');
        const UserModel = dataBase.getModel('User');
        const token = req.get('Authorization');
        if (!token) throw new Error('Not authorized');
        const {role} = tokenVerifiactor(token, secret);
        if (role !== 1) throw new Error('Bad credentials');

        let ratingActivity = await RatingModel.findAll({
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
            message: ratingActivity
        })
    } catch (e) {
        console.log(e);
        res.json({
            success: false,
            message: e.message
        })
    }
};