const mongoose = require('mongoose');

/**
 * Category Schema
 * @private
 */
const CategorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String },
    image: { type: String, required: true },
    status: { type: Boolean, required: true, default: false }
}, { timestamps: true }
);

/**
 * @typedef Category
 */

module.exports = mongoose.model('Category', CategorySchema);