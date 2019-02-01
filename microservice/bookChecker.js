const MILLISECONDS_ID_DAY = require('../constants/values').MILLISECONDS_ID_DAY;
let chalk = require('chalk');
const Sequalize = require('sequelize');
const Op = Sequalize.Op;
const dataBase = require('../dataBase').getInstance();
dataBase.setModels();
let sendEmailToUser = require('../helper/sendEmailToUser');
let sendEmailToHr = require('../helper/sendEmailToHr');

process.on('message', () => {
    setInterval(checkBooks, MILLISECONDS_ID_DAY);
});

async function checkBooks() {
    try {
        console.log(chalk.bgWhite.black('Start to check books'));
        const BookStatModel = dataBase.getModel('BookStat');
        const UserModel = dataBase.getModel('User');
        const BookModel = dataBase.getModel('Book');

        const currentTime = new Date();

        let notReturnedBooks = await BookStatModel.findAll({
            where: {
                back_time: {
                    [Op.lte]: currentTime
                }
            },
            include: [
                {model: UserModel},
                {model: BookModel}
            ],
        });

        if (notReturnedBooks.length) {
            for (const book of notReturnedBooks) {
                const email = book.dataValues.User.email;
                const name = book.dataValues.User.name;
                const title = book.dataValues.Book.title;
                const isDelaying = book.dataValues.is_delaying;
                const notificationCount = book.dataValues.notification_count;
                const id = book.dataValues.id;
                const book_id = book.dataValues.book_id;

                sendEmailToUser({email, title, name, book_id});

                // This code check if user ignored email for 7 times
                // or already delay returning book and then send email to HR
                if (isDelaying || notificationCount > 7) {
                    sendEmailToHr({title, name})
                }
                await BookStatModel.update({
                    notification_count: notificationCount + 1
                }, {
                    where: {
                        id
                    }
                })
            }
        }

    } catch (e) {
        console.log(chalk.bgRed(e.message));
    }
}