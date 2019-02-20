const dataBase = require('../../dataBase').getInstance();

module.exports = async () => {
    try {
        const SubjectModel = dataBase.getModel('Subject');
        const subjects = await SubjectModel.findAll({});
        subjects.sort((first, second) => {
            if (first.dataValues.subject < second.dataValues.subject) return -1;
            if (first.dataValues.subject > second.dataValues.subject) return 1;
            return 0;
        });

        return subjects;
    } catch (e) {
        console.log(e);
    }
};