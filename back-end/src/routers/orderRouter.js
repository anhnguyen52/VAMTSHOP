const express = require('express');
const { createOrder,updateOrderStatus,getAllOrders,getOrdersByUserId,getTotalSpentByUser,getOrderDetailById } = require('../controllers/orderController');
const orderRouter = express.Router();

orderRouter.post("/add-order", createOrder); 
orderRouter.put("/update-status/:orderId", updateOrderStatus); 
orderRouter.get("/all-orders", getAllOrders); 
orderRouter.get("/user-orders/:userId", getOrdersByUserId);
orderRouter.get("/total-spent/:userId", getTotalSpentByUser); 
orderRouter.get("/:orderId", getOrderDetailById);

module.exports = orderRouter;