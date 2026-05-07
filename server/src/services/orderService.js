const createError = require("http-errors");
const Order = require("../models/orderModel");
const Product = require("../models/productModel");

const normalizeQuantity = (value) => {
  const quantity = Number(value);
  if (!Number.isInteger(quantity) || quantity < 1) {
    throw createError(400, "Every order item needs a valid quantity");
  }
  return quantity;
};

const serviceCreateOrder = async (orderFields, userId = null) => {
  try {
    const { customer, items, paymentMethod, notes } = orderFields;

    if (!customer?.name || !customer?.email || !customer?.phone || !customer?.address) {
      throw createError(400, "Customer name, email, phone, and address are required");
    }

    if (!Array.isArray(items) || items.length === 0) {
      throw createError(400, "Order items are required");
    }

    const hydratedItems = [];

    for (const item of items) {
      const quantity = normalizeQuantity(item.quantity);
      const productFilter = item.product ? { _id: item.product } : { slug: item.slug };
      const product = await Product.findOne(productFilter);

      if (!product) throw createError(404, "A product in your cart was not found");
      if (product.quantity < quantity) {
        throw createError(400, `${product.name} does not have enough stock`);
      }

      hydratedItems.push({
        product: product._id,
        name: product.name,
        slug: product.slug,
        image: product.image,
        price: product.price,
        quantity,
      });
    }

    for (const item of hydratedItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { quantity: -item.quantity, sold: item.quantity },
      });
    }

    const subtotal = hydratedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const shipping = subtotal > 500 ? 0 : 12;
    const tax = Number((subtotal * 0.05).toFixed(2));
    const total = Number((subtotal + shipping + tax).toFixed(2));

    const createdOrder = await Order.create({
      user: userId,
      customer,
      items: hydratedItems,
      subtotal,
      shipping,
      tax,
      total,
      paymentMethod,
      notes,
    });

    return createdOrder;
  } catch (error) {
    throw error;
  }
};

const serviceGetOrders = async ({ search = "", status = "", page = 1, limit = 20 }) => {
  try {
    const searchRegex = new RegExp(".*" + search + ".*", "i");
    const filter = {
      ...(status ? { status } : {}),
      ...(search
        ? {
            $or: [
              { "customer.name": { $regex: searchRegex } },
              { "customer.email": { $regex: searchRegex } },
              { "customer.phone": { $regex: searchRegex } },
            ],
          }
        : {}),
    };

    const orders = await Order.find(filter)
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);
    const count = await Order.countDocuments(filter);

    return {
      orders,
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

const serviceGetOrderById = async (orderId) => {
  try {
    const order = await Order.findById(orderId).populate("user", "name email");
    if (!order) throw createError(404, "Order not found");
    return order;
  } catch (error) {
    throw error;
  }
};

const serviceUpdateOrderStatus = async (orderId, status) => {
  try {
    const allowedStatuses = [
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      throw createError(400, "Invalid order status");
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true, runValidators: true },
    );

    if (!updatedOrder) throw createError(404, "Order not found");
    return updatedOrder;
  } catch (error) {
    throw error;
  }
};

const serviceDeleteOrder = async (orderId) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(orderId);
    if (!deletedOrder) throw createError(404, "Order not found");
    return deletedOrder;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  serviceCreateOrder,
  serviceGetOrders,
  serviceGetOrderById,
  serviceUpdateOrderStatus,
  serviceDeleteOrder,
};
