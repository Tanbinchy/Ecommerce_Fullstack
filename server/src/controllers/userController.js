const createError = require("http-errors");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const { successResponse } = require("../helpers/responseHelper");
const { findEntityById } = require("../services/findService");
const { deleteImage } = require("../helpers/deleteImgHelper");
const { createJWT } = require("../helpers/createJwtHelper");
const { jwtSecretKey, clientSiteURL, jwtResetPassKey } = require("../secret");
const sendEmailWithNodemailer = require("../helpers/emailHelper");
const jwt = require("jsonwebtoken");
const { query } = require("express-validator");
const { MAX_FILE_SIZE, ALLOWED_FILE_TYPES } = require("../config");
const {
  serviceGetUsers,
  serviceGetUserById,
  serviceDeleteUserById,
  serviceRegisterUser,
  serviceVerifyUser,
  serviceUpdateUserById,
  serviceUserStatusById,
  serviceUpdatePasswordByEmail,
  serviceForgetUserPassword,
  serviceResetUserPassword,
} = require("../services/userService");

const handleGetUsers = async (req, res, next) => {
  try {
    const search = req.query.search || "";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;

    const { users, count, pagination } = await serviceGetUsers(
      search,
      page,
      limit,
    );

    return successResponse(res, {
      statusCode: 200,
      message: `${count} users are returning successfully...`,
      payload: { users, pagination },
    });
  } catch (error) {
    next(error);
  }
};

const handleGetUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await serviceGetUserById(userId);
    return successResponse(res, {
      statusCode: 200,
      message: "A user is returning successfully...",
      payload: { user },
    });
  } catch (error) {
    next(error);
  }
};

const handleDeleteUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const deletedUser = await serviceDeleteUserById(userId);
    return successResponse(res, {
      statusCode: 200,
      message: "A user is deleted successfully...",
      payload: { deletedUser },
    });
  } catch (error) {
    next(error);
  }
};

const handleRegisterUser = async (req, res, next) => {
  try {
    const newUser = { ...req.body };

    const token = await serviceRegisterUser(newUser);

    return successResponse(res, {
      statusCode: 200,
      message: `Hey ${newUser.name}, check ${newUser.email} to activate your account`,
      payload: { token },
    });
  } catch (error) {
    next(error);
  }
};

const handleVerifyUser = async (req, res, next) => {
  try {
    const { token } = req.body;
    if (!token) throw createError(400, "Token is required");

    const user = await serviceVerifyUser(token);

    return successResponse(res, {
      statusCode: 201,
      message: "User registered successfully",
      payload: { user },
    });
  } catch (error) {
    next(error);
  }
};

const handleUpdateUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const reqBody = req.body;
    const updatedUser = await serviceUpdateUserById(userId, reqBody);
    return successResponse(res, {
      statusCode: 200,
      message: "User updated successfully...",
      payload: { updatedUser },
    });
  } catch (error) {
    next(error);
  }
};

const handleUserStatusById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const action = req.body.action;
    const updatedUser = await serviceUserStatusById(userId, action);
    return successResponse(res, {
      statusCode: 200,
      message: `User is ${action}ned successfully...`,
      payload: { updatedUser },
    });
  } catch (error) {
    next(error);
  }
};

const handleUpdatePasswordByEmail = async (req, res, next) => {
  try {
    const { email, oldPassword, newPassword, confirmedPassword } = req.body;

    const updatedUser = await serviceUpdatePasswordByEmail(
      email,
      oldPassword,
      newPassword,
      confirmedPassword,
    );

    return successResponse(res, {
      statusCode: 200,
      message: "User password is updated successfully...",
      payload: { updatedUser },
    });
  } catch (error) {
    next(error);
  }
};

const handleForgetUserPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const userData = await User.findOne({ email: email });
    const token = await serviceForgetUserPassword(userData);
    return successResponse(res, {
      statusCode: 200,
      message: `Hey ${userData.name}, check ${userData.email} to reset your password`,
      payload: { token },
    });
  } catch (error) {
    next(error);
  }
};

const handleResetUserPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    const updatedUser = await serviceResetUserPassword(token, password);

    return successResponse(res, {
      statusCode: 200,
      message: "User password is reset successfully...",
      payload: { updatedUser },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
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
};
