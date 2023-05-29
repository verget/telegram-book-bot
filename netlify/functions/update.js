const sendMessage = require("../../sendMessage")
const sendEmail = require("../../sendEmail")
const getFile = require("../../getFile")

exports.handler = async (event) => {
  console.log("Message received ", event.body)
  const { message } = JSON.parse(event.body);
  // await sendMessage(message.chat.id, "I got your message!");
  if (message.from.username === 'to_verge') { // hardcoded because only I and my wife use this bot =)
    mailTo = 'verget49+amazon_sorpme@kindle.com' //  verget49+amazon2_i06gsb@kindle.com
  } else if (message.from.username === 'doesitoffendme') {
    mailTo = 'margaritasinyuk_K64wlW@kindle.com'
  } else {
    return false;
  }
  if (message.document) {
    if (message.from.username === 'to_verge') { // hardcoded because only I and my wife use this bot =)
      mailTo = 'verget49+amazon_sorpme@kindle.com' //  verget49+amazon2_i06gsb@kindle.com
    } else if (message.from.username === 'doesitoffendme') {
      mailTo = 'margaritasinyuk_K64wlW@kindle.com'
    } else {
      return false;
    }
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
