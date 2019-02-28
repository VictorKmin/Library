const mailer = require('nodemailer');
const chalk = require('chalk');
const {NOTIFICATION_EMAIL, NOTIFICATION_PASSWORD, EMAIL_HOST, EMAIL_PORT} = require('../config/mail');
const ANGULAR_IP = require('../constants/values').ANGULAR_IP;
module.exports = (body) => {
    const {title, email, name, book_id} = body;

    if (!title || !email) throw new Error('Email or book title is empty');
    const msg =
        `Dear ${name} <br>  
         Please return book ${title} <br>
         You can use link <b> ${ANGULAR_IP}/book/${book_id} </b> 
         If you not return book until 7 days this email will be sanded to HR`;

    let transporter = mailer.createTransport({
        host: EMAIL_HOST,
        port: EMAIL_PORT,
        secure: false,
        auth: {
            user: NOTIFICATION_EMAIL,
            pass: NOTIFICATION_PASSWORD
        }
    });

    let mailOptions = {
        from: 'Return book please',
        to: email,
        subject: 'Тема повідомлення',
        text: `Якийсь текст`,
        html: msg
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) throw new Error(error.message);
        console.log(chalk.bgCyan.black(`Mail to ${email} send successful`));
        console.log(info);
    });
};