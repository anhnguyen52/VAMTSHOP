const Collection = require("../models/collection");

const getAllCollections = async (req, res) => {
    try {
        const collections = await Collection.find();
        return res.status(200).json(collections);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const createCollection = async (req, res) => {
    try {
        const { collection_name, description } = req.body;
        const newCollection = await Collection.create({ collection_name, description });
        return res.status(201).json(newCollection);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const updateCollection = async (req, res) => {
    try {
        const collection_id = req.params.id;
        const updatedCollection = await Collection.findByIdAndUpdate(collection_id, req.body, { new: true });
        if (!updatedCollection) {
            return res.status(404).json({ message: "Collection not found" });
        }
        return res.status(200).json(updatedCollection);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const deleteCollection = async (req, res) => {
    try {
        const collection_id = req.params.id;
        const deletedCollection = await Collection.findByIdAndDelete(collection_id);
        if (!deletedCollection) {
            return res.status(404).json({ message: "Collection not found" });
        }
        return res.status(200).json({ message: "Collection deleted" });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getAllCollections,
    createCollection,
    updateCollection,
    deleteCollection
};
