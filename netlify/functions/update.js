const sendMessage = require("../../sendMessage")
const getFile = require("../../getFile")

exports.handler = async (event) => {
  console.log("Received an update from Telegram!", event.body)
  const { message } = JSON.parse(event.body);
  await sendMessage(message.chat.id, "I got your message!");
  if (message.document) {
    try {
      const fileData = await getFile(message.document.file_id)
      if (fileData) {
        // sendToEmail
      }
      console.log(fileData)
    } catch (error) {
      console.error(error)
    }
  }
  return { statusCode: 200 }
}
