const express = require("express");
const saleCampaignController = require("../controllers/saleCampaignController");

const saleCampaignRouter = express.Router();

saleCampaignRouter.post("/create", saleCampaignController.createCampaign);

saleCampaignRouter.put("/update/:id", saleCampaignController.updateCampaign);

saleCampaignRouter.delete("/delete/:id", saleCampaignController.deleteCampaign);

saleCampaignRouter.get("/getAll", saleCampaignController.getAllCampaigns);

saleCampaignRouter.get("/getById/:id", saleCampaignController.getCampaignById);

// Lấy tất cả sản phẩm trong 1 campaign (có tính giá sale)
saleCampaignRouter.get("/getProductsInCampaign/:id", saleCampaignController.getProductsInCampaign);

// Kiểm tra sản phẩm bị trùng campaign (dùng khi tạo hoặc update)
saleCampaignRouter.post("/check-conflicts", saleCampaignController.checkProductConflicts);

// Preview check conflict (trước khi save)
saleCampaignRouter.post("/check-conflicts-preview", saleCampaignController.checkProductConflictsPreview);

module.exports = saleCampaignRouter;
