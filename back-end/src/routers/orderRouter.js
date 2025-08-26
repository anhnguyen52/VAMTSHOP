const express = require('express');
const { createOrder, getMyOrders, getOrderDetails, cancelOrder } = require('../controllers/orderController');
const orderRouter = express.Router();

orderRouter.post("/create", createOrder);
orderRouter.get("/getMyOrders", getMyOrders);
orderRouter.get("/getDetails/:id", getOrderDetails);
orderRouter.delete("/cancel/:id", cancelOrder);

module.exports = orderRouter;