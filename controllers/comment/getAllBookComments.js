const DataBase = require('../../dataBase').getInstance();
module.exports = async (bookId) => {
    const CommentModel = DataBase.getModel('Comment');
    const allComments = await CommentModel.findAll({
        where: {
            book_id: bookId
        }
    });
    return allComments;
};