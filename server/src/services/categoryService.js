const slugify = require("slugify");
const Category = require("../models/categoryModel");
const createError = require("http-errors");

const serviceGetCategories = async (search, page, limit) => {
  try {
    const searchRegex = new RegExp(".*" + search + ".*", "i");
    const filter = { name: { $regex: searchRegex } };
    const categories = await Category.find(filter)
      .limit(limit)
      .skip((page - 1) * limit);
    const count = await Category.countDocuments(filter);

    return {
      categories,
      count,
      pagination: {
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        previousPage: page - 1 > 0 ? page - 1 : null,
        nextPage: page + 1 <= Math.ceil(count / limit) ? page + 1 : null,
      },
    };
  } catch (error) {
    throw error;
  }
};

const serviceGetCategory = async (slug) => {
  try {
    const category = await Category.find({ slug }).select("name slug").lean();
    if (!category.length) throw createError(404, "Category not found...!");

    return category;
  } catch (error) {
    throw error;
  }
};

const serviceCreateCategory = async (name) => {
  try {
    const newCategory = await Category.create({
      name: name,
      slug: slugify(name),
    });
    return newCategory;
  } catch (error) {
    throw error;
  }
};

const serviceUpdateCategory = async (slug, name) => {
  try {
    const filter = { slug };
    const updatingFields = { $set: { name: name, slug: slugify(name) } };
    const options = { new: true };

    const updatedCategory = await Category.findOneAndUpdate(
      filter,
      updatingFields,
      options,
    );

    if (!updatedCategory) {
      throw createError(
        404,
        "Category is not found to update...Make sure the slug is correct...!",
      );
    }

    return updatedCategory;
  } catch (error) {
    throw error;
  }
};

const serviceDeleteCategory = async (slug) => {
  try {
    const filter = { slug };
    const options = { new: true };

    const deletedCategory = await Category.findOneAndDelete(filter, options);
    if (!deletedCategory) throw createError(404, "Category notFound to delete");

    return deletedCategory;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  serviceGetCategories,
  serviceGetCategory,
  serviceCreateCategory,
  serviceUpdateCategory,
  serviceDeleteCategory,
};
