const { clientSiteURL, jwtSecretKey } = require("../secret");
const { createJWT } = require("./createJwtHelper");
const sendEmailWithNodemailer = require("./emailHelper");

const sendEmailHelper = async (newUser, token) => {
  try {
    const emailData = {
      email: newUser.email,
      subject: "Account Verification Email",
      html: `
        <h2>Hello ${newUser.name}</h2>
        <p>
          Please click
          <a href="${clientSiteURL}/api/users/verify/${token}">
            here
          </a>
          to verify your account.
        </p>
      `,
    };

    try {
      await sendEmailWithNodemailer(emailData);
    } catch (error) {
      return next(createError(500, "Failed to send verification email"));
    }
  } catch (error) {
    throw error;
  }
};

module.exports = sendEmailHelper;
