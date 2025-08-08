const mongoose = require('mongoose');
 
const OrderSchema = new mongoose.Schema(
    {
        user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        order_status: {type: String, default: 'pending'},
        total_price: {type: Number},
        order_details: [
            {
                product_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Product'},
                quantity: {type: Number},
                price: {type: Number}
            }
        ],
        paymentMethod: {type: String},
    }, {
        timestamps: true
    }
)

const Order = mongoose.model('Order', OrderSchema, 'Orders');
module.exports = Order;