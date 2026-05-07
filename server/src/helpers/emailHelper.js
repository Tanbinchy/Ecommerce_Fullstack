const nodemailer = require("nodemailer");
const { smtpUsername, smtpPassword } = require("../secret");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: smtpUsername,
    pass: smtpPassword,
  },
});

const sendEmailWithNodemailer = async (emailData) => {
  try {
    const info = await transporter.sendMail({
      from: smtpUsername,
      to: emailData.email,
      subject: emailData.subject,
      html: emailData.html,
    });
    console.log("Message sent successfully:- ", info.response);
  } catch (error) {
    console.error("Error occurred while sending email...!", error);
    throw error;
  }
};

module.exports = sendEmailWithNodemailer;
