require("dotenv").config();
const axios = require("axios");

const verifyCaptcha = async (token) => {
  try {
    const secret = process.env.RECAPTCHA_SECRET_KEY;
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`
    );
    return response.data.success;
  } catch (err) {
    console.error("Captcha verification error:", err);
    return false;
  }
};

module.exports = verifyCaptcha;
