const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    discountUsed: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Discount",
    },
    pointUsed: {
      type: Number,
      default: 0,
      min: 0,
    },
    paymentMethod: {
      type: String,
      enum: ["COD", "Online"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Completed", "Failed"],
      default: "Pending",
    },

    orderStatus: {
      type: String,
      enum: ["Pending", "Processing", "Cancelled", "Completed"],
      default: "Pending",
    },

    shippingStatus: {
      type: String,
      enum: [
        "pending",
        "processing",
        "ready_to_pick",
        "delivering",
        "delivered",
        "returned",
        "waiting_to_return",
        "cancelled",
        "lost",
      ],
      default: "pending",
    },

    shippingInfo: {
      name: { type: String, required: true },
      phoneNumber: { type: String, required: true },
      address: { type: String, required: true },
      provinceName: { type: String, required: true },
      districtName: { type: String, required: true },
      wardName: { type: String, required: true },
      note: { type: String, default: "" },
      fee: { type: Number, default: 0 },
    },

    trackingNumber: {
      type: String,
      default: null,
      unique: true,
    },

    expireAt: {
      type: Date,
      default: () => new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
