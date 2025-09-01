const Order = require("../models/order");
const Product = require("../models/product");
const Cart = require("../models/cart");
const Discount = require("../models/discount");
const User = require("../models/user");
const sendEmail = require("../utils/sendMail");
const { applySaleCampaignsToProducts } = require("../utils/applyDiscount");
const { GHN_API_URL, GHN_TOKEN, GHN_SHOP_ID, GHN_SERVICE_TYPE_NHE } =
  process.env;
const axios = require("axios");

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product", "product_name images price")
      .populate("discountUsed");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Lỗi lấy danh sách đơn hàng", error });
  }
};

const createOrder = async (req, res) => {
  try {
    console.log("req.user.id:", req.user.id);
    const cart = await Cart.findOne({ user_id: req.user.id });
    console.log("cart:", cart);

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Giỏ hàng không được để trống!" });
    }

    const { shippingInfo, paymentMethod, discountUsed, pointUsed } = req.body;
    const discount = discountUsed ? await Discount.findById(discountUsed) : null;
    const userId = req.user.id;

    const productIds = cart.items.map((item) => item.product_id);
    const products = await Product.find({ _id: { $in: productIds } });
    const discountedProducts = await applySaleCampaignsToProducts(products);

    let totalAmount = 0;
    let items = [];
    let itemsHtml = "";

    for (const item of cart.items) {
      const product = discountedProducts.find(
        (p) => p._id.toString() === item.product_id.toString()
      );
      if (!product) {
        return res
          .status(404)
          .json({ message: `Sản phẩm ID ${item.product_id} không tồn tại!` });
      }
      if (product.stock < item.quantity) {
        return res
          .status(400)
          .json({ message: `Sản phẩm "${product.product_name}" không đủ hàng!` });
      }

      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      items.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
      });

      itemsHtml += `
        <tr>
          <td style="padding: 10px; font-size: 14px; color: #2c3e50;">${product.product_name}</td>
          <td style="padding: 10px; font-size: 14px; color: #2c3e50; text-align: right;">${item.quantity}</td>
          <td style="padding: 10px; font-size: 14px; color: #2c3e50; text-align: right;">${itemTotal.toLocaleString(
            "vi-VN"
          )} VND</td>
        </tr>`;
    }

    if (discount) {
      if (discount.type === "fixed") {
        totalAmount -= discount.value;
      } else if (discount.type === "percentage") {
        totalAmount -= (totalAmount * discount.value) / 100;
      }
    }

    totalAmount -= pointUsed;

    if (paymentMethod === "COD" && totalAmount > 500000) {
      return res.status(400).json({
        message: "Thanh toán khi nhận hàng chỉ áp dụng cho đơn dưới 500.000đ",
      });
    }

    const newOrder = new Order({
      user: userId,
      items,
      shippingInfo,
      paymentMethod,
      discountUsed,
      pointUsed,
      paymentStatus: "Pending",
      orderStatus: "Pending",
    });

    const savedOrder = await newOrder.save();

    // Xóa giỏ hàng sau khi tạo đơn
    await Cart.findOneAndUpdate(
      { user: userId },
      { $set: { items: [] } },
      { new: true }
    );

    // Cập nhật số lượt dùng mã giảm giá (nếu có)
    if (savedOrder && discount) {
      discount.usedCount = discount.usedCount + 1;
      await discount.save();
    }

    // Gửi email xác nhận
    const user = await User.findById(userId);
    const shippingInfoStr = `${shippingInfo.address}, ${shippingInfo.provineName}, ${shippingInfo.districtName}, ${shippingInfo.wardName}`;
    await sendEmail(
      user.email,
      {
        orderId: savedOrder._id.toString(),
        paymentMethod:
          paymentMethod === "COD"
            ? "Thanh toán khi nhận hàng"
            : "Thanh toán trực tuyến",
        totalAmount,
        itemsHtml,
        shippingInfo: shippingInfoStr,
      },
      "orderConfirmation"
    );

    res.status(201).json({ data: savedOrder, totalAmount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const updateOrderStatus = async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus: req.body.orderStatus },
      { new: true }
    ).populate("items.product");

    if (!updatedOrder) {
      return res.status(404).json({ message: "Đơn hàng không tồn tại" });
    }

    if (
      updatedOrder.paymentStatus === "Completed" &&
      updatedOrder.orderStatus === "Cancelled"
    ) {
      for (const item of updatedOrder.items) {
        const product = item.product;
        if (product) {
          product.stock += item.quantity;
          await product.save();
        }
      }
    }

    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error("Error updateOrderStatus:", error);
    res
      .status(500)
      .json({ message: "Lỗi cập nhật trạng thái đơn hàng", error });
  }
};

