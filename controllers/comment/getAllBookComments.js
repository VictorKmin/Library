const dataBase = require('../../dataBase').getInstance();
const chalk = require('chalk');

module.exports = async (bookId, limit) => {
    try {
        if (!bookId) throw new Error('Chose book first');
        if (!limit && limit !== 0) throw new Error('Chose book first');
        const CommentModel = dataBase.getModel('Comment');
        const User = dataBase.getModel('User');

        // Include makes a SQL JOIN on the table in scopes.
        // By what fields we doing a search we define in ORM model
        const allComments = await CommentModel.findAll({
            where: {
                book_id: bookId
            },
            order: [["created_at", 'DESC']],
            include: [User],
            limit
        });

        console.log(chalk.green(`Get comments of book ${bookId}`));
        return allComments

    } catch (e) {
        console.log(e);
    }
};