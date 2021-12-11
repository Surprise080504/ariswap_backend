const mongoose = require('mongoose');

/**
 * Contact Schema
 * @private
 */
const ContactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {type: String, required: true },
  subject: {type: String, required: true},
  message: {type: String, required: true },
  status: {type: Number, required: true, default: 1 } // 0 == In Progress, 1 == Pending, 2 == Closed
}, { timestamps: true }
);

/**
 * @typedef Contact
 */

module.exports = mongoose.model('contact', ContactSchema);