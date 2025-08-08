const Category = require("../models/category");

const getAllCategories = async (req, res) => {
    try{
        const categories = await Category.find();
        return res.status(200).json(categories);
    }catch(err){
        return res.status(500).json({message: err.message});
    }
}

const createCategory = async (req,res) => {
    try{
        const {category_name, description} = req.body;
        const createCategory = await Category.create({category_name, description});
        return res.status(201).json(createCategory);
    }catch(err){
        return res.status(500).json({message: err.message});
    }
}

const updateCategory = async (req,res) => {
    try{
        const category_id = req.params.id;
        const updateCategory = await Category.findByIdAndUpdate(category_id, req.body, {new: true});
        if(!updateCategory){
            return res.status(404).json({message: "Category not found"});
        }
        return res.status(200).json(updateCategory);

    }catch(err){
        return res.status(500).json({message: err.message});
    }

}

const deleteCategory = async (req,res) => {
    try{
        const category_id = req.params.id;
        const deleteCategory = await Category.findByIdAndDelete(category_id);
        if(!deleteCategory){
            return res.status(404).json({message: "Category not found"});
        }
        return res.status(200).json({message: "Category deleted"});

    }catch(err){
        return res.status(500).json({message: err.message});
    }
}

module.exports = {
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory
}