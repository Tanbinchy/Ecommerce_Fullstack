const cookieOptions = (maxAge) => {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    maxAge,
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
  };
};

const generateAccessTokenCookie = async (res, accessToken) => {
  res.cookie("accessToken", accessToken, cookieOptions(15 * 60 * 1000));
};

const generateRefreshTokenCookie = async (res, refreshToken) => {
  res.cookie(
    "refreshToken",
    refreshToken,
    cookieOptions(7 * 24 * 60 * 60 * 1000),
  );
};

const clearAuthCookies = async (res) => {
  const options = cookieOptions(0);
  res.clearCookie("accessToken", options);
  res.clearCookie("refreshToken", options);
};

module.exports = {
  generateAccessTokenCookie,
  generateRefreshTokenCookie,
  clearAuthCookies,
};
