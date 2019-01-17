const DataBase = require('../../DataBase').getInstance();
module.exports = async (bookId) => {
    const CommentModel = DataBase.getModel('Comment');
    const allComments = await CommentModel.findAll({
        where: {
            bookid: bookId
        }
    });
    return allComments;
};