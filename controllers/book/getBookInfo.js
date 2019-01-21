const DataBase = require('../../dataBase').getInstance();
const Sequelize = require("sequelize");

module.exports = async (req, res) => {
    try {
        const BookModel = DataBase.getModel('Book');
        const ComentsModel = DataBase.getModel('Comments');
        const id = req.params.id;
        if (!id) throw new Error('U have not id in url');

        // SELECT * FROM book WHERE id = id;
        const book = await BookModel.findByPk(id);
        if (!book) throw new Error('We have not this book in DataBase');

        // SELECT COUNT("comment") FROM comments WHERE bookid = id GROUP BY bookid;
        const comments = await ComentsModel.findAll({
            attributes: [
                [Sequelize.fn('COUNT', Sequelize.col('comment')), 'countOfComments']
            ],
            where: {
                book_id: id
            },
            group: 'book_id'
        });

        console.log(comments);
        let countOfComments;
        //
        // if (!comments[0]) {
        //     countOfComments = 0;
        // } else {
        //     countOfComments = comments[0].dataValues.countOfComments
        // }
        book.dataValues.countOfComments = comments.length;

        res.json({
            success: true,
            message: book
        })
    } catch (e) {
        console.log(e);
        res.json({
            success: false,
            message: e.message
        })
    }
};