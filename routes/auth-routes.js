const router = require('express').Router();
const passport = require('passport');

// auth login
router.get('/login', (req,res) => {
    res.render('login', {user: req.user});
});

// auth logout
router.get('/logout', (req, res) => {
    // handle with passport
    req.logout();
    res.redirect('/');
});


// auth with facebook
router.get('/facebook', passport.authenticate('facebook', {
    scope: ['public_profile', 'user_photos', 'email', 'user_posts', 'pages_manage_posts', 'pages_manage_engagement', 'publish_to_groups']
}));

// callback route for google to redirect to
router.get('/facebook/redirect', passport.authenticate('facebook'), (req, res) => {
    // res.send(req.user);
    res.redirect('/profile/')
})

module.exports = router;