const dataBase = require('../../dataBase').getInstance();
const searchInserter = require('../../microservice/fullSearchInserter');
module.exports = (req, res) => {
    try {
        // info - userId, userName, title, author - required
        // tags?,subject?, publisher?, isDigital?, typeOfFile?, typeOfContent?, summary?
        // const {id, tittle, author, summary, subject = '', userName, isDigital = 'handbook', file = ''} = req.body;
        const {id, ...info} = req.body;
        // if (!bookInfo) throw new Error('Info about book is empty');
        const BookModel = dataBase.getModel('Book');
        const DigitalModel = dataBase.getModel('DigitalInfo');

        searchInserter(id, Object.values(info));


        res.json({
            success: true,
            message: 'OK'
        })
    } catch (e) {
        console.log(e);
        res.json({
            success: false,
            message: e.message
        })
    }
};