const updateBoxInfo = async (req, res) => {
  try {
    const { boxInfo } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    order.boxInfo = boxInfo;
    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};


async function getMyOrders(req, res) {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("items.product", "product_name images price")
      .sort({ createdAt: -1 });
    return res.json({ data: orders });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

// Chi tiết đơn hàng
async function getOrderDetails(req, res) {
  const orderId = req.params.id;
  const user = req.user;
  try {
    const order = await Order.findById(orderId)
      .populate("items.product", "product_name images price")
      .populate("discountUsed", "code value type");

    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }
    if (
      order.user.toString() !== user._id.toString() &&
      user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    return res.status(200).json({ data: order });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
}


//Xác nhận đơn hàng (Admin)
const confirmOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId)
      .populate("items.product", "stock")
      .populate("discountUsed");
    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    if (order.orderStatus !== "Pending") {
      return res.status(400).json({ message: "Đơn hàng đã được xác nhận" });
    }

    if (
      order.paymentMethod === "Online" &&
      order.paymentStatus !== "Completed"
    ) {
      return res.status(400).json({ message: "Đơn hàng chưa được thanh toán" });
    }

    if (order.boxInfo === null) {
      return res.status(400).json({
        message: "Vui lòng nhập thông tin (weight, length, width, height)",
      });
    }

    let totalValue = 0;
    for (const item of order.items) {
      const product = item.product;
      if (product.stock < item.quantity) {
        return res
          .status(400)
          .json({ message: `Sản phẩm "${product.product_name}" không đủ hàng!` });
      }
      totalValue += item.price * item.quantity;
    }

    if (order.discountUsed) {
      if (order.discountUsed.type === "percentage") {
        totalValue -= (totalValue * order.discountUsed.value) / 100;
      } else if (order.discountUsed.type === "fixed") {
        totalValue -= order.discountUsed.value;
      }
    }

    totalValue -= order.pointUsed;

    const response = await axios.post(
      `${GHN_API_URL}/v2/shipping-order/create`,
      {
        payment_type_id: order?.paymentMethod === "COD" ? 2 : 1,
        note: order?.shippingInfo?.note,
        required_note: "KHONGCHOXEMHANG",
        to_name: order?.shippingInfo?.name,
        to_phone: order?.shippingInfo?.phoneNumber,
        to_address: order?.shippingInfo?.address,
        to_province_name: order?.shippingInfo?.provinceName,
        to_district_name: order?.shippingInfo?.districtName,
        to_ward_name: order?.shippingInfo?.wardName,
        content: order?._id,
        cod_amount: order?.paymentMethod === "COD" ? totalValue : 0,
        weight: order?.boxInfo?.weight,
        length: order?.boxInfo?.length,
        width: order?.boxInfo?.width,
        height: order?.boxInfo?.height,
        cod_failed_amount: totalValue,
        insurance_value: totalValue,
        service_type_id: 2,
      },  
      {
        headers: {
          Token: GHN_TOKEN,
          ShopId: GHN_SHOP_ID,
        },
      }
    );

    const dataResponse = response.data;
    if (dataResponse?.code === 200) {
      order.orderStatus = "Processing";
      const orderCode = dataResponse?.data?.order_code;
      order.trackingNumber = orderCode;

      await Promise.all(
        order.items.map(async (item) => {
          const product = item.product;
          product.stock -= item.quantity;
          await product.save();
        })
      );
      await order.save();
      res
        .status(200)
        .json({ message: "Xác nhận đơn hàng thành công", orderCode });
    } else {
      res.status(400).json({ message: dataResponse?.message });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error?.response?.data?.message });
  }
};

// Hủy đơn hàng
async function cancelOrder(req, res) {
  try {
    const order = await Order.findById(req.params.id);
    if (!order)
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });

    if (order.paymentStatus !== "Pending" || order.orderStatus !== "Pending") {
      return res.status(400).json({ message: "Đơn hàng không thể hủy" });
    }

    order.orderStatus = "Cancelled";
    await order.save();

    res.json({ message: "Đã hủy đơn hàng" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = {
  getAllOrders,
  createOrder,
  updateOrderStatus,
  getMyOrders,
  getOrderDetails,
  cancelOrder,
  confirmOrder,
  updateBoxInfo
};
