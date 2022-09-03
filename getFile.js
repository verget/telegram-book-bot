const axios = require("axios").default

module.exports = async (file_id) => {
  const response = await axios.post(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/getFile`, {
    file_id
  });

  return response;
};