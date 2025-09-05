const Cart = require('../models/cart');
const User = require('../models/user');
const Product = require('../models/product');
const { updateCategory } = require('./categoriesController');

const getCart = async (req, res) => {
    try{
        const userId = req.params.id;
        const cart = await Cart.findOne({user_id: userId})
        if(!cart){
            return res.status(404).json({message: "Cart not found"});
        }
        return res.status(200).json(cart);
    }catch(e){
        return res.status(500).json({message: e.message});
    }
}

addItemInCart = async (req, res) => {
    try{
        const userId = req.params.id;
        const { product_id, quantity, size , price } = req.body;
        const cart = await Cart.findOne({ user_id: userId });

        if (!cart) {
          const newCart = await Cart.create({
            user_id: userId,
            items: [{ product_id, quantity, size , price }],
          });
          return res.status(200).json(newCart);
        }

        const existingItem = cart.items.find(item => item.product_id.toString() === product_id && item.size === size);
        if (existingItem) {
            const newQuantity = existingItem.quantity + 1;

            const product = await Product.findById(product_id); 
            if (!product) {
                return res.status(404).json({ message: "Sản phẩm không tồn tại" });
            }

            if (newQuantity > product.stock) {
                return res.status(400).json({ message: "Vượt quá số lượng tồn kho" });
            }

            existingItem.quantity = newQuantity;
        }
        else {
          cart.items.push({ product_id, quantity, size , price });
        }
        await cart.save();
        const updatedCart = await Cart.findOne({ user_id: userId }).populate('items.product_id');
        return res.status(200).json(updatedCart);
        
    }catch(e){
        return res.status(500).json({message: e.message});
    }
}

const removeQuantityItem = async (req, res) => {
    try {
        const userId = req.params.user_id;
        const product_id = req.params.product_id;
        const size = req.query.size;

        const cart = await Cart.findOne({ user_id: userId });

        const itemIndex = cart.items.findIndex(item =>
            item.product_id.toString() === product_id && item.size === size
        );

        if (itemIndex === -1) {
            return res.status(404).json({ message: "Product not found in cart" });
        }

        const item = cart.items[itemIndex];

        if (item.quantity > 1) {
            cart.items[itemIndex].quantity -= 1;
        } else {
            cart.items.splice(itemIndex, 1); // remove item from array
        }

        await cart.save();
        await cart.populate('items.product_id');

        return res.status(200).json(cart);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


deleteItemFromCart = async (req, res) => {
    try{
        const userId = req.params.user_id;
        const product_id = req.params.product_id;
        const size = req.query.size; 
        
        const cart = await Cart.findOneAndUpdate(
            {user_id: userId},
            {$pull: {items: {product_id, size}}},
            {new: true}
        ).populate('items.product_id');
        return res.status(200).json(cart);
    }catch(e){
        return res.status(500).json({message: e.message});
    }
}

mergeCarts = async (req, res) => {
  try {
    const userId = req.params.user_id;
    const localCart = req.body; // [{ product_id, size, quantity, price }]

    let cart = await Cart.findOne({ user_id: userId });

    if (!cart) {
      const newCart = await Cart.create({
        user_id: userId,
        items: localCart
      });
      return res.status(200).json(newCart);
    }

    // Map key: product_id + size
    const dbItemsMap = new Map(
      cart.items.map(item => [
        `${item.product_id.toString()}_${item.size || ''}`,
        item
      ])
    );

    for (const localItem of localCart) {
      const key = `${localItem.product_id}_${localItem.size || ''}`;

      if (dbItemsMap.has(key)) {
        dbItemsMap.get(key).quantity += localItem.quantity;
      } else {
        cart.items.push({
          product_id: localItem.product_id,
          size: localItem.size,
          quantity: localItem.quantity,
          price: localItem.price
        });
      }
    }

    await cart.save();
    await cart.populate('items.product_id');

    return res.status(200).json(cart);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};


module.exports = {
    getCart,
    addItemInCart,
    removeQuantityItem,
    deleteItemFromCart,
    mergeCarts
}