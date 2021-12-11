const mongoose = require('mongoose');

/**
 * Transaction Schema
 * @private
 */
const TransactionSchema = new mongoose.Schema({
    type: { type: Number }, //1 = create 2 = bid, 3 = Purchase
    amount: { type: Number },
    address: { type: String },
    network: { type: Number }, //1 = Celo, 2 = BNB, 3 = USDT, 4 = ARI
    nftId: {type: mongoose.Schema.Types.ObjectId, ref: 'NFT'},
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
}, { timestamps: true }
);

/**
 * @typedef Transaction
 */

module.exports = mongoose.model('Transaction', TransactionSchema);