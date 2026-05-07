const errorResponse = (res, { statusCode, message }) => {
  return res
    .status(statusCode || 500)
    .json({ success: false, message: message || "Internal server error..." });
};

const successResponse = (res, { statusCode, message, payload = {} }) => {
  return res
    .status(statusCode || 200)
    .json({ success: true, message: message || "Responding well...", payload });
};

module.exports = { errorResponse, successResponse };
