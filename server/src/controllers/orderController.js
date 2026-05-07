const { successResponse } = require("../helpers/responseHelper");
const {
  serviceCreateOrder,
  serviceGetOrders,
  serviceGetOrderById,
  serviceUpdateOrderStatus,
  serviceDeleteOrder,
} = require("../services/orderService");

const handleCreateOrder = async (req, res, next) => {
  try {
    const userId = req.user?.user?._id || null;
    const order = await serviceCreateOrder(req.body, userId);

    return successResponse(res, {
      statusCode: 201,
      message: "Order placed successfully...",
      payload: { order },
    });
  } catch (error) {
    next(error);
  }
};

const handleGetOrders = async (req, res, next) => {
  try {
    const search = req.query.search || "";
    const status = req.query.status || "";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;

    const { orders, count, pagination } = await serviceGetOrders({
      search,
      status,
      page,
      limit,
    });

    return successResponse(res, {
      statusCode: 200,
      message: `${count} orders are returning successfully...`,
      payload: { orders, pagination },
    });
  } catch (error) {
    next(error);
  }
};

const handleGetOrderById = async (req, res, next) => {
  try {
    const order = await serviceGetOrderById(req.params.id);

    return successResponse(res, {
      statusCode: 200,
      message: "Order returned successfully...",
      payload: { order },
    });
  } catch (error) {
    next(error);
  }
};

const handleUpdateOrderStatus = async (req, res, next) => {
  try {
    const order = await serviceUpdateOrderStatus(req.params.id, req.body.status);

    return successResponse(res, {
      statusCode: 200,
      message: "Order status updated successfully...",
      payload: { order },
    });
  } catch (error) {
    next(error);
  }
};

const handleDeleteOrder = async (req, res, next) => {
  try {
    const order = await serviceDeleteOrder(req.params.id);

    return successResponse(res, {
      statusCode: 200,
      message: "Order deleted successfully...",
      payload: { order },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleCreateOrder,
  handleGetOrders,
  handleGetOrderById,
  handleUpdateOrderStatus,
  handleDeleteOrder,
};
