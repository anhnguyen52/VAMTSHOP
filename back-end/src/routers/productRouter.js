const express = require("express");
const {getAllProducts,getLatestProducts, getProductById, createProduct, updateProduct, deleteProduct} = require("../controllers/productController");

const productRouter = express.Router();
productRouter.get("/", getAllProducts);
productRouter.get("/4newproduct", getLatestProducts);
productRouter.get("/:id", getProductById);
productRouter.post("/create", createProduct);
productRouter.put("/update/:id", updateProduct);
productRouter.delete("/delete/:id", deleteProduct);


module.exports = productRouter;