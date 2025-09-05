const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
      {
        product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        size: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true }
      }
    ]
  },
  {
    timestamps: true,
    collection: 'Cart'
  }
);

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;
