const mongoose = require('mongoose');

/**
 * Favourite Schema
 * @private
 */
const FavouriteSchema = new mongoose.Schema({
    favouriteBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    artOwner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    art: { type: mongoose.Schema.Types.ObjectId, ref: 'Art' },
}, { timestamps: true }
);

/**
 * @typedef Favourite
 */

module.exports = mongoose.model('Favourite', FavouriteSchema);