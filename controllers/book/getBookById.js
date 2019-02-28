const DataBase = require('../../dataBase').getInstance();
const Sequelize = require("sequelize");
const chalk = require('chalk');

module.exports = async (id) => {
    try {
        const BookModel = DataBase.getModel('Book');
        const CommentModel = DataBase.getModel('Comment');
        const BookStatModel = DataBase.getModel('BookStat');
        const UserModel = DataBase.getModel('User');
        // const id = req.params.id;
        if (!id) throw new Error('U have not id in url');

        // SELECT * FROM book WHERE id = id;
        const book = await BookModel.findByPk(id);
        if (!book) throw new Error('Book not found');

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
            // SELECT * FROM bookstat b JOIN users u on b.user_id = u.id WHERE b.book_id = id;
            const bookInfo = await BookStatModel.findOne({
                where: {
                    book_id: id
                },
                include: [UserModel],
            });
            book.dataValues.backTime = bookInfo.dataValues.back_time;
            book.dataValues.userName = bookInfo.dataValues.User.name;
            book.dataValues.userIdWhoRead = bookInfo.dataValues.user_id;
            book.dataValues.is_delaying = bookInfo.dataValues.is_delaying;
        }

        let countOfComments;

        // Maybe bad small. Sorry ...
        if (!comments[0]) {
            countOfComments = 0;
        } else {
            countOfComments = comments[0].dataValues.countOfComments
        }
        book.dataValues.countOfComments = countOfComments;

        console.log(chalk.green(`Get info about ${id}`));
        return book

    } catch (e) {
        console.log(e);
    }
};