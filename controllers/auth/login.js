const DataBase = require('../../dataBase').getInstance();
const hasher = require('../../helper/passwordHasher');
const tokenizer = require('../../helper/tokinazer').accessAndRefresh;
const chalk = require('chalk');

module.exports = async (req, res) => {
    try {
        const userModel = DataBase.getModel('User');
        const TokenModel = DataBase.getModel('Token');
        const {email, password} = req.body;

        let user = await userModel.findOne({
            where: {
                email,
                password
            }
        });

        if (!user) throw new Error('Wrong email or password');

        const {id} = user.dataValues;
        let isTokenPresent = await TokenModel.findOne({
            where: {
                user_id: id
            }
        });
        if (isTokenPresent) throw new Error('You are already logged. Logout first, please');

        const hashedPass = hasher(password);
        console.log(chalk.green(hashedPass));

        let {accessToken, refreshToken} = tokenizer(id, email);
        if (!accessToken || !refreshToken) throw new Error('Token is not created');
        console.log(chalk.blue(`Pair of token is created. User with mail ${email} logged`));

        await TokenModel.create({
            user_id: id,
            token: accessToken
        });

        res.json({
            success: true,
            message: {
                accessToken,
                refreshToken,
                id
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

