const express = require("express");
const {
  handleGetProducts,
  handleGetProduct,
  handleCreateProduct,
  handleDeleteProduct,
  handleUpdateProduct,
} = require("../controllers/productController");
const { productValidation } = require("../validators/productValidator");
const { runValidation } = require("../validators");
const { isLoggedIn, isAdmin } = require("../middlewares/authMiddleware");
const productRouter = express.Router();

productRouter.get("/", handleGetProducts);
productRouter.get("/:slug", handleGetProduct);
productRouter.post(
  "/register",
  productValidation,
  runValidation,
  isLoggedIn,
  isAdmin,
  handleCreateProduct,
);
productRouter.delete("/:slug", isLoggedIn, isAdmin, handleDeleteProduct);
productRouter.put(
  "/:slug",
  productValidation,
  runValidation,
  isLoggedIn,
  isAdmin,
  handleUpdateProduct,
);

module.exports = productRouter;
