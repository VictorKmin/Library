const mailer = require('nodemailer');
const chalk = require('chalk');
const HR_EMAIL = require('../config/mail').HR_EMAIL;
const NOTIFICATION_EMAIL = require('../config/mail').NOTIFICATION_EMAIL;
const NOTIFICATION_PASSWORD = require('../config/mail').NOTIFICATION_PASSWORD;
module.exports = (body) => {
    const {title, name} = body;

    if (!title || !name) throw new Error('Email or book title is empty');
    const msg = `
    Dear HR manager. Employee <b>${name}</b> did not return a book <b>"${title}"</b> on time <br>
    Please find him! <br>`;

    const transporter = mailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: NOTIFICATION_EMAIL,
            pass: NOTIFICATION_PASSWORD
        }
    });

    const mailOptions = {
        from: 'NO REPLY',
        to: HR_EMAIL,
        subject: 'Library notification',
        text: `Якийсь текст`,
        html: msg
    };

    transporter.sendMail(mailOptions, (error) => {
        if (error) throw new Error(error.message);
        console.log(chalk.bgCyan.black(`Mail to HR send successful`));
    });
};