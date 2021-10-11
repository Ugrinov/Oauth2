const passport = require('passport');
const FacebookStrategy = require('passport-facebook');
const keys = require('./keys');
const  User = require('../models/user-model')
const router = require('express').Router();
const CryptoJS = require("crypto-js");
passport.serializeUser((user,done) => {
        done(null, user.id)
})

passport.deserializeUser((id,done) => {
        User.findById(id).then((user) => {
                done(null, user)
        })
})

const encryptWithAES = (text) => {
        const passphrase = "123";
        return CryptoJS.AES.encrypt(text, passphrase).toString();
};


passport.use(
    new FacebookStrategy({
        // options for the google strategy
        clientID: keys.facebook.clientID,
        clientSecret: keys.facebook.clientSecret,
        callbackURL: 'http://localhost:3000/auth/facebook/redirect',
        profileFields: ['id', 'displayName', 'photos', 'email', 'gender', 'name', 'posts', 'groups', 'accounts']
}, (accessToken, refreshToken, profile, done) => {
        // check if user already exists in our db
            console.log(profile._json.accounts.data[0].access_token);
            User.findOne({googleId: profile.id}).then((currentUser) => {
                    if(currentUser){
                            // already have the user
                            console.log('user is:', currentUser)
                            done(null, currentUser);
                    } else {
                            let aloha = encryptWithAES(profile._json.accounts.data[0].access_token)
                            console.log("\naloha = " + aloha)
                            // if not, create user in our db
                            new User({
                                    username: profile.displayName,
                                    googleId: profile.id,
                                    token: encryptWithAES(accessToken),
                                    pageToken: encryptWithAES(profile._json.accounts.data[0].access_token)
                            }).save().then((newUser) => {
                                    console.log('decrypt ' + profile._json.accounts.data[0].access_token);
                                    console.log('new user created' + newUser);
                                    done(null, newUser);
                            })
                    }
            })
    })
)