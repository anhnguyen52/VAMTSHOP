const Discount = require("../models/Discount");

const getAllDiscounts = async (req, res) => {
  try {
    const discounts = await Discount.find();
    res.json(discounts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDiscountById = async (req, res) => {
  try {
    const discount = await Discount.findById(req.params.id);
    if (!discount) {
      return res.status(404).json({ message: "Discount not found" });
    }
    res.json(discount);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const createDiscount = async (req, res) => {
  try {
    const body = req.body;

    if (new Date(body.endDate) <= new Date(body.startDate)) {
      return res
        .status(400)
        .json({ message: "Ngày kết thúc phải sau ngày bắt đầu" });
    }

    const discount = await Discount.create(body);
    res.status(201).json({ message: "Tạo thành công", discount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const changeStatusDiscount = async (req, res) => {
  try {
    const discount = await Discount.findById(req.params.id);
    if (!discount) {
      return res.status(404).json({ message: "Discount not found" });
    }
    discount.isActive = !discount.isActive;
    await discount.save();
    res.status(200).json({ message: "Discount status updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updatedDiscount = async (req, res) => {
  try {
    const { id } = req.params;

    const ALLOWED = [
      "code",
      "type",
      "value",
      "usageLimit",
      "startDate",
      "endDate",
      "isActive",
      "conditions", 
    ];

    const update = {};
    Object.keys(req.body).forEach((k) => {
      if (ALLOWED.includes(k)) update[k] = req.body[k];
    });

    if (update.startDate || update.endDate) {
      const current = await Discount.findById(id);
      if (!current)
        return res.status(404).json({ message: "Discount không tồn tại" });

      const start = update.startDate
        ? new Date(update.startDate)
        : current.startDate;
      const end = update.endDate ? new Date(update.endDate) : current.endDate;

      if (end <= start)
        return res
          .status(400)
          .json({ message: "Ngày kết thúc phải sau ngày bắt đầu" });
    }

    const updated = await Discount.findByIdAndUpdate(
      id,
      { $set: update },
      { new: true, runValidators: true }
    );
    if (!updated)
      return res.status(404).json({ message: "Discount không tồn tại" });

    res.json({ message: "Cập nhật thành công", discount: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteDiscount = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Discount.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Discount không tồn tại" });
    }
    res.json({ message: "Xóa thành công" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getDiscountSuitable = async (req, res) => {
  try {
    const { amount,  userOrderCount = 0, cartQuantity = 0 } = req.query;

    if (!amount || isNaN(amount) || amount < 0) {
      return res.status(400).json({ message: "Số tiền không hợp lệ" });
    }

    const today = new Date();

    const query = {
      isActive: true,
      startDate: { $lte: today },
      endDate: { $gte: today },
      $expr: { $lt: ["$usedCount", "$usageLimit"] },
    };

    let discounts = await Discount.find(query);

    discounts = discounts.filter((d) => {
      if (d.conditions.minPurchase && amount < d.conditions.minPurchase) return false;
      if (d.conditions.minOrders && userOrderCount < d.conditions.minOrders) return false;
      if (d.conditions.minItemsInCart && cartQuantity < d.conditions.minItemsInCart) return false;
      return true;
    });

    res.json({ discounts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDiscountSuitable,
};


const discountController = {
  getAllDiscounts,
  getDiscountById,
  getDiscountSuitable,
  deleteDiscount,
  createDiscount,
  changeStatusDiscount,
  updatedDiscount,
};

module.exports = discountController;
