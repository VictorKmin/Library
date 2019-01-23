const DataBase = require('../../dataBase').getInstance();
module.exports = async (req, res) => {
    try {
        const id = req.query.id;
        if (!id) throw new Error('Chose book first');
        // const token = req.get('Authorization');
        // if (!token) throw new Error('No token');
        const CommentModel = DataBase.getModel('Comment');
        const User = DataBase.getModel('User');

        // Include makes a SQL JOIN on the table in scopes.
        // By what fields we doing a search we define in ORM model
        const allComments = await CommentModel.findAll({
            where: {
                book_id: id
            },
            include: [User]
        });

        res.json({
            success: true,
            message: allComments
        })
    } catch (e) {
        console.log(e);
        res.json({
            success: true,
            message: e.message
        })
    }

};