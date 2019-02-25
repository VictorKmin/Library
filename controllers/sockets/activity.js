let fullReadingActivity = require('../activity/fullReadingActivity');
let fullCommentActivity = require('../activity/fullCommentActivity');
let fullRatingActivity = require('../activity/fullRatingActivity');

module.exports = socket => {
    console.log(socket.id);

    socket.on('getReadingInfo', async body => {
        socket.to(socket.id).emit('readingInfo', await fullReadingActivity(body))
    });
    socket.on('getCommentInfo', async body => {
        console.log(body);
        socket.to(socket.id).emit('commentInfo', await fullCommentActivity(body))
    });
    socket.on('getRatingInfo', async body => {
        console.log(body);
        socket.to(socket.id).emit('ratingInfo', await fullRatingActivity(body))
    });
};