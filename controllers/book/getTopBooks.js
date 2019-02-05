const DataBase = require('../../dataBase').getInstance();
const Sequelize = require("sequelize");

/**
 *
 * @param req
 * @param res
 * @returns top5Book - top 5 book by rating.
 * Firstly we find top 5 books by rating from Rating table.
 * Then we sort this by ID and find all book info from Book table
 * Sort Rating because Book table return sorted by ID array.
 * And because we need to concat two array, we must have a two sorted arrays
 */
module.exports = async (req, res) => {
    try {
        let page = req.params.page;
        let limit = req.params.limit;
        let top5BooksIds = [];
        const BookModel = DataBase.getModel('Book');
        const RatingModel = DataBase.getModel('Rating');

        // SELECT bookid, AVG(star), COUNT(id) FROM rating GROUP BY bookid ORDER BY AVG(star) DESC LIMIT 5;
        const booksInfo = await RatingModel.findAll({
            attributes: [
                'book_id',
                [Sequelize.fn('AVG', Sequelize.col('star')), 'avgStar'],
                [Sequelize.fn('COUNT', Sequelize.col('id')), 'countOfVotes']
            ],
            group: 'book_id',
            order: [[Sequelize.fn('AVG', Sequelize.col('star')), 'DESC']],
            limit
        });

        booksInfo.forEach(book => {
            const {book_id} = book.dataValues;
            // Push in this array just fot search from Book table
            top5BooksIds.push(book_id);
        });


        // SELECT * FROM book WHERE id IN top5BooksIds
        const top5 = await BookModel.findAll({
            where: {
                id: top5BooksIds
            }
        });

        top5.map((bookStat) => {
            booksInfo.forEach(rating => {
                if (bookStat.dataValues.id === rating.dataValues.book_id) {
                    bookStat.dataValues.countOfVotes = rating.dataValues.countOfVotes;
                    bookStat.dataValues.avgStar = +(rating.dataValues.avgStar.slice(0, 3));
                }
            });
        });

        res.json({
            success: true,
            message: top5
        })
    } catch (e) {
        console.log(e);
        res.json({
            success: false,
            message: e.message
        })
    }
};