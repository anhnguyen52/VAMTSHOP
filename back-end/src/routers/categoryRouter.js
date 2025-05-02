const express = require('express');
const { getAllCategories, createCategory, updateCategory, deleteCategory } = require('../controllers/categoriesController');

const categoryRouter = express.Router();
categoryRouter.get('/', getAllCategories);
categoryRouter.post('/create/', createCategory);
categoryRouter.put('/update/:id', updateCategory);
categoryRouter.delete('/delete/:id', deleteCategory);

module.exports = categoryRouter;