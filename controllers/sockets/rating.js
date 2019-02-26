const getBookRating = require('../../controllers/rating/getBookRating');
const rateBook = require('../../controllers/rating/rateBook');
const deleteVote = require('../../controllers/rating/deleteVote');
module.exports = (socket, io) => {

    socket.on('getRating', async (body) => {
        io.to(socket.id).emit('bookRating', await getBookRating(body))
    });

    socket.on('rateBook', async (body) => {
        await rateBook(body);
        io.to(socket.id).emit('bookRating', await getBookRating(body))
    });

    socket.on('deleteVote', async (body) => {
        await deleteVote(body);
        io.to(socket.id).emit('bookRating', await getBookRating(body))
    });
};