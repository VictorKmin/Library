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
        const page = req.params.page;
        const limit = req.params.limit;

        if (!page || page < 0 || limit < 0 || !limit) throw new Error('Bad request');
        const offsetCount = (page * limit) - limit;

        const BookModel = DataBase.getModel('Book');
        const RatingModel = DataBase.getModel('Rating');

        const allBooks = await BookModel.findAll({
            limit,
            offset: offsetCount
        });

        let booksIds =  allBooks.map(book => book.dataValues.id);

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

        allBooks.map(bookStat => {
            ratingInfo.forEach(rating => {
                if (bookStat.dataValues.id === rating.dataValues.book_id) {
                    bookStat.dataValues.countOfVotes = rating.dataValues.countOfVotes;
                    bookStat.dataValues.avgStar = +(rating.dataValues.avgStar.slice(0, 3));
                }
            });
        });

        // Alphabet sort
        allBooks.sort((first, second) => {
            if (first.dataValues.title < second.dataValues.title) return -1;
            if (first.dataValues.title > second.dataValues.title) return 1;
            return 0;
        });

        const booksCount = await BookModel.findAll({});
        const pageCount = Math.ceil(booksCount.length / limit);

        res.json({
            success: true,
            message: {
                books: allBooks,
                pageCount
            }
        })
    } catch (e) {
        console.log(e);
        res.json({
            success: false,
            message: e.message
        })
    }
};