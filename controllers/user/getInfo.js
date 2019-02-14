const dataBase = require('../../dataBase').getInstance();
const tokenVereficator = require('../../helper/tokenVerificator');
const secret = require('../../config/secrets').secret;
module.exports = async (req, res) => {
    try {
        const UserModel = dataBase.getModel('User');
        const token = req.get('Authorization');
        if (!token) throw new Error('Token not present');
        const {id} = tokenVereficator(token, secret);

        const user = await UserModel.findOne({
            where: {
                id
            }
        });

        res.json({
            success: true,
            message: user
        })
    } catch (e) {
        res.json({
            success: false,
            message: 'Not logged'
        })
    }
};