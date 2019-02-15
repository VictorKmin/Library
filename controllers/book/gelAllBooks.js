const DataBase = require('../../dataBase').getInstance();
const Sequelize = require("sequelize");

/**
 * This us very simple method using for search all books in database
 * @param req
 * @param res
 * @returns booksInfo - all books from dataBase
 */
module.exports = async (req, res) => {
    try {
        let booksIds = [];
        const BookModel = DataBase.getModel('Book');
        const RatingModel = DataBase.getModel('Rating');

        const allBooks = await BookModel.findAll({});

        allBooks.forEach(book => {
            const {id} = book.dataValues;
            // Push in this array just fot search from Book table
            booksIds.push(id);
        });

        console.log(booksIds);
        // SELECT bookid, AVG(star), COUNT(id) FROM rating GROUP BY bookid ORDER BY AVG(star) DESC
        const ratingInfo = await RatingModel.findAll({
            attributes: [
                'book_id',
                [Sequelize.fn('AVG', Sequelize.col('star')), 'avgStar'],
                [Sequelize.fn('COUNT', Sequelize.col('id')), 'countOfVotes']
            ],
            group: 'book_id',
            where: {
                book_id: booksIds
            }
        });

        allBooks.map((bookStat) => {
            ratingInfo.forEach(rating => {
                if (bookStat.dataValues.id === rating.dataValues.book_id) {
                    bookStat.dataValues.countOfVotes = rating.dataValues.countOfVotes;
                    bookStat.dataValues.avgStar = +(rating.dataValues.avgStar.slice(0, 3));
                }
            });
        });

        res.json({
            success: true,
            message: allBooks
        })
    } catch (e) {
        console.log(e);
        res.json({
            success: false,
            message: e.message
        })
    }
};