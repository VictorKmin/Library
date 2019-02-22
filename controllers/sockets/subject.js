const allSubjects = require('../../controllers/subject/getAllSubjects');
const removeSubjectById = require('../../controllers/subject/removeById');
const updateSubjectById = require('../../controllers/subject/updateById');
const createSubject = require('../../controllers/subject/createSubject');
module.exports = socket => {

    socket.on('getSubjects', async () => {
        socket.emit('subjects', await allSubjects())
    });

    socket.on('removeSubject', async (body) => {
        await removeSubjectById(body);
        socket.emit('subjects', await allSubjects())
    });

    socket.on('updateSubject', async (body) => {
        await updateSubjectById(body);
        socket.emit('subjects', await allSubjects())
    });

    socket.on('createSubject', async (body) => {
        await createSubject(body);
        socket.emit('subjects', await allSubjects())
    });
}