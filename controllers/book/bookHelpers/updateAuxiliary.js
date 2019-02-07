const chalk = require('chalk');
const dataBase = require('../../../dataBase').getInstance();
const fs = require('fs');
const path = require('path');
let MAIN_PATH = require('../../../constants/values').MAIN_PATH;
const TEXT = require('../../../constants/files').TEXT;
const AUDIO = require('../../../constants/files').AUDIO;
const VIDEO = require('../../../constants/files').VIDEO;
/**
 * This method update all information of book in table FullSearch
 * I get all info about book. Creating one long string of this info
 * Convert this string to lower case and update full search table
 * @param id
 * @param bookInfo
 * @param fileInfo
 * @returns {Promise<void>}
 */
module.exports = async (id, bookInfo, fileInfo) => {
    const SearchModel = dataBase.getModel('FullSearch');
    const DigitalModel = dataBase.getModel('DigitalInfo');
    let typeOfFile = '';
    let typeOfContent = '';
    const {title, author, summary, subject, tags, is_digital} = bookInfo;

    const digitalInfo = await DigitalModel.findOne({
        where: {
            book_id: id
        }
    });
    if (digitalInfo.dataValues) {
        const fileLocation = digitalInfo.dataValues.location;
        const filePath = path.normalize(`${MAIN_PATH}/public/${fileLocation}`);
        fs.unlink(`${filePath}`, err => {
            if (err) throw new Error(err.message)
        });
    }

    if (fileInfo && is_digital) {
        const fileName = `/files/${fileInfo.filename}`;
        typeOfFile = fileInfo.filename.split('.').pop();
        if (TEXT.includes(fileInfo.mimetype)) typeOfContent = 'text';
        if (AUDIO.includes(fileInfo.mimetype)) typeOfContent = 'audio';
        if (VIDEO.includes(fileInfo.mimetype)) typeOfContent = 'video';
        await DigitalModel.create({
            book_id: id,
            type_of_file: typeOfFile,
            location: fileName,
            type_of_content: typeOfContent
        });

        console.log(chalk.bgYellow.magenta('DIGITAL INFO INSERTED'))
    }

    // String to search by one field
    let typeOfBook = 'handbook';
    if (is_digital) typeOfBook = 'digital';
    const searchString = `${title} ${author} ${summary} ${subject} ${tags} ${typeOfBook} ${typeOfFile} ${typeOfContent}`;
    await SearchModel.create({
        book_id: id,
        description: searchString.toLowerCase()
    });
    console.log(chalk.bgYellow.magenta('FULL SEARCH INSERTED'))
};