require("dotenv").config({ quiet: true });

const serverPort = process.env.PORT || process.env.SERVER_PORT || 3001;
const mongodbURL = process.env.MONGODB_URL;
const fallbackUserIMG = "https://placehold.co/600x600/f8fafc/0f172a?text=MyStore";
const envDefaultUserIMG = process.env.DEFAULT_USER_IMG;
const defaultUserIMG =
  envDefaultUserIMG && /^https?:\/\//i.test(envDefaultUserIMG)
    ? envDefaultUserIMG
    : fallbackUserIMG;
const jwtSecretKey = process.env.JWT_SECRET_KEY;
const smtpUsername = process.env.SMTP_USERNAME;
const smtpPassword = process.env.SMTP_PASSWORD;
const clientSiteURL =
  process.env.CLIENT_SITE_URL || "http://localhost:5173,http://127.0.0.1:5173";
const jwtAccessKey = process.env.JWT_ACCESS_KEY;
const jwtResetPassKey = process.env.JWT_RESET_PASS_KEY;
const jwtRefreshKey = process.env.JWT_REFRESH_KEY;
const cloudinaryName = process.env.CLOUDINARY_NAME;
const cloudinaryApiKey = process.env.CLOUDINARY_API_KEY;
const cloudinarySecretKey = process.env.CLOUDINARY_SECRET_KEY;

module.exports = {
  serverPort,
  mongodbURL,
  defaultUserIMG,
  jwtSecretKey,
  smtpUsername,
  smtpPassword,
  clientSiteURL,
  jwtAccessKey,
  jwtResetPassKey,
  jwtRefreshKey,
  cloudinaryName,
  cloudinaryApiKey,
  cloudinarySecretKey,
};
