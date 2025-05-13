const express = require('express');
const { getCart, addItemInCart, removeQuantityItem, deleteItemFromCart, mergeCarts } = require('../controllers/cartController');

const cartRouter = express.Router();
cartRouter.get('/:id', getCart);
cartRouter.post('/addItem/:id', addItemInCart);
cartRouter.put('/removeQuantityItem/:user_id/:product_id', removeQuantityItem);
cartRouter.delete('/deleteItemFromCart/:user_id/:product_id', deleteItemFromCart);
cartRouter.put('/mergeCart/:user_id', mergeCarts);

module.exports = cartRouter;