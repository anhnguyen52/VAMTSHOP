const express = require("express");
const productRouter = require("./productRouter");
const collectionRouter = require("./collectionRouter");
const categoryRouter = require("./categoryRouter");
const discountRouter = require("./discountRouter");
const userRouter = require("./userRouter");
const orderRouter = require("./orderRouter");
const AuthRouter = require("./AuthRouter");
const cartRouter = require("./cartRouter");
const saleCampaignRouter = require("./saleCampaignRouter");

const router = express.Router();

router.use("/product", productRouter);
router.use("/collection", collectionRouter);
router.use("/category", categoryRouter);
router.use("/discount", discountRouter);
router.use("/user", userRouter);
router.use("/order", orderRouter);
router.use("/auth", AuthRouter);
router.use("/cart", cartRouter);
router.use("/saleCampaign", saleCampaignRouter);

module.exports = router;

