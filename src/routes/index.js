var express = require('express');
var passport = require('passport');
var router = express.Router();

var env = {
  AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID  || 'nodjIKSkAtkc3sAPMa3Swm1RQm6cvTF0',
  AUTH0_DOMAIN: process.env.AUTH0_DOMAIN  || 'maraboustork.eu.auth0.com',
  AUTH0_CALLBACK_URL: process.env.AUTH0_CALLBACK_URL || 'http://localhost:3000/callback'
};

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { env: env, user: req.user});
});

router.get('/forms', function(req, res, next) {
  res.render('forms', { env: env, user: req.user});
});

router.get('/login',
  function(req, res){
    res.render('login', { env: env });
  });

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

router.get('/callback',
  passport.authenticate('auth0', { failureRedirect: '/url-if-something-fails' }),
  function(req, res) {
    res.redirect(req.session.returnTo || '/portal');
});

module.exports = router;