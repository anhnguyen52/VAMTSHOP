const mongoose = require('mongoose');

const discountSchema = new mongoose.Schema(
    {
        discount_name: { type: String, required: true },
        discount_percentage: { type: Number, required: true },
        valid_from: { type: Date, required: true },
        valid_until: { type: Date, required: true },
        conditions: { type: String, required: true },
    }, 
    {
        timestamps: true,
        collection: 'Discounts'
    }
)

module.exports = mongoose.model('Discount', discountSchema);
