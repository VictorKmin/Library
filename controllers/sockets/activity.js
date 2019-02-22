let fullReadingActivity = require('../activity/fullReadingActivity');
let fullCommentActivity = require('../activity/fullCommentActivity');
let fullRatingActivity = require('../activity/fullRatingActivity');

module.exports = socket => {
    socket.on('getReadingInfo', async body => {
        socket.emit('readingInfo', await fullReadingActivity(body))
    });
    socket.on('getCommentInfo', async body => {
        console.log(body);
        socket.emit('commentInfo', await fullCommentActivity(body))
    });
    socket.on('getRatingInfo', async body => {
        console.log(body);
        socket.emit('ratingInfo', await fullRatingActivity(body))
    });
};