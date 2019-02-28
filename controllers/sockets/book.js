const getTopByComments = require('../../controllers/book/getTopByComments');
const getTopByRating = require('../../controllers/book/getTopByRating');
const getTopByReading = require('../../controllers/book/getTopByReading');
const getBookById = require('../../controllers/book/getBookById');
const takeBookForReading = require('../../controllers/book/takeBookForReading');
const continueReading = require('../book/continueReading');
const returnBook = require('../book/returnBook');

module.exports = (socket, io) => {
    socket.on('getBook', async id => {
        io.to(socket.id).emit('book', await getBookById(id));
    });

    socket.on('getTop', async (body) => {
        const {topValue} = body;

        if (topValue === 'rating') {
            io.to(socket.id).emit('topBooks', await getTopByRating(body))
        }
        if (topValue === 'reading') {
            io.to(socket.id).emit('topBooks', await getTopByReading(body))
        }
        if (topValue === 'comment') {
            io.to(socket.id).emit('topBooks', await getTopByComments(body))
        }
    });

    socket.on('bookEvent', async body => {
        const {bookId, bookEv} = body;

        if (bookEv === 'read') {
            await takeBookForReading(body);
        }
        if (bookEv === 'continue') {
            await continueReading(body);
        }
        if (bookEv === 'return') {
            await returnBook(body);
        }
        io.to(socket.id).emit('book', await getBookById(bookId))
    })
};