// models/DiscountCampaign.js
const mongoose = require("mongoose");

const saleCampaignSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image_urls: [
      {
        url: String,
        public_id: String
      }
    ],
    description: String,
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    
    percentage: {
      type: Number,
      min: 0,
      max: 100,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SaleCampaign", saleCampaignSchema, "SaleCampaigns");
