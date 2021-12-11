const mongoose = require('mongoose');

/**
 * Bid Schema
 * @private
 */
const BidSchema = new mongoose.Schema({
    bidBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User',required:true  },
    bidById:{type:String},
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    nftOwnerId:{type:String},
    nftId: { type: mongoose.Schema.Types.ObjectId, ref: 'NFT' },
    // auctionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Auction' },
    bidAmount: { type: Number }, // temp.
    // txHash: { type: String },
    fromAddress:{ type: String },
    toAddress:{ type: String },
    price: {
        type: Object,
        default: {
            currency: {
                type: String, default: ''
            },
            amount: {
                type: Number, default: 0
            }
        },
        required: true
    },
    isAccepted: { type: Boolean, default: false },
    isClaimable: { type: Boolean, default: false },
    isclaimed: { type: Boolean, default: false },
    expiryDate: { type: Date, required: true }
}, { timestamps: true }
);

/**
 * @typedef Bid
 */

module.exports = mongoose.model('Bid', BidSchema);
