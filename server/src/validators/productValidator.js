const { body } = require("express-validator");

const productValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Product name is required...")
    .isLength({ min: 3, max: 30 })
    .withMessage("Product name should between 3 to 30 characters long..."),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required...")
    .isLength({ min: 5 })
    .withMessage("Product description should be at least 5 characters long..."),
  body("price")
    .trim()
    .notEmpty()
    .withMessage("Price is required...")
    .isFloat({ min: 0 })
    .withMessage("Product price must be a positive value..."),
  body("quantity")
    .trim()
    .notEmpty()
    .withMessage("Product quantity is required...")
    .isInt({ min: 1 })
    .withMessage("Value of quantity must be greater then 1..."),
  body("image")
    .optional({ checkFalsy: true })
    .trim()
    .isURL({ protocols: ["http", "https"], require_protocol: true })
    .withMessage("Product image must be a valid http or https URL..."),
  body("category").trim().notEmpty().withMessage("Category is required..."),
];

module.exports = { productValidation };
