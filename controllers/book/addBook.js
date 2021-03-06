const chalk = require('chalk');
const dataBase = require('../../dataBase').getInstance();
const insertAuxiliary = require('./bookHelpers/insertAuxiliary');
const tokenVerifiactor = require('../../helper/tokenVerificator');
const secret = require('../../config/secrets').secret;

module.exports = async (req, res) => {
    try {
        const BookModel = dataBase.getModel('Book');
        const token = req.get('Authorization');
        if (!token) throw new Error('No token');
        const {id} = tokenVerifiactor(token, secret);
        const bookInfo = JSON.parse(req.body.info);
        const {title, author, summary, subject = '', publisher = '', tags, typeOfBook} = bookInfo;
        let isDigital = false;
        if (typeOfBook === 'digital') isDigital = true;
        const {photo, file = ''} = req.files;
        const [fileInfo] = file;
        const imgName = `/images/${photo[0].filename}`;

        const insertedBook = await BookModel.create({
            title,
            author,
            summary,
            tags: tags.toLowerCase(),
            subject,
            user_id: id,
            publisher,
            image: imgName,
            is_reading: false,
            is_digital: isDigital,
            created_at: new Date().toISOString(),
        });
        const {id: bookId} = insertedBook.dataValues;
        console.log(chalk.bgYellow.magenta(`BOOK ${title} INSERTED`));

        insertAuxiliary(bookId, bookInfo, fileInfo);

        // return book id for Angular. When book is uploaded I navigate to this book
        res.json({
            success: true,
            message: bookId
        })
    } catch (e) {
        console.log(e);
        res.statusCode(401)
            .json({
                success: false,
                message: e.message
            })
    }
};