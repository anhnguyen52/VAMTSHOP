const express = require("express");
const {getAllProducts,getLatestProducts, getProductById, createProduct, updateProduct, deleteProduct} = require("../controllers/productController");
const { uploadMultiple } = require("../../config/cloudinary");

const productRouter = express.Router();
productRouter.get("/", getAllProducts);
productRouter.get("/4newproduct", uploadMultiple, getLatestProducts);
productRouter.get("/:id", getProductById);
productRouter.post("/create", uploadMultiple, createProduct);
productRouter.put("/update/:id", uploadMultiple, updateProduct);
productRouter.delete("/delete/:id", deleteProduct);


module.exports = productRouter;