const express = require("express");
const categoryRouter = express.Router();
const {
  handleCreateCategory,
  handleGetCategories,
  handleGetCategory,
  handleUpdateCategory,
  handleDeleteCategory,
} = require("../controllers/categoryController");
const { categoryValidation } = require("../validators/categoryValidator");
const { runValidation } = require("../validators");
const { isLoggedIn, isAdmin } = require("../middlewares/authMiddleware");

categoryRouter.get("/", handleGetCategories);
categoryRouter.get("/:slug", handleGetCategory);
categoryRouter.post(
  "/register",
  categoryValidation,
  runValidation,
  isLoggedIn,
  isAdmin,
  handleCreateCategory,
);
categoryRouter.put(
  "/:slug",
  categoryValidation,
  runValidation,
  isLoggedIn,
  isAdmin,
  handleUpdateCategory,
);
categoryRouter.delete("/:slug", isLoggedIn, isAdmin, handleDeleteCategory);

module.exports = categoryRouter;
