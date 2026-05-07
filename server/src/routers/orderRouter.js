const express = require("express");
const {
  handleCreateOrder,
  handleGetOrders,
  handleGetOrderById,
  handleUpdateOrderStatus,
  handleDeleteOrder,
} = require("../controllers/orderController");
const { isLoggedIn, isAdmin } = require("../middlewares/authMiddleware");

const orderRouter = express.Router();

orderRouter.post("/", handleCreateOrder);
orderRouter.get("/", isLoggedIn, isAdmin, handleGetOrders);
orderRouter.get("/:id", isLoggedIn, isAdmin, handleGetOrderById);
orderRouter.put("/:id/status", isLoggedIn, isAdmin, handleUpdateOrderStatus);
orderRouter.delete("/:id", isLoggedIn, isAdmin, handleDeleteOrder);

module.exports = orderRouter;
