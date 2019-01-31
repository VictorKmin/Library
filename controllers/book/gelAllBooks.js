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

        // SELECT bookid, AVG(star), COUNT(id) FROM rating GROUP BY bookid ORDER BY AVG(star) DESC
        const booksInfo = await RatingModel.findAll({
            attributes: [
                'book_id',
                [Sequelize.fn('AVG', Sequelize.col('star')), 'avgStar'],
                [Sequelize.fn('COUNT', Sequelize.col('id')), 'countOfVotes']
            ],
            group: 'book_id',
            order: [[Sequelize.fn('AVG', Sequelize.col('star')), 'DESC']],
        });

        booksInfo.forEach(book => {
            const {book_id} = book.dataValues;
            // Push in this array just fot search from Book table
            booksIds.push(book_id);
        });


        // SELECT * FROM book WHERE id IN booksIds
        const top5 = await BookModel.findAll({
            where: {
                id: booksIds
            }
        });

        booksInfo.map((bookStat) => {
            bookStat.dataValues.avgStar = +(bookStat.dataValues.avgStar.slice(0, 3));
            top5.forEach(value => {
                if (bookStat.dataValues.book_id === value.dataValues.id) {
                    bookStat.dataValues.bookInfo = value.dataValues;
                }
            });
        });

        res.json({
            success: true,
            message: booksInfo
        })
    } catch (e) {
        console.log(e);
        res.json({
            success: false,
            message: e.message
        })
    }
};