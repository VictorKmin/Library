const DataBase = require('../../dataBase').getInstance();
const Sequelize = require("sequelize");

/**
 *
 * @returns top5Book - top 5 book by rating.
 * Firstly we find top 5 books by rating from Rating table.
 * Then we sort this by ID and find all book info from Book table
 * Sort Rating because Book table return sorted by ID array.
 * And because we need to concat two array, we must have a two sorted arrays
 * @param body
 */
module.exports = async (body) => {
    try {
        const {page, limit} = body;
        let topBooksIds = [];
        const BookModel = DataBase.getModel('Book');
        const RatingModel = DataBase.getModel('Rating');
        const CommentModel = DataBase.getModel('Comment');
        if (!page || page < 0 || limit < 0 || !limit) throw new Error('Bad request');
        const offsetCount = (page * limit) - limit;

        const commentInfo = await CommentModel.findAll({
            attributes: [
                'book_id',
                [Sequelize.fn('COUNT', Sequelize.col('id')), 'countOfComments']
            ],
            order: [[Sequelize.fn('COUNT', Sequelize.col('id')), 'DESC']],
            group: 'book_id',
            limit,
            offset: offsetCount
        });

        commentInfo.forEach(book => {
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
            commentInfo.forEach(comment => {
                if (bookStat.dataValues.id === comment.dataValues.book_id) {
                    bookStat.dataValues.countOfComments = comment.dataValues.countOfComments;
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
            return second.dataValues.countOfComments - first.dataValues.countOfComments
        });

        const booksCount = await CommentModel.findAll({
            attributes: [
                'book_id',
                [Sequelize.fn('COUNT', Sequelize.col('id')), 'countOfComments']
            ],
            group: 'book_id',
        });

        const pageCount = Math.ceil(booksCount.length / limit);

        return {
            books: topBooks,
            pageCount
        }
        // const io = req.io;
        // const s = req.s;
        // io.to(s.id).emit('topBooks', {books: topBooks, pageCount})

    } catch (e) {
        console.log(e);
    }
};