const telegramToken = process.env.TELEGRAM;

const request = require('request');

const nodemailer = require('nodemailer');

let Bot = require('node-telegram-bot-api');

let bot,
  mailTo = '';

if (process.env.NODE_ENV === 'production') {
  bot = new Bot(telegramToken);
  console.log(telegramToken)
  console.log('Setting webhook on ', `${process.env.URL}/${telegramToken}`)
  bot.setWebHook(`${process.env.URL}/${telegramToken}`);
} else {
  bot = new Bot(telegramToken, { polling: true });
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
        console.error(error);
        return reject(error);
      }
      console.log('Message %s sent: %s', info.messageId, info.response);
      return resolve();
    })
  })
}

bot.on('message', function (msg) {
  console.log('Message received ', msg)
  if (msg.from.username === 'to_verge') { // hardcoded because only I and my wife use this bot =)
    mailTo = 'verget49+amazon_sorpme@kindle.com' // verget@pbsync.com for 
  } else if (msg.from.username === 'doesitoffendme') {
    mailTo = 'margaritasinyuk_K64wlW@kindle.com'
  } else {
    return false;
  }
  if (msg.document) {
    let fileName = msg.document.file_name;
    let fileId = msg.document.file_id;
    bot.getFileLink(fileId).then((link) => {
      request({ encoding: null, uri: link }, (error, response, body) => {
        if (!error && response.statusCode == 200) {
          sendMail(mailTo, { name: fileName, body: body }).then(() => {
            bot.sendMessage(msg.chat.id, `Book ${msg.document.caption || fileName} was send to ${mailTo}`);
          }).catch((err) => {
            console.error(err);
          })
        } else {
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
