const router = require('express').Router();
const request = require('request-promise');
const url = require('url');
const CryptoJS = require("crypto-js");
const keys = require('../config/keys');

const decryptWithAES = (ciphertext) => {
    let passphrase = "123";
    const bytes = CryptoJS.AES.decrypt(ciphertext, passphrase);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText;
};


const authCheck = (req, res, next) => {
    if(!req.user){
        // if user is not logged in
        res.redirect('auth/login')
    }
    else {
        // if logged in
        next();
    }
};

router.get('/', authCheck, (req,res) => {
    const options = {
        method: 'GET',
        uri: 'https://graph.facebook.com/v12.0/111775861274752/feed?&access_token=' + decryptWithAES(req.user.token),
/*        qs: {
            access_token: req.user.access_token,
        }*/
    }
        request(options)
        .then(fbRes => {
            const parsedRes = JSON.parse(fbRes).data;
            console.log(parsedRes)
            res.render('profile', { user: req.user, abra: parsedRes, pageToken: decryptWithAES(req.user.pageToken)});
        })
});






module.exports = router;