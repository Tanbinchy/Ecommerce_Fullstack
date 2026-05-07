const mongoose = require("mongoose");
const connectDB = require("../config/dbConnect");
const {
  userInitialData,
  categoryInitialData,
  productInitialData,
} = require("../initialData");
const Category = require("../models/categoryModel");
const Product = require("../models/productModel");
const User = require("../models/userModel");

const demoProductImages = [
  "/images/products/1770145455000-407315.png",
  "/images/products/1770145967828-f3b8f835-f8ff-40eb-a623-76dfed2eb70f.jpeg",
  "/images/products/1770146147655-f3b8f835-f8ff-40eb-a623-76dfed2eb70f.jpeg",
  "/images/products/1770146155668-f3b8f835-f8ff-40eb-a623-76dfed2eb70f.jpeg",
];

const seedDemo = async () => {
  await connectDB();

  await User.deleteMany({});
  await Category.deleteMany({});
  await Product.deleteMany({});

  const users = await User.insertMany(userInitialData.users);
  const categories = await Category.insertMany(categoryInitialData.categories);
  const products = productInitialData.products.map((product, index) => ({
    ...product,
    image: demoProductImages[index % demoProductImages.length],
    category: categories[index % categories.length]._id,
  }));
  const seededProducts = await Product.insertMany(products);

  console.log("Demo data seeded successfully.");
  console.log(`Users: ${users.length}`);
  console.log(`Categories: ${categories.length}`);
  console.log(`Products: ${seededProducts.length}`);
  console.log("Admin email: admin@mystore.com");
  console.log("Admin password: Admin@1234");
};

seedDemo()
  .catch((error) => {
    console.error("Demo seeding failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
