const dataBase = require('../../dataBase').getInstance();

module.exports = async () => {
    try {
        const SubjectModel = dataBase.getModel('Subject');
        const subjects = await SubjectModel.findAll({
            order: ['subject']
        });

        return subjects;
    } catch (e) {
        console.log(e);
    }
};