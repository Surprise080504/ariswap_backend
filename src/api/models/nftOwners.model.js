const mongoose = require('mongoose');

/**
 * NFTOwner Schema
 * @private
 */
const NFTOwnerSchema = new mongoose.Schema({
    fromDate: { type: Date },
    toDate: { type: Date },
    nftId: { type: mongoose.Schema.Types.ObjectId, ref: 'NFT' },
    auctionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Auction' },
    txHash: { type: String },
}, { timestamps: true }
);

/**
 * @typedef NFTOwner
 */

module.exports = mongoose.model('NFTOwner', NFTOwnerSchema);