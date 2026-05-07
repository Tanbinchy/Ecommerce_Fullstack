const slugify = require("slugify");
const { successResponse } = require("../helpers/responseHelper");

const {
  serviceCreateCategory,
  serviceUpdateCategory,
  serviceDeleteCategory,
  serviceGetProducts,
  serviceGetProduct,
  serviceCreateProduct,
  serviceDeleteProduct,
  serviceUpdateProduct,
} = require("../services/productService");

const handleGetProducts = async (req, res, next) => {
  try {
    const search = req.query.search || "";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;

    const { products, count, pagination } = await serviceGetProducts(
      search,
      page,
      limit,
    );

    return successResponse(res, {
      statusCode: 200,
      message: `${count} products are returning successfully...`,
      payload: { products, pagination },
    });
  } catch (error) {
    next(error);
  }
};

const handleGetProduct = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const product = await serviceGetProduct(slug);
    successResponse(res, {
      statusCode: 200,
      message: "A requested product is returned successfully...",
      payload: { product },
    });
  } catch (error) {
    next(error);
  }
};

const handleCreateProduct = async (req, res, next) => {
  try {
    const productFields = { ...req.body };

    const newProduct = await serviceCreateProduct(productFields);

    return successResponse(res, {
      statusCode: 200,
      message: "Product is created successfully...",
      payload: { newProduct },
    });
  } catch (error) {
    next(error);
  }
};

const handleUpdateProduct = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const reqBody = req.body;

    const updatedProduct = await serviceUpdateProduct(slug, reqBody);

    successResponse(res, {
      statusCode: 200,
      message: "Requested product is updated successfully...",
      payload: { updatedProduct },
    });
  } catch (error) {
    next(error);
  }
};

const handleDeleteProduct = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const deletedProduct = await serviceDeleteProduct(slug);
    successResponse(res, {
      statusCode: 200,
      message: "Requested product is deleted successfully...",
      payload: { deletedProduct },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleGetProducts,
  handleGetProduct,
  handleCreateProduct,
  handleUpdateProduct,
  handleDeleteProduct,
};
