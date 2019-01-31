const mailer = require('nodemailer');
const dataBase = require('../dataBase/index').getInstance();
module.exports = (body) => {
    const UserModel = dataBase.getModel('User');
    const {book, email} = body;

    if (!book || !email) throw new Error('Email or book title is empty');
    const msg = `Please return book ${book}`;

    let transporter = mailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            // user: WORK_EMAIL,
            // pass: WOR_PASS
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
        console.log(`Mail to ${email} send successful`);
    });
};