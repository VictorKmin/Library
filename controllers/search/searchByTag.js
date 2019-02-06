const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const dataBase = require('../../dataBase').getInstance();
/**
 * This method using for searching by tag from.
 * We have tag in URL and search in book table by this tag
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
module.exports = async (req, res) => {
    try {
        const BookModel = dataBase.getModel('Book');
        const RatingModel = dataBase.getModel('Rating');
        const tag = req.params.tag.toLowerCase();
        if (!tag) throw new Error('Enter tag first');

        const bookByTag = await BookModel.findAll({
            where: {
                tags: {
                    [Op.like]: `%${tag}%`
                }
            }
        });

        if (!bookByTag) {
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

            bookByTag.map((bookStat) => {
                booksInfo.forEach(value => {
                    if (bookStat.dataValues.id === value.dataValues.book_id) {
                        bookStat.dataValues.countOfVotes = value.dataValues.countOfVotes;
                        bookStat.dataValues.avgStar = +(value.dataValues.avgStar.slice(0, 3));
                    }
                });
            });
        }
        res.json({
            success: true,
            message: bookByTag
        })
    } catch (e) {
        console.log(e);
        res
            .status(400)
            .json({
                success: false,
                message: e.message
            })
    }
};