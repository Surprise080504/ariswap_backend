const mongoose = require('mongoose');

/**
 * Creator Schema
 * @private
 */
const CreatorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    product: { type: Number, required: true },
    status: { type: Boolean, required: true, default: false }
}, { timestamps: true }
);

/**
 * @typedef Creator
 */

module.exports = mongoose.model('Creator', CreatorSchema);