const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const moment = require('moment-timezone');
const jwt = require('jwt-simple');
const {
  pwdSaltRounds,
  jwtExpirationInterval,
  pwEncruptionKey
} = require('../../config/vars');

/**
 * User Schema
 * @private
 */
const UserSchema = new mongoose.Schema({
  type: { type: Number }, // 1 = Creator, 2 = User or Buyer or Owner
  username: { type: String },
  email: { type: String },
  emailVerified: { type: Boolean },
  description: { type: String },
  profileImage: { type: String },
  bannerImage: { type: String },
  address: { type: String },
  facebookLink: { type: String },
  twitterLink: { type: String },
  gPlusLink: { type: String },
  vineLink: { type: String },
  password: {
    type: String,
    required: true
  },
  signature: { type: String },
}, { timestamps: true }
);

UserSchema.methods.verifyPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

/**
 * Methods
 */
UserSchema.method({
  transform() {
    const transformed = {};
    const fields = ['_id', 'email', 'address', 'description', 'facebookLink', 'gPlusLink', 'profileImage', 'bannerImage', 'twitterLink', 'username', 'vineLink'];
    fields.forEach((field) => {
      transformed[field] = this[field];
    });
    return transformed;
  },

  token() {
    const playload = {
      exp: moment().add(jwtExpirationInterval, 'minutes').unix(),
      iat: moment().unix(),
      sub: this._id,
    };
    return jwt.encode(playload, pwEncruptionKey);
  },
  async passwordMatches(password) {
    return bcrypt.compare(password, this.password);
  },
});

UserSchema.pre('save', async function save(next) {
  try {
    if (!this.isModified('password')) return next();
    const rounds = pwdSaltRounds ? parseInt(pwdSaltRounds) : 10;
    const hash = await bcrypt.hash(this.password, rounds);
    this.password = hash;
    return next();
  }
  catch (error) {
    return next(error);
  }
});

/**
 * @typedef User
 */

module.exports = mongoose.model('User', UserSchema);