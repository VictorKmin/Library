const express = require('express');
const app = express();
const chalk = require('chalk');
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "*");
    next();
});

const postgres = require('./DataBase').getInstance();
postgres.setModels();

const mainRouter = require('./routes/main');
const bookRouter = require('./routes/book');
const commentRouter = require('./routes/comment');
const getAllBookComments = require('./controllers/comment/getAllBookComments');

let s;

io.on("connection", socket => {
    console.log('CONNECT');
    s = socket;
    socket.on('getComments', (bookId) => {
        socket.emit('comments', getAllBookComments(bookId))
    });
});
app.use('/', mainRouter);
app.use('/book', bookRouter);
app.use('/comment', commentRouter);

// app.use((req, res, next)=> {
//     next(createError(404));
// });

http.listen(3001, (err) => {
    if (!err) console.log(chalk.bgGreen.black('Listen 3001'));
});