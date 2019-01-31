const dataBase = require('../dataBase/index').getInstance();
/**
 * This method insert all information of book in table FullSearch
 * I get all info about book. Creating one long string of this info
 * Convert this string to lower case and insert into table
 * @param id
 * @param bookInfo
 * @returns {Promise<void>}
 */
module.exports = async (id, bookInfo) => {
    const SearchModel = dataBase.getModel('FullSearch');

    let description = bookInfo.join().toLowerCase();
    const model = await SearchModel.create({
        book_id: id,
        description
    });

    console.log('___________________________________');
    console.log(model.dataValues);
    console.log('___________________________________');
};