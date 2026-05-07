const cloudinary = require("../config/cloudinary");

const extractPublicIdFromCloudinary = async (imageUrl) => {
  const urlSegments = imageUrl.split("/");
  const lastSegment = urlSegments.pop();
  const publicId = lastSegment.substring(0, lastSegment.lastIndexOf("."));
  return publicId;
};

const uploadImageInCloudinary = async (folderName, imgField) => {
  try {
    const uploadResult = await cloudinary.uploader.upload(imgField, {
      folder: folderName,
      resource_type: "image",
    });
    const imageUrl = uploadResult.secure_url;
    return imageUrl;
  } catch (error) {
    throw error;
  }
};

const deleteImageFromCloudinary = async (imgPath, publicId) => {
  try {
    const { result } = await cloudinary.uploader.destroy(
      `${imgPath}/${publicId}`,
    );
    if (result !== "ok") throw new Error("Image deleting failed...!");
  } catch (error) {
    throw error;
  }
};

module.exports = {
  extractPublicIdFromCloudinary,
  uploadImageInCloudinary,
  deleteImageFromCloudinary,
};
