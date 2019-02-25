const getBookRating = require('../../controllers/rating/getBookRating');
const rateBook = require('../../controllers/rating/rateBook');
module.exports = socket => {
    console.log(socket.id);

    socket.on('getRating', async (body) => {
        socket.emit('bookRating', await getBookRating(body))
    });

    socket.on('rateBook', async (body) => {
        await rateBook(body);
     socket.emit('bookRating', await getBookRating(body))
    });
};