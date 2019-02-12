const DataBase = require('../../dataBase').getInstance();
const hasher = require('../../helper/passwordHasher');
const tokenizer = require('../../helper/tokinazer').accessAndRefresh;
const chalk = require('chalk');

/**
 * In this method we login user to our system.
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
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

        const {id, role} = user.dataValues;
        let isTokenPresent = await TokenModel.findOne({
            where: {
                user_id: id
            }
        });
        if (isTokenPresent) throw new Error('You are already logged. Logout first, please');

        const hashedPass = hasher(password);
        console.log(chalk.green(hashedPass));

        let {accessToken, refreshToken} = tokenizer(id, email, role);
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
            }
        })
    } catch (e) {
        console.error(e);
        res
            .status(401)
            .json({
                success: false,
                message: e.message
            })
    }
};

