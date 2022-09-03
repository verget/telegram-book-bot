const sendMessage = require("../../sendMessage")
const sendEmail = require("../../sendEmail")
const getFile = require("../../getFile")

exports.handler = async (event) => {
  console.log("Received an update from Telegram!", event.body)
  const { message } = JSON.parse(event.body);
  await sendMessage(message.chat.id, "I got your message!");
  if (message.from.username === 'to_verge') { // hardcoded because only I and my wife use this bot =)
    mailTo = 'verget49@gmail.com' // verget49+amazon_sorpme@kindle.com
  } else if (message.from.username === 'doesitoffendme') {
    mailTo = 'margaritasinyuk_K64wlW@kindle.com'
  } else {
    return false;
  }
  if (message.document) {
    try {
      const fileData = await getFile(message.document.file_id)
      if (fileData) {
        sendEmail(mailTo, message.document.file_name, fileData)
      }
      console.log(fileData)
    } catch (error) {
      console.error(error)
    }
  }
  return { statusCode: 200 }
}
