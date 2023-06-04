const sendMessage = require("../../sendMessage")
const sendEmail = require("../../sendEmail")
const getFile = require("../../getFile")

const mailList = {
  'to_verge': 'verget49+amazon_sorpme@kindle.com',
  'doesitoffendme': 'margaritasinyuk_K64wlW@kindle.com',
  'risya_musya': 'verget49+amazon2_i06gsb@kindle.com'
}

exports.handler = async (event) => {
  console.log("Message received ", event.body)
  const { message } = JSON.parse(event.body);
  // await sendMessage(message.chat.id, "I got your message!");
  if (mailList[message.from.username]) { // hardcoded because only I and my wife use this bot =)
    mailTo = mailList[message.from.username]
  } else {
    return false;
  }
  if (message.document) {
    try {
      const fileData = await getFile(message.document.file_id)
      console.log('File path received, sending to ', mailTo)
      if (fileData) {
        await sendEmail(mailTo, message.document.file_name, fileData)
        console.log(`Book ${message.document.file_name} was send to ${mailTo}`)
        await sendMessage(message.chat.id, `Book ${message.document.file_name} was send to ${mailTo}`);
      }
    } catch (error) {
      console.error('update.js line 26', error)
    }
  }
  return { statusCode: 200 }
}
