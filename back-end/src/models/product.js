const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    product_name: String,
    category_id: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    collection_id: { type: mongoose.Schema.Types.ObjectId, ref: "Collection" },
    price: Number,
    stock: Number,
    sizes: [
      {
        size: String,
        quantity: Number,
        sub_sku: { type: String, unique: true },
      },
    ],
    description: String,
    image_urls: [
      {
        url: String,
        public_id: String
      }
    ],
    status: {
      type: String,
      enum: ["available", "out_of_stock", "disabled"],
      default: "available",
    },
    sku: { type: String, unique: true },
    tags: [String],
  },
  {
    timestamps: true,
    collection: "Products",
  }
);

productSchema.pre("save", function (next) {
  const product = this;

  if (!product.sku) {
    const prefix = product.product_name
      .split(" ")
      .map((word) => word[0].toUpperCase())
      .join(""); 

    const timestamp = new Date()
      .toISOString()
      .replace(/[-:.TZ]/g, "")
      .slice(0, 14); 

    product.sku = `${prefix}_${timestamp}`;
  }

  if (Array.isArray(product.sizes)) {
    product.sizes = product.sizes.map((sizeObj) => {
      if (!sizeObj.sub_sku) {
        sizeObj.sub_sku = `${product.sku}_${sizeObj.size}`;
      }
      return sizeObj;
    });
  }

  next();
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
