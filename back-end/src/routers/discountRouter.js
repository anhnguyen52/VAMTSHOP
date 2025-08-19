const express = require('express');
const {
  getAllDiscounts,
  getDiscountById,
  getDiscountSuitable,
  createDiscount,
  updatedDiscount,
  deleteDiscount
} = require('../controllers/discountController');

const discountRouter = express.Router();

discountRouter.get('/getAll', getAllDiscounts);
discountRouter.get('/suitable', getDiscountSuitable);
discountRouter.get('/getById/:id', getDiscountById);
discountRouter.post('/create', createDiscount);
discountRouter.put('/update/:id', updatedDiscount);
discountRouter.delete('/delete/:id', deleteDiscount);

module.exports = discountRouter;
