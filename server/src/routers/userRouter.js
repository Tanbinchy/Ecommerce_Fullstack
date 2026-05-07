const express = require("express");
const {
  handleGetUsers,
  handleGetUserById,
  handleDeleteUserById,
  handleRegisterUser,
  handleVerifyUser,
  handleUpdateUserById,
  handleUserStatusById,
  handleUpdatePasswordByEmail,
  handleForgetUserPassword,
  handleResetUserPassword,
} = require("../controllers/userController");
const {
  userRegistrationValidation,
  userPasswordUpdateValidation,
  resetUserPasswordValidation,
  forgetUserPasswordValidation,
} = require("../validators/authValidator");
const { runValidation } = require("../validators");
const {
  isLoggedIn,
  isLoggedOut,
  isAdmin,
} = require("../middlewares/authMiddleware");
const {
  handleRefreshToken,
  handleProtectedRoute,
} = require("../controllers/authController");
const userRouter = express.Router();

userRouter.get("/refreshToken", handleRefreshToken);
userRouter.get("/protected-route", handleProtectedRoute);
userRouter.get("/", isLoggedIn, isAdmin, handleGetUsers);
userRouter.get("/:id", isLoggedIn, handleGetUserById);
userRouter.delete("/:id", isLoggedIn, isAdmin, handleDeleteUserById);
userRouter.post(
  "/register",
  isLoggedOut,
  userRegistrationValidation,
  runValidation,
  handleRegisterUser,
);
userRouter.post("/verify", isLoggedOut, handleVerifyUser);
userRouter.put(
  "/update-password",
  isLoggedIn,
  userPasswordUpdateValidation,
  runValidation,
  handleUpdatePasswordByEmail,
);
userRouter.post(
  "/forget-password",
  isLoggedOut,
  forgetUserPasswordValidation,
  runValidation,
  handleForgetUserPassword,
);
userRouter.put(
  "/reset-password",
  isLoggedOut,
  resetUserPasswordValidation,
  runValidation,
  handleResetUserPassword,
);
userRouter.put(
  "/:id",
  isLoggedIn,
  handleUpdateUserById,
);
userRouter.put("/user-status/:id", isLoggedIn, isAdmin, handleUserStatusById);

module.exports = userRouter;
