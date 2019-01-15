const express = require('express');
const app = express();
const path = require("path");
const chalk = require('chalk');

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,Authorization");
    next();
});

const mainRouter = require('./routes/main');

app.use('/', mainRouter);

app.use((req, res, next)=> {
    next(createError(404));
});

app.listen(3001, (err) => {
    if (!err) console.log(chalk.bgGreen.black('Listen 3001'));
});