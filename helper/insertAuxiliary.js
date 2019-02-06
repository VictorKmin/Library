const chalk = require('chalk');
const dataBase = require('../dataBase/index').getInstance();
const TEXT = require('../constants/files').TEXT;
const AUDIO = require('../constants/files').AUDIO;
const VIDEO = require('../constants/files').VIDEO;
/**
 * This method insert all information of book in table FullSearch
 * I get all info about book. Creating one long string of this info
 * Convert this string to lower case and insert into table
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
    const {title, author, summary, subject = '', publisher = '', tags, typeOfBook} = bookInfo;

    if (fileInfo && typeOfBook === 'digital') {
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

    const searchString = `${title} ${author} ${summary} ${subject} ${tags} ${typeOfBook} ${typeOfFile} ${typeOfContent}`;
    await SearchModel.create({
        book_id: id,
        description: searchString.toLowerCase()
    });
    console.log(chalk.bgYellow.magenta('FULL SEARCH INSERTED'))

};