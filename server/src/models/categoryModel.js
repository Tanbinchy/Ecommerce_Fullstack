const { Schema, model } = require("mongoose");

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      minlength: [3, "Minimum length of category is 3"],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Category slug is required"],
      lowercase: true,
      unique: true,
    },
  },
  { timestamps: true },
);

const Category = model("Category", categorySchema);

module.exports = Category;
