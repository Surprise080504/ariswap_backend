const mongoose = require('mongoose')

/**
 * Collection Schema
 * @private
 */
const CollectionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    name: { type: String, required: true },
    logo: { type: String, required: true },
    featuredImg: { type: String },
    banner: { type: String },
    url: { type: String },
    description: { type: String }
}, { timestamps: true }
);

/**
 * @typedef Collection
 */

module.exports = mongoose.model('Collection', CollectionSchema);