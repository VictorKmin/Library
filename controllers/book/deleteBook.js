const chalk = require('chalk');
const dataBase = require('../../dataBase').getInstance();
const secret = require('../../config/secrets').secret;
const tokenVerifiactor = require('../../helper/tokenVerificator');
const fs = require('fs');
const path = require('path');
let MAIN_PATH = require('../../constants/values').MAIN_PATH;
module.exports = async (req, res) => {
    try {
        const BookModel = dataBase.getModel('Book');
        const CommentModel = dataBase.getModel('Comment');
        const BookStatModel = dataBase.getModel('BookStat');
        const RatingModel = dataBase.getModel('Rating');
        const SearchModel = dataBase.getModel('FullSearch');
        const DigitalModel = dataBase.getModel('DigitalInfo');
        const ReadingActivityModel = dataBase.getModel('ReadingActivity');
        const CommentActivityModel = dataBase.getModel('CommentActivity');
        const bookId = req.params.id;
        if (!bookId) throw new Error('Something wrong with URL');
        const token = req.get('Authorization');
        if (!token) throw new Error('No token');
        const {role} = tokenVerifiactor(token, secret);

        if (role !== 1) throw new Error('You are not admin. Sorry');

        const bookToDelete = await BookModel.findOne({
            where: {
                id: bookId
            }
        });
        if (!bookToDelete) throw new Error(`Book with id ${bookId} not found`);

        const {is_digital, image} = bookToDelete.dataValues;

        //Starting delete all record;
        await SearchModel.destroy({
            where: {
                book_id: bookId
            }
        });

        await RatingModel.destroy({
            where: {
                book_id: bookId
            }
        });

        await BookStatModel.destroy({
            where: {
                book_id: bookId,
            }
        });

        await CommentModel.destroy({
            where: {
                book_id: bookId
            }
        });

        // delete all activity of this book
        await ReadingActivityModel.destroy({
            where: {
                book_id: bookId
            }
        });

        await CommentActivityModel.destroy({
            where: {
                book_id: bookId
            }
        });

        // Then we need to delete files if book is digital
        if (is_digital) {
            const digitalInfo = await DigitalModel.findOne({
                where: {
                    book_id: bookId
                }
            });

            if (digitalInfo) {
                const {location} = digitalInfo.dataValues;
                // DELETE FILE
                const filePath = path.normalize(`${MAIN_PATH}/public/${location}`);

                fs.unlink(`${filePath}`, err => {
                    if (err) console.log(err)
                });

                await DigitalModel.destroy({
                    where: {
                        book_id: bookId
                    }
                })
            }
        }

        // DELETE BOOK IMAGE
        const imgPath = path.normalize(`${MAIN_PATH}/public/${image}`);

        fs.unlink(`${imgPath}`, err => {
            if (err) console.log(err)
        });

        await BookModel.destroy({
            where: {
                id: bookId
            }
        });

        console.log(chalk.bgMagenta(`Book deleted successful`));

        res.json({
            success: true,
            message: 'Book successful deleted'
        })
    } catch (e) {
        console.log(e);
        res.json({
            success: false,
            message: e.message
        })
    }
};