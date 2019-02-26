const allComment = require('../../controllers/comment/getAllBookComments');
const updateComment = require('../../controllers/comment/updateById');
const deleteComment = require('../../controllers/comment/deleteById');
const createComment = require('../../controllers/comment/createNewComment');

module.exports = (socket, io) => {

    socket.on('getComments', async (body) => {
        const {bookId, limit} = body;
        io.to(socket.id).emit('comments', await allComment(bookId, limit))
    });

    socket.on('deleteComment', async (body) => {
        const {commentId, token, limit} = body;
        const bookId = await deleteComment(commentId, token);
        io.to(socket.id).emit('comments', await allComment(bookId, limit))
    });

    socket.on('updateComment', async (body) => {
        const {commentId, newComment, token, limit} = body;
        const bookId = await updateComment(token, commentId, newComment);
        io.to(socket.id).emit('comments', await allComment(bookId, limit))
    });

    socket.on('createComment', async body => {
        const {comment, bookId, token, limit} = body;
        await createComment(comment, bookId, token);
        io.to(socket.id).emit('comments', await allComment(bookId, limit))
    });
};