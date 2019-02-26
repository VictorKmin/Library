let fullReadingActivity = require('../activity/fullReadingActivity');
let fullCommentActivity = require('../activity/fullCommentActivity');
let fullRatingActivity = require('../activity/fullRatingActivity');

module.exports = (socket, io) => {

    socket.on('getReadingInfo', async body => {
        io.to(socket.id).emit('readingInfo', await fullReadingActivity(body))
    });
    socket.on('getCommentInfo', async body => {
        console.log(body);
        io.to(socket.id).emit('commentInfo', await fullCommentActivity(body))
    });
    socket.on('getRatingInfo', async body => {
        console.log(body);
        io.to(socket.id).emit('ratingInfo', await fullRatingActivity(body))
    });
};