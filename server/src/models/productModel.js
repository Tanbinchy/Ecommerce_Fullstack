const { Schema, model } = require("mongoose");

const defaultProductImage =
  "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80";

const productSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Product name is required"],
      minlength: [3, "Minimum length of product is 3"],
      maxlength: [30, "Minimum length of product is 30"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Product slug is required"],
      lowercase: true,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
      required: [true, "Description is required"],
      minlength: [5, "Minimum length of description is 5"],
      lowercase: true,
    },
    price: {
      type: Number,
      trim: true,
      required: [true, "Price is required"],
      validate: {
        validator: (value) => value > 0,
        message: (props) =>
          `${props.value} is not a valid price! Price must be greater than 0`,
      },
    },
    quantity: {
      type: Number,
      trim: true,
      required: [true, "Quantity is required"],
      validate: {
        validator: (value) => value > 0,
        message: (props) =>
          `${props.value} is not a valid quantity! Quantity must be greater than 0`,
      },
    },
    sold: {
      type: Number,
      trim: true,
      default: 0,
      validate: {
        validator: (value) => value >= 0,
        message: (props) =>
          `${props.value} is not a valid sold quantity! Sold quantity must be greater than 0`,
      },
    },
    shipping: {
      type: Number,
      default: 0,
    },
    image: {
      type: String,
      default: defaultProductImage,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: `Category`,
      required: [true, "Category is required"],
    },
  },
  { timestamps: true },
);

const Product = model("Product", productSchema);

module.exports = Product;
