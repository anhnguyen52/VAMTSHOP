const Product = require("../models/product");

const getAllProducts = async (req, res) => {
    try{
        const products = await Product.find()
        .populate("category_id")
        .populate("collection_id")
        .populate("discount_id");
        return res.status(200).json(products);
    }catch(err){
        return res.status(500).json({message: err.message});
    }
}

const getLatestProducts = async (req, res) => {
    try {
        const products = await Product.find()
            .sort({ createdAt: -1 }) 
            .limit(4) 
            .populate("category_id")
            .populate("collection_id")
            .populate("discount_id");

        return res.status(200).json(products);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};


const getProductById = async (req, res) => {
    try{
        const productId = req.params.id
        const product = await Product.findById(productId)
        .populate("category_id")
        .populate("collection_id")
        .populate("discount_id");
        return res.status(200).json(product);
    }catch(err){
        return res.status(500).json({message: err.message});
    }
}

const createProduct = async (req, res) => {
    try{    
        const { product_name, category_id, collection_id, price, discount_id,  stock, description, image_urls } = req.body;
        // Kiểm tra dữ liệu đầu vào
        if (!product_name || !category_id || !collection_id || !price || !stock || !description) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        const newProduct = await Product.create({
            product_name,
            category_id,
            collection_id,
            price,
            discount_id,
            stock,
            description,
            image_urls
        });
        return res.status(201).json(newProduct);
    }catch(err){
        return res.status(500).json({message: err.message});
    }
}

const updateProduct = async (req, res) => {
    try{
        const product_id = req.params.id;
        const updatedProduct = await Product.findByIdAndUpdate(product_id, req.body, {new: true});
        if(!updatedProduct){
            return res.status(404).json({message: "Product not found"});
        }
        return res.status(200).json(updatedProduct);
    }catch(err){
        return res.status(500).json({message: err})
    }
}

const deleteProduct = async (req, res) => {
    try{
        const product_id = req.params.id;
        const deletedProduct = await Product.findByIdAndDelete(product_id);
        if(!deletedProduct){
            return res.status(404).json({message: "Product not found"});
        }
        return res.status(200).json(deletedProduct);
    }catch(err){
        return res.status(500).json({message: err.message});
    }
}

module.exports = {
    getAllProducts,
    getLatestProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
}   