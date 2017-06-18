const token = process.env.TOKEN;

const fs = require('fs');
const request = require("request");
let Bot = require('node-telegram-bot-api');
const nodemailer = require('nodemailer');
let bot,
mailTo = '';

if(process.env.NODE_ENV === 'production') {
  bot = new Bot(token);
  bot.setWebHook(process.env.HEROKU_URL + bot.token);
} else {
  bot = new Bot(token, { polling: true });
}

let transporter = nodemailer.createTransport({
  host: 'smtp.yandex.ru',
  port: 465,
  secure: true, // secure:true for port 465, secure:false for port 587
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});
console.log('Bot server started in the ' + process.env.NODE_ENV + ' mode');

let sendMail = (mailTo, file) => {
  return new Promise((resolve, reject) => {
    let message = {
      from: `"Book Sender" <${process.env.MAIL_BOX}>`, // sender address
      to: mailTo, // list of receivers
      subject: 'New book', // Subject line
      text: 'New book ' + file.name, // plain text body
      attachments: [
        {
          filename: file.name,
          content: file.body
        }
      ]
    };
    transporter.sendMail(message, (error, info) => {
      if (error) {
        console.log('Error: ');
        console.error(error);
        return reject(error);
      }
      console.log('Message %s sent: %s', info.messageId, info.response);
      return resolve();
    })
  })
}

bot.on('message', function (msg) {
  console.log(msg);
  if (msg.from.username === 'to_verge') {
    mailTo = 'verget@pbsync.com'
  } else if (msg.from.username === 'doesitoffendme') {
    mailTo = 'margaritasinyuk@kindle.com'
  } else {
    return false;
  }
  if (msg.document){
    let fileName = msg.document.file_name;
    let fileId = msg.document.file_id;
    bot.getFileLink(fileId).then((link) => {
      console.log(link);
      request({encoding: null, uri: link}, (error, response, body) => {
        if (!error && response.statusCode == 200) {
          sendMail(mailTo, {name: fileName, body: body}).then(() => {
            bot.sendMessage(msg.chat.id, `Book ${msg.document.caption || fileName} to ${mailTo} was send`);
          }).catch((err) => {
            console.error(err);
          })
        }else{
          console.error(error);
          return false;
        }
      })
    }).catch((error) => {
      console.error(error);
    })
  }
  return false;
});

module.exports = bot;