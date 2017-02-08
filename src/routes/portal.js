var express = require('express');
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();
var router = express.Router();

/* GET user profile. */
router.get('/', ensureLoggedIn, function(req, res, next) {
  res.render('dashboard', { user: req.user });
});

router.get('/hostedpages', ensureLoggedIn, function(req, res, next) {
  res.render('hostedpages', { user: req.user, env : { domain: 'localhost:3000', clientid: 'GHYT-32423432-KJHKJHK-123123123-JHG' } });
});

router.get('/gettingstarted', ensureLoggedIn, function(req, res, next) {
  res.render('gettingstarted', { user: req.user });
});

router.get('/reports', ensureLoggedIn, function(req, res, next) {
  res.render('reports', { user: req.user });
});

module.exports = router;
