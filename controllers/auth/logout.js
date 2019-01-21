const viryfiToken = require('../../helper/tokenVerificator');
const secretWord = require('../../config/secrets').secret;
const dataBase = require('../../dataBase').getInstance();
module.exports = async (req, res) => {

    try {
        let TokenModel = dataBase.getModel('Token');
        const token = req.get('Authorization');
        if (!token) throw new Error('Have not token');
        await viryfiToken(token, secretWord);
        await TokenModel.destroy({
            where: {
                accessToken: token
            }
        });
        res.json({
            success: true,
            message: 'You are logged out'
        })
    } catch (err) {
        res.json({
            success: false,
            message: err.message
        })
    }
};
