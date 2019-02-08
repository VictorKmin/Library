const dataBase = require('../../dataBase').getInstance();

module.exports = (req, res) => {
    try {
        const bookId = req.params.id;




        res.json({
            success: true,
            message: {}
        })
    } catch (e) {
        console.log(e);
        res.json({
            success: false,
            message: e.message
        })
    }
};