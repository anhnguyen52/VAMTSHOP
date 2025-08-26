const SaleCampaign = require("../models/saleCampaign");

const applySaleCampaignsToProducts = async (products) => {
  const now = new Date();
  const campaigns = await SaleCampaign.find({
    isActive: true,
    startDate: { $lte: now },
    endDate: { $gte: now },
  });

  const productsWithDiscount = products.map((product) => {
    const campaign = campaigns.find((c) =>
      c.products.some((b) => b.toString() === product._id.toString())
    );

    if (campaign) {
      const salePercentage = campaign.percentage;
      const saledPrice = Math.round(
        product.price * (1 - salePercentage / 100)
      );
      return {
        ...product.toObject(),
        salePercentage,
        price: saledPrice,
      };
    }

    return product.toObject();
  });

  return productsWithDiscount;
};

module.exports = { applySaleCampaignsToProducts };
