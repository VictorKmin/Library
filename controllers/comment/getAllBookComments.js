const dataBase = require('../../dataBase').getInstance();
module.exports = async (bookId) => {
    try {
        if (!bookId) throw new Error('Chose book first');
        const CommentModel = dataBase.getModel('Comment');
        const User = dataBase.getModel('User');

        // Include makes a SQL JOIN on the table in scopes.
        // By what fields we doing a search we define in ORM model
        const allComments = await CommentModel.findAll({
            where: {
                book_id: bookId
            },
            order: [["created_at", 'DESC']],
            include: [User]
        });

        return allComments

    } catch (e) {
        console.log(e);
    }
};