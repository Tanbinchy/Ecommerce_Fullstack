const express = require("express");
const {
  handleLogin,
  handleAdminLogin,
  handleLogout,
  handleRefreshToken,
  handleGetMe,
} = require("../controllers/authController");
const { isLoggedIn } = require("../middlewares/authMiddleware");
const { userLoginValidation } = require("../validators/authValidator");
const { runValidation } = require("../validators");
const authRouter = express.Router();

authRouter.post(
  "/login",
  userLoginValidation,
  runValidation,
  handleLogin
);
authRouter.post(
  "/admin-login",
  userLoginValidation,
  runValidation,
  handleAdminLogin,
);
authRouter.post("/logout", isLoggedIn, handleLogout);
authRouter.get("/refresh-token", handleRefreshToken);
authRouter.get("/me", isLoggedIn, handleGetMe);

module.exports = authRouter;
