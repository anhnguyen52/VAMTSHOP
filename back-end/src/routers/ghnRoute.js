const express = require('express');
const ghnController = require("../controllers/GhnController");

const ghnRouter = express.Router();

ghnRouter.get("/province", ghnController.getProvince);
ghnRouter.get("/district", ghnController.getDistrict);
ghnRouter.get("/ward", ghnController.getWard);
ghnRouter.get("/calculate-fee", ghnController.calculateFee);
ghnRouter.get("/tracking/:orderId", ghnController.getTrackingDetails);
ghnRouter.post("/return/:orderId", ghnController.returnOrder);

module.exports = ghnRouter;