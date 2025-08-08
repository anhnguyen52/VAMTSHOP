const expres = require('express');
const { getAllDiscounts, createDiscount, updateDiscount, deleteDiscount } = require('../controllers/discountController');

const discountRouter = expres.Router();
discountRouter.get('/', getAllDiscounts);
discountRouter.post('/create/', createDiscount);
discountRouter.put('/update/:id', updateDiscount);
discountRouter.delete('/delete/:id', deleteDiscount);


module.exports = discountRouter;