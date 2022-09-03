const sendMessage = require("../../sendMessage")

exports.handler = async (event) => {
  console.log("Received an update from Telegram!", event.body)
  const { message } = JSON.parse(event.body);
  await sendMessage(message.chat.id, "I got your message!");
  return { statusCode: 200 }
}
