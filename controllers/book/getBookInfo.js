const DataBase = require('../../dataBase').getInstance();
const Sequelize = require("sequelize");

module.exports = async (req, res) => {
    try {
        const BookModel = DataBase.getModel('Book');
        const CommentModel = DataBase.getModel('Comment');
        const BookStatModel = DataBase.getModel('BookStat');
        const UserModel = DataBase.getModel('User');
        const id = req.params.id;
        if (!id) throw new Error('U have not id in url');

        // SELECT * FROM book WHERE id = id;
        const book = await BookModel.findByPk(id);
        if (!book) throw new Error('We have not this book in DataBase');

        // SELECT COUNT("comment") FROM comments WHERE bookid = id GROUP BY bookid;
        const comments = await CommentModel.findAll({
            attributes: [
                [Sequelize.fn('COUNT', Sequelize.col('comment')), 'countOfComments']
            ],
            where: {
                book_id: id
            },
            group: 'book_id'
        });


        if (book.dataValues.is_reading) {
            // SELECT * FROM bookstat b JOIN users u on b.user_id = u.id WHERE b.book_id = id ORDER BY b.id;
            const whoReadBook = await BookStatModel.findOne({
                // attributes: [
                //     "User.name", "BookStat.back_time"
                // ],
                where: {
                    book_id: id
                },
                include: [UserModel],
                order: [
                    ['id', 'DESC']
                ]
            });
            book.dataValues.backTime = whoReadBook.dataValues.back_time;
            book.dataValues.user = whoReadBook.dataValues.User.name
        }

        let countOfComments;

        if (!comments[0]) {
            countOfComments = 0;
        } else {
            countOfComments = comments[0].dataValues.countOfComments
        }
        book.dataValues.countOfComments = countOfComments;

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