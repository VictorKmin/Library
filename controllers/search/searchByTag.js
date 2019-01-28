const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const dataBase = require('../../dataBase').getInstance();
module.exports = async (req, res) => {
    try {
        const BookModel = dataBase.getModel('Book');
        const RatingModel = dataBase.getModel('Rating');
        const tag = req.params.tag;
        if (!tag) throw new Error('Enter tag first');

        const bookByTag = await BookModel.findAll({
            where: {
                tags: {
                    [Op.like]: `%${tag}%`
                }
            }
        });

        if (!bookByTag) throw new Error('Nothing found by this tag');

        let bookIds = [];
        bookByTag.forEach(value => {
            bookIds.push(value.dataValues.id);
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
                book_id: bookIds
            }
        });

        booksInfo.map((bookStat) => {
            bookStat.dataValues.avgStar = +(bookStat.dataValues.avgStar.slice(0, 3));
            bookByTag.forEach(value => {
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