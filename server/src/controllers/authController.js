const createError = require("http-errors");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const { successResponse } = require("../helpers/responseHelper");
const { findById } = require("../services/findService");
const { deleteImage } = require("../helpers/deleteImgHelper");
const { createJWT } = require("../helpers/createJwtHelper");
const {
  jwtSecretKey,
  clientSiteURL,
  jwtAccessKey,
  jwtRefreshKey,
} = require("../secret");
const sendEmailWithNodemailer = require("../helpers/emailHelper");
const jwt = require("jsonwebtoken");
const {
  generateAccessTokenCookie,
  generateRefreshTokenCookie,
  clearAuthCookies,
} = require("../helpers/cookieHelper");

const withoutSensitiveFields = (user) => {
  const plainUser = user.toObject ? user.toObject() : { ...user };
  delete plainUser.password;
  delete plainUser.__v;
  return plainUser;
};

const handleLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) throw createError(404, "User not found with this email!");
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) throw createError(401, "Password did not matched!");
    if (user.isBanned) throw createError(403, "You are banned...!");
    if (req.requireAdmin && !user.isAdmin) {
      throw createError(403, "Only admins can login here.");
    }

    const safeUser = withoutSensitiveFields(user);

    const accessToken = createJWT({ user: safeUser }, jwtAccessKey, "15m");
    await generateAccessTokenCookie(res, accessToken);

    const refreshToken = createJWT({ user: safeUser }, jwtRefreshKey, "7d");
    await generateRefreshTokenCookie(res, refreshToken);

    return successResponse(res, {
      statusCode: 200,
      message: "User logged in successfully...",
      payload: { user: safeUser },
    });
  } catch (error) {
    next(error);
  }
};

const handleLogout = async (req, res, next) => {
  try {
    await clearAuthCookies(res);
    return successResponse(res, {
      statusCode: 200,
      message: "User logged out successfully...",
    });
  } catch (error) {
    next(error);
  }
};

const handleRefreshToken = async (req, res, next) => {
  try {
    const oldRefreshToken = req.cookies.refreshToken;
    if (!oldRefreshToken) throw createError(401, "Refresh token is not found!");
    const decoded = jwt.verify(oldRefreshToken, jwtRefreshKey);
    if (!decoded) throw createError(401, "Invalid refreshToken - Login again!");

    const accessToken = createJWT({ user: decoded.user }, jwtAccessKey, "15m");
    await generateAccessTokenCookie(res, accessToken);

    return successResponse(res, {
      statusCode: 200,
      message: "New Access Token Generated Successfully Using Refresh Token...",
      payload: { user: decoded.user },
    });
  } catch (error) {
    next(error);
  }
};

const handleAdminLogin = async (req, res, next) => {
  req.requireAdmin = true;
  return handleLogin(req, res, next);
};

const handleGetMe = async (req, res, next) => {
  try {
    const userId = req.user.user._id;
    const user = await User.findById(userId).select("-password -__v");
    if (!user) throw createError(404, "User not found!");
    return successResponse(res, {
      statusCode: 200,
      message: "Current user returned successfully...",
      payload: { user },
    });
  } catch (error) {
    next(error);
  }
};

const handleProtectedRoute = async (req, res, next) => {
  try {
    const newAccessToken = req.cookie.accessToken;
    const decoded = jwt.verify(newAccessToken, jwtAccessKey);
    if (!decoded) throw createError(401, "Invalid accessToken - Login again!");
    return successResponse(res, {
      statusCode: 200,
      message: "Access given to this protected route Successfully...",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleLogin,
  handleAdminLogin,
  handleLogout,
  handleRefreshToken,
  handleProtectedRoute,
  handleGetMe,
};
