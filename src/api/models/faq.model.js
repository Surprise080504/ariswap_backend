const mongoose = require('mongoose');

/**
 * FAQ Schema
 * @private
 */
const FaqSchema = new mongoose.Schema({
    title: { type: String, required: true, default: '' },
    desc: { type: String, required: true, default: ''}
}, { timestamps: true }
);

/**
 * @typedef FAQ
 */

module.exports = mongoose.model('faq', FaqSchema);