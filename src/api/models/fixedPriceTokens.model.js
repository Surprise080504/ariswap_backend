const mongoose = require('mongoose');


const FixedPriceTokensSchema = new mongoose.Schema({
    nftId: { type: String },
    nftToken: { type: String },
  
}, { timestamps: true }
);

module.exports = mongoose.model('FixedPriceTokens', FixedPriceTokensSchema);
