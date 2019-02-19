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
        const page = req.params.page;
        const limit = req.params.limit;
        let topBooksIds = [];
        const BookModel = DataBase.getModel('Book');
        const RatingModel = DataBase.getModel('Rating');
        const ReadingActivityModel = DataBase.getModel('ReadingActivity');
        if (!page || page < 0 || limit < 0 || !limit) throw new Error('Bad request');
        const offsetCount = (page * limit) - limit;

        const readingInfo = await ReadingActivityModel.findAll({
            attributes: [
                'book_id',
                [Sequelize.fn('COUNT', Sequelize.col('id')), 'countOfReading']
            ],
            group: 'book_id',
            order: [[Sequelize.fn('COUNT', Sequelize.col('id')), 'DESC']],
            limit,
            offset: offsetCount,
            where: {
                take_read: true
            }
        });

        readingInfo.forEach(book => {
            topBooksIds.push(book.dataValues.book_id)
        });

        // SELECT bookid, AVG(star), COUNT(id) FROM rating GROUP BY bookid LIMIT 5;
        const ratingInfo = await RatingModel.findAll({
            attributes: [
                'book_id',
                [Sequelize.fn('AVG', Sequelize.col('star')), 'avgStar'],
                [Sequelize.fn('COUNT', Sequelize.col('id')), 'countOfVotes']
            ],
            group: 'book_id',
            where: {
                book_id: topBooksIds
            }
        });

        // SELECT * FROM book WHERE id IN top5BooksIds
        const topBooks = await BookModel.findAll({
            where: {
                id: topBooksIds
            }
        });

        console.time('PIZDEC');
        // PIZDEC
        topBooks.map((bookStat) => {
            readingInfo.forEach(reading => {
                if (bookStat.dataValues.id === reading.dataValues.book_id) {
                    bookStat.dataValues.countOfReading = reading.dataValues.countOfReading;
                }
                ratingInfo.forEach(rating => {
                    if (bookStat.dataValues.id === rating.dataValues.book_id) {
                        bookStat.dataValues.countOfVotes = rating.dataValues.countOfVotes;
                        bookStat.dataValues.avgStar = +(rating.dataValues.avgStar.slice(0, 3));
                    }
                });
            })
        });
        console.timeEnd('PIZDEC');

        topBooks.sort((first, second) => {
            return second.dataValues.countOfReading - first.dataValues.countOfReading
        });

        const booksCount = await ReadingActivityModel.findAll({
            attributes: [
                'book_id',
                [Sequelize.fn('COUNT', Sequelize.col('id')), 'countOfReading']
            ],
            group: 'book_id',
            where: {
                take_read: true
            }
        });

        res.json({
            success: true,
            message: readingInfo.length
        });

        const pageCount = Math.ceil(booksCount.length / limit);
        req.io.sockets.emit('topBooks', {books: topBooks, pageCount})

    } catch (e) {
        console.log(e);
        res.json({
            success: false,
            message: e.message
        })
    }
};