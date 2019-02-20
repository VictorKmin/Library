const express = require('express');
const app = express();
const io = require('socket.io').listen(app.listen(3001, err => {
    // http://patorjk.com/software/taag/#p=display&f=Electronic&t=LIBRARY -> HOW I DO THIS
    if (!err) console.log(chalk.blue(
        ' ▄            ▄▄▄▄▄▄▄▄▄▄▄  ▄▄▄▄▄▄▄▄▄▄   ▄▄▄▄▄▄▄▄▄▄▄  ▄▄▄▄▄▄▄▄▄▄▄  ▄▄▄▄▄▄▄▄▄▄▄  ▄         ▄ \n' +
        '▐░▌          ▐░░░░░░░░░░░▌▐░░░░░░░░░░▌ ▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌▐░▌       ▐░▌\n' +
        '▐░▌           ▀▀▀▀█░█▀▀▀▀ ▐░█▀▀▀▀▀▀▀█░▌▐░█▀▀▀▀▀▀▀█░▌▐░█▀▀▀▀▀▀▀█░▌▐░█▀▀▀▀▀▀▀█░▌▐░▌       ▐░▌\n' +
        '▐░▌               ▐░▌     ▐░▌       ▐░▌▐░▌       ▐░▌▐░▌       ▐░▌▐░▌       ▐░▌▐░▌       ▐░▌\n' +
        '▐░▌               ▐░▌     ▐░█▄▄▄▄▄▄▄█░▌▐░█▄▄▄▄▄▄▄█░▌▐░█▄▄▄▄▄▄▄█░▌▐░█▄▄▄▄▄▄▄█░▌▐░█▄▄▄▄▄▄▄█░▌\n' +
        '▐░▌               ▐░▌     ▐░░░░░░░░░░▌ ▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌\n' +
        '▐░▌               ▐░▌     ▐░█▀▀▀▀▀▀▀█░▌▐░█▀▀▀▀█░█▀▀ ▐░█▀▀▀▀▀▀▀█░▌▐░█▀▀▀▀█░█▀▀  ▀▀▀▀█░█▀▀▀▀ \n' +
        '▐░▌               ▐░▌     ▐░▌       ▐░▌▐░▌     ▐░▌  ▐░▌       ▐░▌▐░▌     ▐░▌       ▐░▌     \n' +
        '▐░█▄▄▄▄▄▄▄▄▄  ▄▄▄▄█░█▄▄▄▄ ▐░█▄▄▄▄▄▄▄█░▌▐░▌      ▐░▌ ▐░▌       ▐░▌▐░▌      ▐░▌      ▐░▌     \n' +
        '▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌▐░░░░░░░░░░▌ ▐░▌       ▐░▌▐░▌       ▐░▌▐░▌       ▐░▌     ▐░▌     \n' +
        ' ▀▀▀▀▀▀▀▀▀▀▀  ▀▀▀▀▀▀▀▀▀▀▀  ▀▀▀▀▀▀▀▀▀▀   ▀         ▀  ▀         ▀  ▀         ▀       ▀      \n' +
        '                                                                                           '));
}));

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
const searchRouter = require('./routes/search');
const userRouter = require('./routes/user');
const activityRouter = require('./routes/activity');
const subjectRouter = require('./routes/subject');

const allComment = require('./controllers/comment/getAllBookComments');
const updateComment = require('./controllers/comment/updateById');
const deleteComment = require('./controllers/comment/deleteById');
const getBookById = require('./controllers/book/getBookById');
const createComment = require('./controllers/comment/createNewComment');
const allSubjects = require('./controllers/subject/getAllSubjects');
const removeSubjectById = require('./controllers/subject/removeById');
const updateSubjectById = require('./controllers/subject/updateById');
const createSubject = require('./controllers/subject/createSubject');

io.sockets.on('connection', socket => {
    console.log(chalk.bgGreen('CONNECT!'));
    socket.on('disconnect', () => {
        console.log(chalk.bgRed('DISCONNECT!'));
    });

    socket.on('getComments', async (body) => {
        const {bookId, limit} = body;
        socket.emit('comments', await allComment(bookId, limit))
    });
    socket.on('getBook', async id => {
        socket.emit('book', await getBookById(id))
    });

    socket.on('deleteComment', async (body) => {
        const {commentId, token, limit} = body;
        const bookId = await deleteComment(commentId, token);
        socket.emit('comments', await allComment(bookId, limit))
    });

    socket.on('updateComment', async (body) => {
        const {commentId, newComment, token, limit} = body;
        const bookId = await updateComment(token, commentId, newComment);
        socket.emit('comments', await allComment(bookId, limit))
    });

    socket.on('createComment', async body => {
        const {comment, bookId, token, limit} = body;
        await createComment(comment, bookId, token);
        socket.emit('comments', await allComment(bookId, limit))
    });

    socket.on('getSubjects', async () => {
        socket.emit('subjects', await allSubjects())
    });

    socket.on('removeSubject', async (body) => {
        await removeSubjectById(body);
        socket.emit('subjects', await allSubjects())
    });

    socket.on('updateSubject', async (body) => {
        await updateSubjectById(body);
        socket.emit('subjects', await allSubjects())
    });

    socket.on('createSubject', async (body) => {
        await createSubject(body);
        socket.emit('subjects', await allSubjects())
    });
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
app.use('/search', searchRouter);
app.use('/user', userRouter);
app.use('/activity', activityRouter);
app.use('/subject', subjectRouter);

/**
 * This child process using for check is user return book to office
 */
(() => {
    const isBookReturned = fork(resolvePath('./microservice/bookChecker'));
    isBookReturned.send('start');

    console.log(chalk.green('Child process started !'));
})();

module.exports = app;