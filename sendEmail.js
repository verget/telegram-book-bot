const nodemailer = require('nodemailer');

module.exports = async (mailTo, file_name, file_content) => {
  let transporter = nodemailer.createTransport({
    host: 'smtp.yandex.ru',
    port: 465,
    secure: true, // secure:true for port 465, secure:false for port 587
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  });

  let message = {
    from: `"Book Sender" <${process.env.MAIL_BOX}>`, // sender address
    to: mailTo, // list of receivers
    subject: 'New book', // Subject line
    text: 'New book ' + file_name, // plain text body
    attachments: [
      {
        filename: file_name,
        content: file_content
      }
    ]
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(message, (error, info) => {
      if (error) {
        console.error(error);
        return reject(error);
      }
      console.log('Message %s sent: %s', info.messageId, info.response);
      return resolve();
    })
  })
};