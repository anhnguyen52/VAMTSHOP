const SaleCampaign = require("../models/saleCampaign");
const Product = require("../models/product");

exports.createCampaign = async (req, res) => {
  try {
    const { name, description, products, percentage, startDate, endDate } =
      req.body;

    const image_urls = req.files.map(file => ({
      url: file.path,           // Cloudinary URL hoặc local path
      public_id: file.filename  // public_id từ Cloudinary hoặc tên file
    }));

    const campaign = await SaleCampaign.create({
      name,
      description,
      image_urls,
      products,
      percentage,
      startDate,
      endDate,
      isActive: true,
    });

    res.status(201).json({ success: true, data: campaign });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateCampaign = async (req, res) => {
  try {
    const { id } = req.params;

      // Nếu có file ảnh upload mới => cập nhật image_urls
        if (req.files && req.files.length > 0) {
            const image_urls = req.files.map(file => file.path); // file.path là đường dẫn ảnh trên Cloudinary
            req.body.image_urls = image_urls;
        }
    const updated = await SaleCampaign.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteCampaign = async (req, res) => {
  try {
    const { id } = req.params;
    const campaign = await SaleCampaign.findById(id);
    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    // Xóa từng ảnh trên Cloudinary
    if (campaign.image_urls && campaign.image_urls.length > 0) {
      for (const img of campaign.image_urls) {
        if (img.public_id) {
          await cloudinary.uploader.destroy(img.public_id);
        }
      }
    }
    await SaleCampaign.findByIdAndDelete(id);
    res.json({ success: true, message: "Campaign deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAllCampaigns = async (req, res) => {
  try {
    const campaigns = await SaleCampaign.find().populate("products");
    res.json({ success: true, data: campaigns });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getCampaignById = async (req, res) => {
    try {
        const { id } = req.params;
        const campaign = await SaleCampaign.findById(id).populate("products");

        if (!campaign) {
            return res.status(404).json({ success: false, message: "Campaign not found" });
        }

        res.json({ success: true, data: campaign });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};


// Lấy tất cả sản phẩm trong 1 campaign (có tính giá sale)
exports.getProductsInCampaign = async (req, res) => {
  try {
    const { id } = req.params;
    const campaign = await SaleCampaign.findById(id).populate("products");

    if (!campaign) {
      return res.status(404).json({ success: false, message: "Campaign not found" });
    }

    // Tính giá sau giảm
    const productsWithDiscount = campaign.products.map((product) => {
      const discountedPrice = Math.round(
        product.price - (product.price * campaign.percentage) / 100
      );

      return {
        ...product.toObject(),
        discountedPrice,
        campaign: {
          name: campaign.name,
          percentage: campaign.percentage,
          startDate: campaign.startDate,
          endDate: campaign.endDate,
        },
      };
    });

    res.json({ success: true, data: productsWithDiscount });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// Check active campaigns (kiểm tra sản phẩm bị trùng campaign)
exports.checkProductConflicts = async (req, res) => {
  try {
    const { products, startDate, endDate, campaignId } = req.body;
    const start = new Date(startDate);
    const end = new Date(endDate);

    const campaigns = await SaleCampaign.find({
      _id: { $ne: campaignId }, 
      products: { $in: products },
      isActive: true,
      startDate: { $lte: end },
      endDate: { $gte: start },
    });

    const conflictedProducts = campaigns.flatMap((c) =>
      c.products.filter((p) => products.includes(p.toString()))
    );

    res.json({
      conflictedProducts: [...new Set(conflictedProducts.map((id) => id.toString()))],
    });
  } catch (err) {
    res.status(500).json({
      message: "Lỗi kiểm tra sản phẩm trùng campaign",
      error: err.message,
    });
  }
};

// Preview check conflict
exports.checkProductConflictsPreview = async (req, res) => {
  try {
    const { products, startDate, endDate, campaignId } = req.body;
    const start = new Date(startDate);
    const end = new Date(endDate);

    const campaigns = await SaleCampaign.find({
      _id: { $ne: campaignId },
      products: { $in: products },
      isActive: true,
      startDate: { $lte: end },
      endDate: { $gte: start },
    });

    const conflictedProducts = campaigns.flatMap((c) =>
      c.products.map((p) => p.toString())
    );

    res.json({
      conflictedProducts: [...new Set(conflictedProducts)],
    });
  } catch (err) {
    res.status(500).json({
      message: "Lỗi khi preview sản phẩm bị trùng campaign",
      error: err.message,
    });
  }
};

// Cron job: tự động vô hiệu hóa campaign đã hết hạn
exports.autoDeactivateExpiredCampaigns = async () => {
  const now = new Date();
  await SaleCampaign.updateMany(
    { endDate: { $lt: now }, isActive: true },
    { isActive: false }
  );
};
