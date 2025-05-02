const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authAdminMiddleware, authUserMiddleware } = require("../middleware/authMiddleware");

router.post("/sign-up", userController.createUser);
router.post("/login", userController.loginUser);
router.post("/logout/:id", userController.logoutUser);
router.put("/update-user/:id", userController.updateUser);
router.get("/getAll", authAdminMiddleware, userController.getAllUsers);
router.delete("/delete-user/:id", authAdminMiddleware, userController.deleteUser);
router.get('/get-details/:id', authUserMiddleware, userController.getDetailsUser);
router.post('/refresh-token', userController.refreshToken);
router.put('/change-password/:id', authUserMiddleware, userController.changePassword);
router.put('/update-profile/:id', authUserMiddleware, userController.updateProfile);

module.exports = router;
