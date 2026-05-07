const slugify = require("slugify");
const createError = require("http-errors");
const Product = require("../models/productModel");
const {
  extractPublicIdFromCloudinary,
  deleteImageFromCloudinary,
} = require("../helpers/cloudinaryHelper");

const isRemoteUrl = (value = "") => /^https?:\/\//i.test(value);
const isCloudinaryUrl = (value = "") => value.includes("res.cloudinary.com");
const defaultProductImage =
  "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80";

const normalizeImageUrl = (value = "") => {
  const image = String(value || "").trim();
  if (!image) return defaultProductImage;
  if (!isRemoteUrl(image)) {
    throw createError(400, "Product image must be a valid http or https URL...");
  }
  return image;
};

const serviceGetProducts = async (search, page, limit) => {
  try {
    const searchRegex = new RegExp(".*" + search + ".*", "i");
    const filter = { name: { $regex: searchRegex } };
    const products = await Product.find(filter)
      .populate("category", "name slug")
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);
    const count = await Product.countDocuments(filter);

    return {
      products,
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

const serviceGetProduct = async (slug) => {
  try {
    const product = await Product.findOne({ slug })
      .populate("category", "name slug")
      .lean();
    if (!product) throw createError(404, "Product not found...!");

    return product;
  } catch (error) {
    throw error;
  }
};

const serviceCreateProduct = async (productFields) => {
  try {
    const isExists = await Product.exists({ name: productFields.name });
    if (isExists) throw createError(409, "Product already exists...");

    const imageUrl = normalizeImageUrl(productFields.image);

    const newProduct = await Product.create({
      name: productFields.name,
      slug: slugify(productFields.name),
      description: productFields.description,
      price: productFields.price,
      quantity: productFields.quantity,
      sold: productFields.sold,
      shipping: productFields.shipping,
      image: imageUrl,
      category: productFields.category,
    });

    return newProduct;
  } catch (error) {
    throw error;
  }
};

const serviceUpdateProduct = async (slug, reqBody) => {
  try {
    const filter = { slug };
    const allowedFields = [
      "name",
      "description",
      "price",
      "sold",
      "quantity",
      "shipping",
      "image",
      "category",
    ];
    const updatingFields = {};

    const product = await Product.findOne({ slug });
    if (!product) throw createError(404, "Product not found to be updated...");

    for (const key in reqBody) {
      if (allowedFields.includes(key)) {
        updatingFields[key] =
          key === "image" ? normalizeImageUrl(reqBody[key]) : reqBody[key];
        if (key === "name") {
          updatingFields.slug = slugify(reqBody[key]);
        }
      } else {
        throw createError(404, `This '${key}' field can not be updated...`);
      }
    }

    if (
      updatingFields.image &&
      updatingFields.image !== product.image &&
      isCloudinaryUrl(product.image)
    ) {
      const publicId = await extractPublicIdFromCloudinary(product.image);
      await deleteImageFromCloudinary(
        "E_Commerce_3rd_Attempt/Products",
        publicId,
      );
    }

    const options = {
      new: true,
      runValidators: true,
      context: "query",
    };

    const updatedProduct = await Product.findOneAndUpdate(
      filter,
      updatingFields,
      options,
    );

    if (!updatedProduct) throw createError(404, "Product not found to update!");
    return updatedProduct;
  } catch (error) {
    throw error;
  }
};

const serviceDeleteProduct = async (slug) => {
  try {
    const filter = { slug };
    const options = { new: true };

    const product = await Product.findOne(filter);
    if (product && product.image && isCloudinaryUrl(product.image)) {
      const publicId = await extractPublicIdFromCloudinary(product.image);
      await deleteImageFromCloudinary(
        "E_Commerce_3rd_Attempt/Products",
        publicId,
      );
    }
    const deletedProduct = await Product.findOneAndDelete(filter, options);
    return deletedProduct;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  serviceGetProducts,
  serviceGetProduct,
  serviceCreateProduct,
  serviceUpdateProduct,
  serviceDeleteProduct,
};
