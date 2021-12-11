const mongoose = require('mongoose');

/**
 * Follower Schema
 * @private
 */
const FollowerSchema = new mongoose.Schema({
    followedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    followedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true }
);

/**
 * @typedef Follower
 */

module.exports = mongoose.model('Follower', FollowerSchema);