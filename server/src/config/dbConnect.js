const mongoose = require("mongoose");
const { mongodbURL } = require("../secret");

const connectDB = async (options = {}) => {
  try {
    await mongoose.connect(mongodbURL, options);
    console.log("DB CONNECTION SUCCESSFUL...");
  } catch (error) {
    console.error("DB CONNECTION FAILED...!", error.toString());
  }
};

module.exports = connectDB;
