const {
  userInitialData,
  categoryInitialData,
  productInitialData,
} = require("../initialData");
const Category = require("../models/categoryModel");
const Product = require("../models/productModel");
const User = require("../models/userModel");

const seedUser = async (req, res, next) => {
  try {
    await User.deleteMany({});
    const seededUsers = await User.insertMany(userInitialData.users);
    return res.status(201).json({ success: true, seededUsers });
  } catch (error) {
    next(error);
  }
};

const seedCategory = async (req, res, next) => {
  try {
    await Category.deleteMany({});
    const seededCategories = await Category.insertMany(
      categoryInitialData.categories,
    );
    return res.status(201).json({ success: true, seededCategories });
  } catch (error) {
    next(error);
  }
};

const seedProduct = async (req, res, next) => {
  try {
    await Product.deleteMany({});
    let categories = await Category.find({});

    if (categories.length === 0) {
      categories = await Category.insertMany(categoryInitialData.categories);
    }

    const products = productInitialData.products.map((product, index) => ({
      ...product,
      category: categories[index % categories.length]._id,
    }));

    const seededProducts = await Product.insertMany(products);
    return res.status(201).json({ success: true, seededProducts });
  } catch (error) {
    next(error);
  }
};

const seedDemo = async (req, res, next) => {
  try {
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});

    const seededUsers = await User.insertMany(userInitialData.users);
    const seededCategories = await Category.insertMany(
      categoryInitialData.categories,
    );
    const products = productInitialData.products.map((product, index) => ({
      ...product,
      category: seededCategories[index % seededCategories.length]._id,
    }));
    const seededProducts = await Product.insertMany(products);

    return res.status(201).json({
      success: true,
      message: "Demo data seeded successfully",
      credentials: {
        email: "admin@mystore.com",
        password: "Admin@123",
      },
      counts: {
        users: seededUsers.length,
        categories: seededCategories.length,
        products: seededProducts.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { seedUser, seedCategory, seedProduct, seedDemo };
