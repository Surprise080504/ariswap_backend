const byPassedRoutes = ['/v1/cron/conversion/rate/'];
const User = require('../../models/users.model');
const CryptoJS = require("crypto-js");
const { pwEncruptionKey, frontEncSecret } = require('./../../../config/vars');
const jwt = require('jsonwebtoken');

exports.authenticate = async (req, res, next) => {
    if (req.originalUrl.indexOf("/v1/") > -1) {
        if (byPassedRoutes.indexOf(req.originalUrl) > -1 || req.originalUrl.indexOf("/v1/xyz") > -1) {
            next();
        }
        else {
            if (req.headers['x-auth-token']) {
                var decryption_string = req.headers['x-auth-token'];

                if (req.token) {
                    var bytes = CryptoJS.AES.decrypt(req.token, decryption_string);
                    var decryptedData = bytes.toString(CryptoJS.enc.Utf8);
                    if (decryptedData !== frontEncSecret) {
                        const message = 'auth_request_required_front_error1'
                        return res.status(405).json({ success: false, message });
                    }
                    else {
                        next();
                    }
                }
                else if (req.method.toLocaleLowerCase() !== 'options') {
                    const message = 'auth_request_required_front_error2'
                    return res.status(405).json({ success: false, message });
                }
                else {
                    next();
                }
            }
            else if (req.method.toLocaleLowerCase() !== 'options') {
                const message = 'auth_request_required_front_error3'
                return res.status(405).json({ success: false, message });
            }
            else {
                next();
            }
        }
    }
    else {
        next();
    }
}

exports.userValidation = async (req, res, next) => {
    let flag = true;
    req.user = 0;
    if (req.headers['x-access-token']) {
        await jwt.verify(req.headers['x-access-token'], pwEncruptionKey, async (err, authorizedData) => {
            if (err) {
                flag = false;
                const message = 'session_expired_front_error'
                return res.send({ success: false, userDisabled: true, message, err });
            }
            else {
                req.user = authorizedData.sub;
            }
        })
    }
    else if (req.method.toLocaleLowerCase() !== 'options') {
        req.user = 0;
    }

    if (flag)
        next();
}
