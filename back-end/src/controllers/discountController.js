const Discount = require('../models/discount');

const getAllDiscounts = async (req, res) => {
    try{
        const discounts = await Discount.find();
        return res.status(200).json(discounts);
    }catch(err){
        return res.status(500).json({message: err.message});
    }
}

const createDiscount = async (req, res) => {
    try{
        const { discount_name, discount_percentage, valid_from, valid_until, conditions } = req.body;
        const newDiscount = await Discount.create({ discount_name, discount_percentage, valid_from, valid_until, conditions });
        return res.status(201).json(newDiscount);
    }catch(err){
        return res.status(500).json({message: err.message});
    }
}

const updateDiscount = async (req, res) => {
    try{
        const discount_id = req.params.id
        const updateDiscount = await Discount.findByIdAndUpdate(discount_id, req.body, {new: true});
        if(!updateDiscount){
            return res.status(404).json({message: "Discount not found"});
        }
        return res.status(200).json(updateDiscount);
    }catch(err){
        return res.status(500).json({message: err.message});
    }
}

const deleteDiscount = async (req, res) => {
    try{
        const discount_id = req.params.id;
        const deleteDiscount = await Discount.findByIdAndDelete(discount_id);
        if(!deleteDiscount){
            return res.status(404).json({message: "Discount not found"});
        }
        return res.status(200).json({message: "Discount deleted"});
    }catch(err){
        return res.status(500).json({message: err.message});
    }
}

module.exports = {
    getAllDiscounts,
    createDiscount,
    updateDiscount,
    deleteDiscount
}