const createError = require("http-errors");
const User = require("../models/userModel");
const { findEntityById } = require("./findService");
const { createJWT } = require("../helpers/createJwtHelper");
const {
  defaultUserIMG,
  jwtSecretKey,
  jwtResetPassKey,
  clientSiteURL,
} = require("../secret");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { default: mongoose } = require("mongoose");
const sendEmailHelper = require("../helpers/sendEmailHelper");
const {
  extractPublicIdFromCloudinary,
  deleteImageFromCloudinary,
} = require("../helpers/cloudinaryHelper");

const isRemoteUrl = (value = "") => /^https?:\/\//i.test(value);
const isCloudinaryUrl = (value = "") => value.includes("res.cloudinary.com");
const normalizeUserImageUrl = (value = "") => {
  const image = String(value || "").trim();
  if (!image) return defaultUserIMG;
  if (!isRemoteUrl(image)) {
    throw createError(400, "User image must be a valid http or https URL...");
  }
  return image;
};

const serviceGetUsers = async (search, page, limit) => {
  try {
    const searchRegex = new RegExp(".*" + search + ".*", "i");
    const filter = {
      isAdmin: { $ne: true },
      $or: [
        { name: { $regex: searchRegex } },
        { email: { $regex: searchRegex } },
        { phone: { $regex: searchRegex } },
      ],
    };
    const options = {
      password: 0,
      createdAt: 0,
      updatedAt: 0,
      __v: 0,
    };
    const users = await User.find(filter, options)
      .limit(limit)
      .skip((page - 1) * limit);
    const count = await User.countDocuments(filter);
    return {
      users,
      count,
      pagination: {
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        previousPage: page - 1 > 0 ? page - 1 : null,
        nextPage: page + 1 <= Math.ceil(count / limit) ? page + 1 : null,
      },
    };
  } catch (error) {
    throw error;
  }
};

const serviceGetUserById = async (userId) => {
  try {
    const options = {
      password: 0,
      createdAt: 0,
      updatedAt: 0,
      __v: 0,
    };
    const user = await findEntityById(User, userId, options);
    return user;
  } catch (error) {
    throw error;
  }
};

const serviceDeleteUserById = async (userId) => {
  try {
    const user = await findEntityById(User, userId);

    if (user && user.image && isCloudinaryUrl(user.image)) {
      const publicId = await extractPublicIdFromCloudinary(user.image);
      await deleteImageFromCloudinary("E_Commerce_3rd_Attempt/Users", publicId);
    }

    const deletedUser = await User.findOneAndDelete({
      _id: user._id,
      isAdmin: false,
    });
    if (!deletedUser) throw createError(403, "Admin cannot be deleted...");
    return deletedUser;
  } catch (error) {
    if (error instanceof mongoose.Error.CastError)
      throw createError(404, "Invalid ID...Mongoose casting error...");
    throw error;
  }
};

const serviceRegisterUser = async (newUser) => {
  try {
    const userExists = await User.exists({ email: newUser.email });
    if (userExists) throw createError(409, "Already exists - Just sign in");
    const tokenPayload = {
      email: newUser.email,
      name: newUser.name,
      password: newUser.password,
      phone: newUser.phone,
      address: newUser.address,
      image: newUser.image || defaultUserIMG,
    };
    const token = createJWT(tokenPayload, jwtSecretKey, "15m");
    await sendEmailHelper(newUser, token);
    return token;
  } catch (error) {
    throw error;
  }
};

const serviceVerifyUser = async (token) => {
  try {
    const decoded = jwt.verify(token, jwtSecretKey);
    const userExists = await User.exists({ email: decoded.email });
    if (userExists) throw createError(409, "User already exists");

    const imageUrl = normalizeUserImageUrl(decoded.image);

    const user = await User.create({
      name: decoded.name,
      email: decoded.email,
      password: decoded.password,
      phone: decoded.phone,
      address: decoded.address,
      image: imageUrl,
    });

    return user;
  } catch (error) {
    if (error.name === "TokenExpiredError")
      throw createError(401, "Token has expired...");
    else if (error.name === "JsonWebTokenError")
      throw createError(401, "Invalid JWT...");
    else throw createError(401, "Token verification failed or already used");
  }
};

