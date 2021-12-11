const path = require('path');
// import .env variables
require('dotenv').config();
module.exports = {
  jwtExpirationInterval: process.env.JWT_EXPIRATION_MINUTES,
  encruptionKey: process.env.ENCRYPTION_KEY,
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  frontEncSecret: process.env.FRONT_ENC_SECRET,
  ipfsBaseUrl: process.env.IPFS_BASE_URL,
  ipfsServerUrl: process.env.IPFS_SERVER_URL,
  adminUrl: process.env.ADMIN_URL,
  emailAdd: process.env.EMAIL,
  mongo: {
    uri: process.env.MONGO_URI,
    // uri:"mongodb+srv://admin:admin1234@mastercluster.ms0ko.mongodb.net/class_room?retryWrites=true&w=majority"
  },
  mailgunPrivateKey: process.env.MAILGUN_PRIVATE_KEY,
  mailgunDomain: process.env.MAILGUN_DOMAIN,
  pwEncruptionKey: process.env.PW_ENCRYPTION_KEY,
  pwdSaltRounds: process.env.PWD_SALT_ROUNDS,
  userDefaultImage: '/img/placeholder.png', // 'https://via.placeholder.com/600'
  categoryDefaultImage: '/img/placeholder.png',
  collectionDefaultImage: '/img/placeholder.png',
  globalImgPlaceholder: '/img/placeholder.png'
};
