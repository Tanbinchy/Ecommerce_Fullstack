const mongoose = require("mongoose");
const { mongodbURL } = require("../secret");

const connectDB = async (options = {}) => {
  if (!mongodbURL) {
    throw new Error("MONGODB_URL is missing from environment variables");
  }

  mongoose.set("bufferCommands", false);

  await mongoose.connect(mongodbURL, {
    serverSelectionTimeoutMS: 10000,
    ...options,
  });

  console.log("DB CONNECTION SUCCESSFUL...");
};

module.exports = connectDB;
