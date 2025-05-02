const express = require("express");
const router = express.Router();
const productController = require('../controllers/authController');

router.post("/send-otp", productController.sendOtp);
router.post("/verify-otp", productController.verifyOtp);
router.post("/reset-password", productController.resetPassword)


module.exports = router;
