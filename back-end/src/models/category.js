const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
    {
        category_name: { type: String, required: true },
        description: { type: String, required: true },
    },
    {
        timestamps: true,
        collection: "Categories",
    }
);

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;