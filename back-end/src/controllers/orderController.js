const Order = require('../models/order');

const createOrder = async (req, res) => {
    try {
        const { user_id, order_details, paymentMethod} = req.body;

        // if (!user_id || !order_details.length) {
        //     return res.status(400).json({ message: "Missing required fields" });
        // }

        // Tính tổng tiền dựa trên order_details
        const total_price = order_details.reduce((sum, item) => sum + item.price * item.quantity, 0);

        const newOrder = new Order({
            user_id,
            total_price,
            order_details,
            paymentMethod
        });

        await newOrder.save();
        res.status(201).json({ message: "Order created successfully", order: newOrder });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// 2️⃣ Cập nhật trạng thái đơn hàng
const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { order_status } = req.body;

        const validStatus = ["pending", "completed", "cancelled"];
        if (!validStatus.includes(order_status)) {
            return res.status(400).json({ message: "Invalid order status" });
        }

        const updatedOrder = await Order.findByIdAndUpdate(orderId, { order_status }, { new: true });

        if (!updatedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.json({ message: "Order status updated successfully", order: updatedOrder });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// 3️⃣ Xem tất cả đơn hàng
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate("user_id").populate("order_details.product_id");
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// 4️⃣ Xem đơn hàng theo userId
const getOrdersByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        const orders = await Order.find({ user_id: userId }).populate("order_details.product_id");

        if (!orders.length) {
            return res.status(404).json({ message: "No orders found for this user" });
        }

        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// 5️⃣ Tính tổng số tiền đã chi cho đơn hàng của user
const getTotalSpentByUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const totalSpent = await Order.aggregate([
            { $match: { user_id: userId } },
            { $group: { _id: "$user_id", total_spent: { $sum: "$total_price" } } }
        ]);

        if (!totalSpent.length) {
            return res.status(404).json({ message: "No orders found for this user" });
        }

        res.json({ userId, total_spent: totalSpent[0].total_spent });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const getOrderDetailById = async (req, res) => {
    try {
        const { orderId } = req.params;

        const order = await Order.findOne({_id :orderId}).populate("order_details.product_id");
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        console.log(order)

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = {
    createOrder,
    updateOrderStatus,
    getAllOrders,
    getOrdersByUserId,
    getTotalSpentByUser,
    getOrderDetailById 
};