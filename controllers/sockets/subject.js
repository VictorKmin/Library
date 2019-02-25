const allSubjects = require('../../controllers/subject/getAllSubjects');
const removeSubjectById = require('../../controllers/subject/removeById');
const updateSubjectById = require('../../controllers/subject/updateById');
const createSubject = require('../../controllers/subject/createSubject');
module.exports = socket => {
    console.log(socket.id);

    socket.on('getSubjects', async () => {
        socket.to(socket.id).emit('subjects', await allSubjects())
    });

    socket.on('removeSubject', async (body) => {
        await removeSubjectById(body);
        socket.to(socket.id).emit('subjects', await allSubjects())
    });

    socket.on('updateSubject', async (body) => {
        await updateSubjectById(body);
        socket.to(socket.id).emit('subjects', await allSubjects())
    });

    socket.on('createSubject', async (body) => {
        await createSubject(body);
        socket.to(socket.id).emit('subjects', await allSubjects())
    });
}