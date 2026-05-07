const fs = require("fs").promises;
const deleteImage = async (deletingImgPath) => {
  try {
    await fs.access(deletingImgPath);
    await fs.unlink(deletingImgPath);
    console.log("Requested image is deleted successfully...");
  } catch (error) {
    console.error("Requested image doesn't exist...", error);
  }
};

module.exports = { deleteImage };
