const getTopByComments = require('../../controllers/book/getTopByComments');
const getTopByRating = require('../../controllers/book/getTopByRating');
const getTopByReading = require('../../controllers/book/getTopByReading');
const getBookById = require('../../controllers/book/getBookById');
const takeBookForReading = require('../../controllers/book/takeBookForReading');
const continueReading = require('../book/continueReading');
const returnBook = require('../book/returnBook');

module.exports = socket => {
    socket.on('getBook', async id => {
        console.log(socket.id);

        socket.emit('book', await getBookById(id))
    });

    socket.on('getTop', async (body) => {
        const {topValue} = body;

        if (topValue === 'rating') {
            socket.emit('topBooks', await getTopByRating(body))
        }
        if (topValue === 'reading') {
            socket.emit('topBooks', await getTopByReading(body))
        }
        if (topValue === 'comment') {
            socket.emit('topBooks', await getTopByComments(body))
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
        socket.emit('book', await getBookById(bookId))


    })
};