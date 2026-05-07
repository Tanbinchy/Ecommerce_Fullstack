const { default: slugify } = require("slugify");
const { successResponse } = require("../helpers/responseHelper");
const Category = require("../models/categoryModel");
const {
  serviceCreateCategory,
  serviceGetCategories,
  serviceGetCategory,
  serviceUpdateCategory,
  serviceDeleteCategory,
} = require("../services/categoryService");

const handleGetCategories = async (req, res, next) => {
  try {
    const search = req.query.search || "";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;

    const { categories, count, pagination } = await serviceGetCategories(
      search,
      page,
      limit,
    );

    return successResponse(res, {
      statusCode: 200,
      message: `${count} categories are returning successfully...`,
      payload: { categories, pagination },
    });
  } catch (error) {
    next(error);
  }
};

const handleGetCategory = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const category = await serviceGetCategory(slug);
    successResponse(res, {
      statusCode: 200,
      message: "A requested category is returned successfully...",
      payload: { category },
    });
  } catch (error) {
    next(error);
  }
};

const handleCreateCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    const newCategory = await serviceCreateCategory(name);
    successResponse(res, {
      statusCode: 200,
      message: "Category is created successfully...",
      payload: { newCategory },
    });
  } catch (error) {
    next(error);
  }
};

const handleUpdateCategory = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const { name } = req.body;

    const updatedCategory = await serviceUpdateCategory(slug, name);

    successResponse(res, {
      statusCode: 200,
      message: "Category is updated successfully...",
      payload: { updatedCategory },
    });
  } catch (error) {
    next(error);
  }
};

const handleDeleteCategory = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const deletedCategory = await serviceDeleteCategory(slug);
    successResponse(res, {
      statusCode: 200,
      message: "Category is deleted successfully...",
      payload: { deletedCategory },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleGetCategories,
  handleGetCategory,
  handleCreateCategory,
  handleUpdateCategory,
  handleDeleteCategory,
};
