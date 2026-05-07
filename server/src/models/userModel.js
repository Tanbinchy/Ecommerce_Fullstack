const { Schema, model } = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const { defaultUserIMG } = require("../secret");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "User name is required"],
      minlength: [3, "Minimum length of username is 3"],
      maxlength: [30, "Maximum length of username is 30"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "User email is required"],
      unique: [true, "User email already exists"],
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, "Please provide a valid email address"],
    },
    password: {
      type: String,
      required: [true, "User password is required"],
      minlength: [5, "Minimum length of password is 5"],
      set: (plainPassword) =>
        bcrypt.hashSync(plainPassword, bcrypt.genSaltSync(10)),
    },
    image: {
      type: String,
      default: defaultUserIMG,
      // type: Buffer,
      // contentType: String,
      // required: [true, "Image is required..."],
    },
    address: {
      type: String,
      required: [true, "User address is required"],
      minlength: [3, "Minimum length of address is 3"],
    },
    phone: {
      type: String,
      required: [true, "User phone is required"],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User = model("Users", userSchema);

module.exports = User;
