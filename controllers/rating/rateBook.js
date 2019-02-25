const dataBase = require('../../dataBase').getInstance();
const tokenVerificatpr = require('../../helper/tokenVerificator');
const {secret} = require('../../config/secrets');
const {BLOCKED_ROLES} = require('../../constants/values');
module.exports = async (body) => {
    try {
        const {token, bookId, star} = body;
        if (!token || !bookId || !star) throw new Error('Body is not correct');
        let {role, id: user_id} = tokenVerificatpr(token, secret);
        if (BLOCKED_ROLES.includes(role)) throw new Error('You have not permissions');
        const RatingModel = dataBase.getModel('Rating');


        const userIds = await RatingModel.findAll({
            attributes: ['user_id'],
            where: {
                book_id: bookId
            }
        });

        const isUserAlreadyVote = userIds.some(elem => elem.dataValues.user_id === user_id);

        if (isUserAlreadyVote) throw new Error('You already voted');

        await RatingModel.create({
            user_id,
            book_id: bookId,
            star,
            created_at: new Date().toISOString()
        });

    } catch (e) {
        console.log(e);
    }
};