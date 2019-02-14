const express = require('express');
const app = express();
// const http = require('http').createServer(app);
const io = require('socket.io').listen(app.listen(3001));

const chalk = require('chalk');
const path = require('path');
const {fork} = require('child_process');
const {resolve: resolvePath} = require('path');
const bodyParser = require('body-parser');
const postgres = require('./dataBase').getInstance();
postgres.setModels();

// Limit to file uploads
app.use(bodyParser.json({limit: '300mb'}));
app.use(bodyParser.urlencoded({limit: '300mb', extended: true}));

const mainRouter = require('./routes/auth');
const bookRouter = require('./routes/book');
const commentRouter = require('./routes/comment');
const searchRouter = require('./routes/search');
const userRouter = require('./routes/user');
const activityRouter = require('./routes/activity');


// const deleteComment = require('./controllers/comment/deleteById');
const allComment = require('./controllers/comment/getAllBookComments');
const updateComment = require('./controllers/comment/updateById');
// const createComment = require('./controllers/comment/createNewComment');
io.sockets.on('connection', socket => {
    console.log('connected');

    socket.on('getComments', async (body) => {
        const {bookId, limit} = body;
        socket.emit('comments', await allComment(bookId, limit))
    });

    // socket.on('deleteComment', async (body) => {
    //     const {commentId, token} = body;
    //     const bookId = await deleteComment(commentId, token);
    //     socket.emit('comments', await allComment(bookId, 5))
    // });

    socket.on('updateComment', async (body) => {
        const {commentId, newComment, token} = body;
        const bookId = await updateComment(commentId, newComment, token);
        socket.emit('comments', await allComment(bookId, 5))
    });

    // socket.on('createComment', async body => {
    //     const {comment, bookId, token} = body;
    //     await createComment()
    // })
});

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE,PATCH");
    res.header("Access-Control-Allow-Headers", "*");
    req.io = io;
    next();
});
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', mainRouter);
app.use('/book', bookRouter);
app.use('/comment', commentRouter);
app.use('/search', searchRouter);
app.use('/user', userRouter);
app.use('/activity', activityRouter);

/**
 * This child process using for check is user return book to office
 */
(() => {
    const isBookReturned = fork(resolvePath('./microservice/bookChecker'));
    isBookReturned.send('start');

    console.log(chalk.green('Child process started !'));
})();

// http.listen(3001, err => {
//     // http://patorjk.com/software/taag/#p=display&f=Electronic&t=LIBRARY -> HOW I DO THIS
//     if (!err) console.log(chalk.blue(
//         ' ▄            ▄▄▄▄▄▄▄▄▄▄▄  ▄▄▄▄▄▄▄▄▄▄   ▄▄▄▄▄▄▄▄▄▄▄  ▄▄▄▄▄▄▄▄▄▄▄  ▄▄▄▄▄▄▄▄▄▄▄  ▄         ▄ \n' +
//         '▐░▌          ▐░░░░░░░░░░░▌▐░░░░░░░░░░▌ ▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌▐░▌       ▐░▌\n' +
//         '▐░▌           ▀▀▀▀█░█▀▀▀▀ ▐░█▀▀▀▀▀▀▀█░▌▐░█▀▀▀▀▀▀▀█░▌▐░█▀▀▀▀▀▀▀█░▌▐░█▀▀▀▀▀▀▀█░▌▐░▌       ▐░▌\n' +
//         '▐░▌               ▐░▌     ▐░▌       ▐░▌▐░▌       ▐░▌▐░▌       ▐░▌▐░▌       ▐░▌▐░▌       ▐░▌\n' +
//         '▐░▌               ▐░▌     ▐░█▄▄▄▄▄▄▄█░▌▐░█▄▄▄▄▄▄▄█░▌▐░█▄▄▄▄▄▄▄█░▌▐░█▄▄▄▄▄▄▄█░▌▐░█▄▄▄▄▄▄▄█░▌\n' +
//         '▐░▌               ▐░▌     ▐░░░░░░░░░░▌ ▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌\n' +
//         '▐░▌               ▐░▌     ▐░█▀▀▀▀▀▀▀█░▌▐░█▀▀▀▀█░█▀▀ ▐░█▀▀▀▀▀▀▀█░▌▐░█▀▀▀▀█░█▀▀  ▀▀▀▀█░█▀▀▀▀ \n' +
//         '▐░▌               ▐░▌     ▐░▌       ▐░▌▐░▌     ▐░▌  ▐░▌       ▐░▌▐░▌     ▐░▌       ▐░▌     \n' +
//         '▐░█▄▄▄▄▄▄▄▄▄  ▄▄▄▄█░█▄▄▄▄ ▐░█▄▄▄▄▄▄▄█░▌▐░▌      ▐░▌ ▐░▌       ▐░▌▐░▌      ▐░▌      ▐░▌     \n' +
//         '▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌▐░░░░░░░░░░▌ ▐░▌       ▐░▌▐░▌       ▐░▌▐░▌       ▐░▌     ▐░▌     \n' +
//         ' ▀▀▀▀▀▀▀▀▀▀▀  ▀▀▀▀▀▀▀▀▀▀▀  ▀▀▀▀▀▀▀▀▀▀   ▀         ▀  ▀         ▀  ▀         ▀       ▀      \n' +
//         '                                                                                           '));
// });

module.exports = app;