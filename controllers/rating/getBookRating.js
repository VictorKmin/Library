const dataBase = require('../../dataBase').getInstance();
const Sequelize = require("sequelize");
const tokenVerificator = require('../../helper/tokenVerificator');
const {secret} = require('../../config/secrets');
const {BLOCKED_ROLES} = require('../../constants/values');
const chalk = require('chalk');

module.exports = async (body) => {
    try {
        const {bookId, token} = body;
        let isUserCanVote = false;
        let votedStar;
        if (!bookId) throw new Error('Book ID is not found');
        const RatingModel = dataBase.getModel('Rating');

        const voteInfo = await RatingModel.findAll({
            attributes: ['user_id', "star"],
            where: {
                book_id: bookId
            }
        });

        // If user logged we check does he already voted and find vote info
        if (token) {
            const {role, id: userId} = tokenVerificator(token, secret);
            if (BLOCKED_ROLES.includes(role)) throw new Error(' You have not permissions');
            // If user ID not found in voted array - he can vote
            isUserCanVote = !voteInfo.some(elem => elem.dataValues.user_id === userId);
            // If user already voted. Get star what he rate
            if (!isUserCanVote) {
                let index = voteInfo.map((el) => el.dataValues.user_id).indexOf(userId);
                votedStar = voteInfo[index].dataValues.star
            }
        }


        const rating = await RatingModel.findAll({
            attributes: [
                [Sequelize.fn('AVG', Sequelize.col('star')), 'avgStar'],
                [Sequelize.fn('COUNT', Sequelize.col('id')), 'countOfVotes']
            ],
            group: "book_id",
            where: {
                book_id: bookId
            },
        });

        if (!rating.length) return {isUserCanVote};

        rating[0].dataValues.isUserCanVote = isUserCanVote;
        rating[0].dataValues.votedStar = votedStar;

        console.log(chalk.green(`Get rating of book ${bookId}`));
        // rating is Array with just 1 value. And we need to return just first value
        return rating[0];
    } catch (e) {
        console.log(e)
    }
};