const DataBase = require('../../dataBase').getInstance();
const userInfo = require('../../helper/getUserInfoFromHR');
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
        const UserModel = DataBase.getModel('User');
        const TokenModel = DataBase.getModel('Token');
        const {email, password} = req.body;

        const {name, roles} = await userInfo(email, password);
        console.log(email);
        console.log(password);
        console.log(name);
        console.log(roles);

        // { name: 'Irina Chornomorets',
        //     email: 'iwanreyko94@gmail.com',
        //     position: 'PHP developer',
        //     roles: 'administrator' }

        let isUserPresent = await UserModel.findOne({
            where: {
                email,
                name
            }
        });

        if (!isUserPresent) {
            isUserPresent = await UserModel.create({
                email,
                name,
                role: roles
            })
        }

        const {id, role} = isUserPresent.dataValues;
        let isTokenPresent = await TokenModel.findOne({
            where: {
                user_id: id
            }
        });
        if (isTokenPresent) throw new Error('You are already logged. Logout first, please');

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
        res.json({
            success: false,
            message: e.message
        })
    }
};

