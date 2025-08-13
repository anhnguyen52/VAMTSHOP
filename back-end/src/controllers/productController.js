const { cloudinary } = require("../../config/cloudinary");
const Product = require("../models/product");

const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find()
            .populate("category_id")
            .populate("collection_id");
        return res.status(200).json(products);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const getLatestProducts = async (req, res) => {
    try {
        const products = await Product.find()
            .sort({ createdAt: -1 })
            .limit(4)
            .populate("category_id")
            .populate("collection_id");
        return res.status(200).json(products);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const getProductById = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findById(productId)
            .populate("category_id")
            .populate("collection_id");
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        return res.status(200).json(product);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const createProduct = async (req, res) => {
  try {
    let {
      product_name,
      category_id,
      collection_id,
      price,
      stock,
      description,
      sizes,
      tags
    } = req.body;

    if (!product_name || !category_id || !collection_id || !price || !stock || !description) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (typeof sizes === 'string') {
      try {
        sizes = JSON.parse(sizes);
      } catch (err) {
        return res.status(400).json({ message: "Invalid sizes format" });
      }
    }

    if (typeof tags === 'string') {
      try {
        tags = JSON.parse(tags);
      } catch (err) {
        return res.status(400).json({ message: "Invalid tags format" });
      }
    }

    // Map ảnh thành object { url, public_id }
    const image_urls = req.files.map(file => ({
      url: file.path,           // Cloudinary URL hoặc local path
      public_id: file.filename  // public_id từ Cloudinary hoặc tên file
    }));

    const newProduct = await Product.create({
      product_name,
      category_id,
      collection_id,
      price,
      stock,
      description,
      image_urls,
      sizes,
      tags
    });

    return res.status(201).json(newProduct);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};



const updateProduct = async (req, res) => {
    try {
        const product_id = req.params.id;

        // Không cho cập nhật sku 
        delete req.body.sku;

        if (req.body.sizes) {
            req.body.sizes = req.body.sizes.map(({ size, quantity }) => ({ size, quantity }));
        }

        // Nếu có file ảnh upload mới => cập nhật image_urls
        if (req.files && req.files.length > 0) {
            const image_urls = req.files.map(file => file.path); // file.path là đường dẫn ảnh trên Cloudinary
            req.body.image_urls = image_urls;
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            product_id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        return res.status(200).json(updatedProduct);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};


const deleteProduct = async (req, res) => {
  try {
    const product_id = req.params.id;

    const product = await Product.findById(product_id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Xóa từng ảnh trên Cloudinary
    if (product.image_urls && product.image_urls.length > 0) {
      for (const img of product.image_urls) {
        if (img.public_id) {
          await cloudinary.uploader.destroy(img.public_id);
        }
      }
    }

    await Product.findByIdAndDelete(product_id);

    return res.status(200).json({ message: "Product and images deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};


module.exports = {
    getAllProducts,
    getLatestProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};
