const mongoose = require("mongoose");
const createError = require("http-errors");

const findEntityById = async (Model, id, options = {}) => {
  try {
    const entity = await Model.findById(id, options);
    if (!entity) {
      throw createError(404, `${Model.modelName} does't exit with this id...`);
    }
    return entity;
  } catch (error) {
    if (error instanceof mongoose.Error) {
      throw createError(400, "Does not match MongoDB ObjectId pattern...");
    }
    throw error;
  }
};

module.exports = { findEntityById };
