const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        product_name: { type: String,},
        category_id: { type: mongoose.Schema.Types.ObjectId, ref: "Category",}, 
        collection_id: { type: mongoose.Schema.Types.ObjectId, ref: "Collection"},
        price: { type: Number,},
        discount_id: { type: mongoose.Schema.Types.ObjectId, ref: "Discount" },
        stock: { type: Number,},
        description: { type: String,},
        image_urls: [{ type: String,}],
    },
    {
        timestamps: true,
        collection: "Products", 
    }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
