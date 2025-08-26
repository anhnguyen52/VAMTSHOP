const mongoose = require('mongoose');

const discountSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      match: [/^[A-Z0-9]{6}$/, "Mã giảm giá phải có đúng 6 ký tự, chỉ gồm chữ in hoa và số"],
    },
    type: {
      type: String,
      required: true,
      enum: ["fixed", "percentage"],
    },
    value: {
      type: Number,
      required: true,
      validate: {
        validator(v) {
          return this.type === "percentage"
            ? Number.isInteger(v) && v > 0 && v <= 100
            : v > 0;
        },
        message: (props) => `Giá trị giảm giá không hợp lệ: ${props.value}`,
      },
    },
    usageLimit: { type: Number, required: true, min: 1 },
    usedCount: { type: Number, default: 0 },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },

    conditions: {
      minPurchase: { type: Number, default: 0 },   
      minOrders: { type: Number, default: 0 },      
      minItemsInCart: { type: Number, default: 0 }, 
    },
  },
  { timestamps: true }
);


module.exports = mongoose.models.Discount || mongoose.model('Discount', discountSchema, 'Discounts');
