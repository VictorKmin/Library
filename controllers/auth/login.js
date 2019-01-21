const DataBase = require('../../dataBase').getInstance();
const hasher = require('../../helper/passwordHasher');
const tokenizer = require('../../helper/tokinazer').accessAndRefresh;

module.exports = async (req, res) => {
    try {
        const TokenModel = DataBase.getModel('Token');
        const {email, password} = req.body;

        /**
         * ТИМЧАСОВИЙ КОД
         */
        const userMode = DataBase.getModel('User');
        let user = await userMode.findOne({
            where: {
                email
            }
        });

        const {id} = user.dataValues;

        const hashedPass = hasher(password);
        console.log(hashedPass);

        let {accessToken, refreshToken} = tokenizer(id, email);
        if (!accessToken || !refreshToken) throw new Error('Token os not created');

        await TokenModel.create({
            userid: id,
            token: accessToken
        });

        res.json({
            success: true,
            message: {
                accessToken,
                refreshToken
            }
        })
    } catch (e) {
        console.error(e);
        res.json({
            success: false,
            message: e.message
        })
    }
};

