const axios = require("axios").default

module.exports = async (file_id) => {
  try {
    const response = await axios.post(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/getFile`, {
      file_id
    });
    const file_name = response?.data?.result?.file_name
    const path = response?.data?.result?.file_path
    if (path) {
      const fileResponse = await axios.get(`https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${path}`);
      return fileResponse.data
    }
    return null
  } catch (error) {
    throw error
  }
};

//https://api.telegram.org/file/bot<token>/<file_path>