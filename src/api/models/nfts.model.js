const mongoose = require("mongoose");

/**
 * NFT Schema
 * @private
 */
const NFTSchema = new mongoose.Schema(
  {
    name: { type: String },
    description: { type: String },
    creatorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    nftOwnerId: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    // categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    collectionId: { type: mongoose.Schema.Types.ObjectId, ref: "Collection" },
    currentPrice: { type: Number },
    ownerAddress: { type: String },
    txHash: { type: String },
    image: { type: String },
    royalty: { type: String },
    size: { type: String },
    copies: { type: Number, default: 0 },
    status: { type: Number, default: 1 }, // 1 = Put on Sale, 2 = Instant Sale Price, 3 = Unlock Purchased
    sold: { type: Number, default: 0 },
    sellingMethod: { type: Number }, // 1 = Fixed Price, 2 = Timed Auction
    sellingConfig: { type: Object },
    auctionStartDate: { type: Date },
    auctionEndDate: { type: Date },
    auctionStartTime: { type: String },
    auctionEndTime: { type: String },
    metaData: { type: String }, // ipfs link
    type: { type: String, default: "ARISWAP" }, // ARISWAP | CELO_PUNK
  },
  { timestamps: true }
);

/**
 * @typedef NFT
 */

module.exports = mongoose.model("NFT", NFTSchema);
