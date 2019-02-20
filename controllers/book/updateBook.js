const chalk = require('chalk');
const dataBase = require('../../dataBase').getInstance();
const secret = require('../../config/secrets').secret;
const tokenVerifiactor = require('../../helper/tokenVerificator');
let updateAuxiliary = require('../book/bookHelpers/updateAuxiliary');
let getBookById = require('../book/getBookById');
const fs = require('fs');
const path = require('path');
let MAIN_PATH = require('../../constants/values').MAIN_PATH;

/**
 * This method using for update book with new parameters
 * Firstly we need to find book in database
 * Then we get new values from request
 * If new value is empty we take old value
 * If we have files, then we delete old files
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
module.exports = async (req, res) => {
    try {
        const BookModel = dataBase.getModel('Book');
        const bookId = req.params.id;
        if (!bookId) throw new Error('Something wrong with URL');

        const bookInfo = JSON.parse(req.body.info);
        if (!bookInfo) throw new Error('Something wrong with request');

        const token = req.get('Authorization');
        if (!token) throw new Error('No token');
        const {role} = tokenVerifiactor(token, secret);
        if (role !== 1) throw new Error('You are not admin. Sorry');
        let {photo = '', file = ''} = req.files;
        const [fileInfo] = file;

        let {
            title: newTitle,
            author: newAuthor,
            summary: newSummary,
            subject: newSubject,
            publisher: newPublisher,
            tags: newTags,
            typeOfBook
        } = bookInfo;

        const bookToUpdate = await BookModel.findOne({
            where: {
                id: bookId
            }
        });

        if (!bookToUpdate) throw new Error('Book not found');

        let {
            title: oldTitle,
            author: oldAuthor,
            is_digital,
            summary: oldSummary,
            tags: oldTags,
            subject: oldSubject = '',
            publisher: oldPublisher = '',
            image
        } = bookToUpdate.dataValues;

        // values of book to update
        if (!newTitle) newTitle = oldTitle;
        if (!newAuthor) newAuthor = oldAuthor;
        (typeOfBook === 'digital') ? is_digital = true : is_digital = false;
        if (!newSummary) newSummary = oldSummary;
        if (!newTags) newTags = oldTags;
        if (!newSubject) newSubject = oldSubject;
        if (!newPublisher) newPublisher = oldPublisher;
        if (photo) {
            photo = `/images/${photo[0].filename}`;
            // DELETE OLD BOOK PHOTO
            const filePath = path.normalize(`${MAIN_PATH}/public/${image}`);
            fs.unlink(`${filePath}`, err => {
                console.log(err);
            });
        } else {
            photo = image;
        }

        // build object with new info to update another tables
        const infoToUpdate = {
            title: newTitle,
            author: newAuthor,
            summary: newSummary,
            subject: newSubject,
            tags: newTags,
            is_digital
        };
        //Update digital info and full search info with new values
        updateAuxiliary(bookId, infoToUpdate, fileInfo);

        await BookModel.update({
            title: newTitle,
            author: newAuthor,
            summary: newSummary,
            tags: newTags.toLowerCase(),
            subject: newSubject,
            publisher: newPublisher,
            image: photo,
            is_digital
        }, {
            where: {
                id: bookId,
            }
        });

        console.log(chalk.bgMagenta(`Book updated successful`));

        const updatedBook = await getBookById(bookId);
        res.json({
            success: true,
            message: 'Book successful updated'
        });

        /**
         * I have socket in request. If all fine
         * I emit event with comments and catch this Event on Angular
         */
        req.io.sockets.emit('book' , updatedBook)

    } catch
        (e) {
        console.log(e);
        res.json({
            success: false,
            message: e.message
        })
    }
};