const serviceUpdateUserById = async (userId, reqBody) => {
  try {
    const options = {
      password: 0,
      createdAt: 0,
      updatedAt: 0,
      __v: 0,
    };
    const user = await findEntityById(User, userId, options);
    const allowedFields = ["name", "phone", "address", "image"];
    const updatingFields = {};

    for (const key in reqBody) {
      if (allowedFields.includes(key)) {
        updatingFields[key] =
          key === "image" ? normalizeUserImageUrl(reqBody[key]) : reqBody[key];
      } else if (key === "email") {
        throw createError(400, "Email can't be updated...");
      }
    }

    if (
      updatingFields.image &&
      updatingFields.image !== user.image &&
      isCloudinaryUrl(user.image)
    ) {
      const publicId = await extractPublicIdFromCloudinary(user.image);
      await deleteImageFromCloudinary("E_Commerce_3rd_Attempt/Users", publicId);
    }

    const updatingOptions = {
      new: true,
      runValidators: true,
      context: "query",
    };

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updatingFields,
      updatingOptions,
    ).select("-password -createdAt -updatedAt -__v");

    return updatedUser;
  } catch (error) {
    if (error instanceof mongoose.Error.CastError)
      throw createError(404, "Invalid ID...Mongoose casting error...");
    throw error;
  }
};

const serviceUserStatusById = async (userId, action) => {
  try {
    let updatingFields = {};
    if (action == "ban") updatingFields = { isBanned: true };
    else if (action == "unban") updatingFields = { isBanned: false };
    else throw createError(400, "Invalid action...Use only 'ban' or 'unban'");
    const updatingOptions = {
      new: true,
      runValidators: true,
      context: "query",
    };
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updatingFields,
      updatingOptions,
    ).select("-password -createdAt -updatedAt -__v");
    if (!updatedUser) throw createError(400, "User not found...");
    else return updatedUser;
  } catch (error) {
    if (error instanceof mongoose.Error.CastError)
      throw createError(404, "Invalid ID...Mongoose casting error...");
    throw error;
  }
};

const serviceUpdatePasswordByEmail = async (
  email,
  oldPassword,
  newPassword,
  confirmedPassword,
) => {
  try {
    const user = await User.findOne({ email: email });
    if (newPassword !== confirmedPassword)
      throw createError(400, "New and confirm password must be same...!");
    if (oldPassword == newPassword || oldPassword == confirmedPassword)
      throw createError(400, "Old are matching with new or confirm password!");

    const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordMatch) throw createError(400, "Password doesn't match...!");

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { password: newPassword },
      { new: true },
    );

    if (!updatedUser) throw createError(400, "Updating password failed...!");
    return updatedUser;
  } catch (error) {
    if (error instanceof mongoose.Error.CastError)
      throw createError(404, "Invalid ID...Mongoose casting error...!");
    throw error;
  }
};

const serviceForgetUserPassword = async (userData) => {
  try {
    const token = createJWT({ userData }, jwtResetPassKey, "15m");
    await sendEmailHelper(userData, token);
    return token;
  } catch (error) {
    throw error;
  }
};

const serviceResetUserPassword = async (token, password) => {
  try {
    const decoded = jwt.verify(token, jwtResetPassKey);
    if (!decoded) throw createError(400, "Invalid or Expired Token...");

    const filter = { email: decoded.userData.email };
    const updatingFields = { password: password };
    const options = { new: true };

    const updatedUser = await User.findOneAndUpdate(
      filter,
      updatingFields,
      options,
    ).select("-password");

    return updatedUser;
  } catch (error) {
    throw error;
  }
};

module.exports = {
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
};
