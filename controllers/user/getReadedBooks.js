const dataBase = require('../../dataBase').getInstance();
const {BLOCKED_ROLES} = require('../../constants/values');
const Sequelize = require("sequelize");
const tokenVerificator = require('../../helper/tokenVerificator');
const {secret} = require('../../config/secrets');
const chalk = require('chalk');

module.exports = async body => {
    try {
        const {token} = body;
        const {id: userId, role} = tokenVerificator(token, secret);
        if (BLOCKED_ROLES.includes(role)) throw new Error('U have not permissions');

        const ReadingActivityModel = dataBase.getModel('ReadingActivity');
        const BookModel = dataBase.getModel('Book');
        const RatingModel = dataBase.getModel('Rating');

        const bookInfo = await ReadingActivityModel.findAll({
            where: {
                user_id: userId,
                get_back: false
            }
        });

        const booKIdtoSearch = bookInfo.map(book => book.dataValues.book_id);

        console.log(booKIdtoSearch);

        const allReadedBooks = await BookModel.findAll({
            where: {
                is_reading: true,
                id: booKIdtoSearch
            }
        });
        // SELECT bookid, AVG(star), COUNT(id) FROM rating GROUP BY bookid ORDER BY AVG(star) DESC
        const ratingInfo = await RatingModel.findAll({
            attributes: [
                'book_id',
                [Sequelize.fn('AVG', Sequelize.col('star')), 'avgStar'],
                [Sequelize.fn('COUNT', Sequelize.col('id')), 'countOfVotes']
            ],
            group: 'book_id',
            where: {
                book_id: booKIdtoSearch
            }
        });

        allReadedBooks.map((book) => {
            ratingInfo.forEach(rating => {
                if (book.dataValues.id === rating.dataValues.book_id) {
                    book.dataValues.countOfVotes = rating.dataValues.countOfVotes;
                    book.dataValues.avgStar = +(rating.dataValues.avgStar.slice(0, 3));
                }
            });
        });

        console.log(chalk.green(`User ${userId} get his readed books`));
        return allReadedBooks;

    } catch (e) {
        console.log(e);
    }
};