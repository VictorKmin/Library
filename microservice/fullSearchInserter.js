const dataBase = require('../dataBase').getInstance();
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