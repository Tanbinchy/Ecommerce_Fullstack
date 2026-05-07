const { body } = require("express-validator");

const userRegistrationValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required...")
    .isLength({ min: 3, max: 30 })
    .withMessage("Name should be 3-30 characters..."),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required...")
    .isEmail()
    .withMessage("Invalid email..."),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required...")
    .isLength({ min: 5 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{5,}$/)
    .withMessage(
      "Password must be 5+ chars, with uppercase, lowercase, number & special char...",
    ),
  body("address")
    .trim()
    .notEmpty()
    .withMessage("Address is required...")
    .isLength({ min: 3 })
    .withMessage("Address should be at least 3 characters..."),
  body("phone").trim().notEmpty().withMessage("Phone is required..."),
  body("image")
    .optional({ checkFalsy: true })
    .trim()
    .isURL({ protocols: ["http", "https"], require_protocol: true })
    .withMessage("User image must be a valid http or https URL..."),
];

const userLoginValidation = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required...")
    .isEmail()
    .withMessage("Invalid email..."),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required...")
    .isLength({ min: 5 })
    .withMessage("Password should be at least 5 characters...")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{5,}$/)
    .withMessage(
      "Password must be 5+ chars, with uppercase, lowercase, number & special char...",
    ),
];

const userPasswordUpdateValidation = [
  body("oldPassword")
    .trim()
    .notEmpty()
    .withMessage("Old password is required...")
    .isLength({ min: 5 })
    .withMessage("Old password should be at least 5 characters...")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{5,}$/)
    .withMessage(
      "Old password must be 5+ chars, with uppercase, lowercase, number & special char...",
    ),
  body("newPassword")
    .trim()
    .notEmpty()
    .withMessage("New password is required...")
    .isLength({ min: 5 })
    .withMessage("New password should be at least 5 characters...")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{5,}$/)
    .withMessage(
      "New password must be 5+ chars, with uppercase, lowercase, number & special char...",
    ),
  body("confirmedPassword")
    .trim()
    .notEmpty()
    .withMessage("Confirmed password is required...")
    .isLength({ min: 5 })
    .withMessage("Confirmed password should be at least 5 characters...")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{5,}$/)
    .withMessage(
      "Confirmed password must be 5+ chars, with uppercase, lowercase, number & special char...",
    ),
];

const forgetUserPasswordValidation = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required...")
    .isEmail()
    .withMessage("Invalid email..."),
];

const resetUserPasswordValidation = [
  body("token").trim().notEmpty().withMessage("Token is required..."),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required...")
    .isLength({ min: 5 })
    .withMessage("Password should be at least 5 characters...")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{5,}$/)
    .withMessage(
      "Password must be 5+ chars, with uppercase, lowercase, number & special char...",
    ),
];

module.exports = {
  userRegistrationValidation,
  userLoginValidation,
  userPasswordUpdateValidation,
  forgetUserPasswordValidation,
  resetUserPasswordValidation,
};
