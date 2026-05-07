const createError = require("http-errors");
const jwt = require("jsonwebtoken");
const { jwtAccessKey } = require("../secret");
const { clearAuthCookies } = require("../helpers/cookieHelper");

const isLoggedIn = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) throw createError(401, "Access token is not found...");
    const decodedAccessToken = jwt.verify(accessToken, jwtAccessKey);
    if (!decodedAccessToken) throw createError(401, "Invalid access token...");
    req.user = decodedAccessToken;
    next();
  } catch (error) {
    next(error);
  }
};

const isLoggedOut = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (accessToken) {
      try {
        const decodedAccessToken = jwt.verify(accessToken, jwtAccessKey);
        if (decodedAccessToken) throw createError(400, "Already logged in...");
      } catch (error) {
        if (error.status === 400) throw error;
        await clearAuthCookies(res);
      }
    }
    next();
  } catch (error) {
    next(error);
  }
};

const isAdmin = (req, res, next) => {
  try {
    if (!req.user.user.isAdmin)
      throw createError(403, "Only admin can access...");
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { isLoggedIn, isLoggedOut, isAdmin };
