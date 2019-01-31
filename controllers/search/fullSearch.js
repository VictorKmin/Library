const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const dataBase = require('../../dataBase').getInstance();

/**
 * This method using just for searching bu one field.
 * Best practice will be using something like elastic search.
 * But this method is useful too.
 * I have table with 2 fields. First field is book Id.
 * Second is all book subscription.
 * I search by this one field, and have book id.
 * Then i find book and rating bu this id
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
module.exports = async (req, res) => {
    try {
        const SearchModel = dataBase.getModel('FullSearch');
        const BookModel = dataBase.getModel('Book');
        const RatingModel = dataBase.getModel('Rating');

        const keyWord = req.query.word;
        if (!keyWord) throw new Error('Something wrong with URL');

        const booksValues = await SearchModel.findAll({
            attributes: ['book_id'],
            where: {
                description: {
                    [Op.like]: `%${keyWord.toLowerCase()}%`
                }
            }
        });

        let booksId = [];
        booksValues.forEach(book => {
            booksId.push(book.dataValues.book_id)
        });

        console.log(booksId);
        const books = await BookModel.findAll({
            where: {
                id: booksId
            }
        });

        const booksInfo = await RatingModel.findAll({
            attributes: [
                'book_id',
                [Sequelize.fn('AVG', Sequelize.col('star')), 'avgStar'],
                [Sequelize.fn('COUNT', Sequelize.col('id')), 'countOfVotes']
            ],
            group: 'book_id',
            order: [[Sequelize.fn('AVG', Sequelize.col('star')), 'DESC']],
            where: {
                book_id: booksId
            }
        });

        booksInfo.map((bookStat) => {
            bookStat.dataValues.avgStar = +(bookStat.dataValues.avgStar.slice(0, 3));
            books.forEach(value => {
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