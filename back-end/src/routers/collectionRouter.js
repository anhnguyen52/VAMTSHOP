const express = require('express');

const { getAllCollections, createCollection, updateCollection, deleteCollection } = require('../controllers/collectionController');

const collectionRouter = express.Router();
collectionRouter.get('/', getAllCollections);
collectionRouter.post('/create/', createCollection);
collectionRouter.put('/update/:id', updateCollection );
collectionRouter.delete('/delete/:id', deleteCollection);

module.exports = collectionRouter;