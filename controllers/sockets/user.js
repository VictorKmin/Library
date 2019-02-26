const getReadedBooks = require('../../controllers/user/getReadedBooks');

module.exports = (socket, io) => {
    socket.on('getReadingInfo', async body => {
        io.to(socket.id).emit('myReadingInfo', await getReadedBooks(body))
    });
};