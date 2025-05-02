const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema(
    {
        collection_name: { type: String, required: true },
        description: { type: String, required: true },
    },
    {
        timestamps: true,
        collection: "Collections",
    }
);

const Collection = mongoose.model("Collection", collectionSchema);
module.exports = Collection;