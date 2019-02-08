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

    /**
     * If book was digital and now is digital too
     * We need to remove old file and upload new file
     */
    if (digitalInfo && is_digital) {
        let {location, type_of_content, type_of_file, id: recordID} = digitalInfo.dataValues;
        // Remove old file
        const filePath = path.normalize(`${MAIN_PATH}/public/${location}`);
        fs.unlink(`${filePath}`, err => {
            console.log(err);
        });
        // Get info about new file and update book
        const fileName = `/files/${fileInfo.filename}`;
        type_of_file = fileInfo.filename.split('.').pop();
        if (TEXT.includes(fileInfo.mimetype)) type_of_content = 'text';
        if (AUDIO.includes(fileInfo.mimetype)) type_of_content = 'audio';
        if (VIDEO.includes(fileInfo.mimetype)) type_of_content = 'video';
        await DigitalModel.update({
            type_of_file,
            location: fileName,
            type_of_content
        }, {
            where: {
                id: recordID
            }
        });
        console.log(chalk.bgYellow.magenta('DIGITAL INFO UPDATED'))
    }

    /**
     *  If book was handbook and now book is digital
     *  We need to create new record in "digital info" table
     */
    if (is_digital && !digitalInfo) {
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

    /**
     * If book was digital and now is handbook
     * We need just ti remove old file
     */
    if (digitalInfo && !is_digital) {
        let {location} = digitalInfo.dataValues;
        // Remove old file
        const filePath = path.normalize(`${MAIN_PATH}/public/${location}`);
        fs.unlink(`${filePath}`, err => {
            console.log(err);
        });
    }

    // String to search by one field
    let typeOfBook = 'handbook';
    if (is_digital) typeOfBook = 'digital';
    const searchString = `${title} ${author} ${summary} ${subject} ${tags} ${typeOfBook} ${typeOfFile} ${typeOfContent}`;
    await SearchModel.update({
        description: searchString.toLowerCase()
    }, {
        where: {
            book_id: id
        }
    });
    console.log(chalk.bgYellow.magenta('FULL SEARCH UPDATED'))
};