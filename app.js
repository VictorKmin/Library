const express = require('express');
const app = express();
const chalk = require('chalk');

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "*");
    next();
});

const postgres = require('./dataBase').getInstance();
postgres.setModels();

const mainRouter = require('./routes/auth');
const bookRouter = require('./routes/book');
const commentRouter = require('./routes/comment');

app.use('/', mainRouter);
app.use('/book', bookRouter);
app.use('/comment', commentRouter);

app.listen(3001, (err) => {
    if (!err) console.log(chalk.bgGreen.black('Listen 3001'));
});