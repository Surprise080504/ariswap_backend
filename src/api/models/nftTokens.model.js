const mongoose = require('mongoose');


const NFtTokensSchema = new mongoose.Schema({
    nftId: { type: String },
    nftToken: { type: String },
  
}, { timestamps: true }
);

module.exports = mongoose.model('nftTokens', NFtTokensSchema);