const express = require('express');
const {createOrder, getAllOrders,getMyOrders,getOrderDetails,updateOrderStatus,cancelOrder,confirmOrder, updateBoxInfo} = require('../controllers/orderController');
const { authUserMiddleware } = require('../middleware/authMiddleware');
const orderRouter = express.Router();

orderRouter.post("/create",authUserMiddleware, createOrder);
orderRouter.get("/getAllOrders", getAllOrders);
orderRouter.get("/getMyOrders",authUserMiddleware, getMyOrders);
orderRouter.get("/getDetails/:id", getOrderDetails);
orderRouter.put("/cancel/:id", cancelOrder);
orderRouter.put("/updateStatus/:id", updateOrderStatus);
orderRouter.post("/confirm/:id", confirmOrder);
orderRouter.put("/updateBoxInfo/:id", updateBoxInfo);

module.exports = orderRouter;