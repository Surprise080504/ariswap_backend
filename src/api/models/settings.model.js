const mongoose = require('mongoose');

/**
 * Settings Schema
 * @private
 */
const SettingsSchema = new mongoose.Schema({
    email: { type: String, default: '' },
    mobile: { type: String, default: '' },
    phone: { type: String, default: '' },
    address: { type: String, default: '' },
    facebook: { type: String, default: '' },
    twitter: { type: String, default: '' },
    instagram: { type: String, default: '' },
    vine: { type: String, default: '' },
    youtube: { type: String, default: '' },
    royality: { type: String, default: '' },
    share: { type: String, default: '' },
    desc: { type: String, default: '' },
    domain: { type: String, default: '' },
    api: { type: String, default: '' }
}, { timestamps: true }
);

/**
 * @typedef Settings
 */

module.exports = mongoose.model('Settings', SettingsSchema);