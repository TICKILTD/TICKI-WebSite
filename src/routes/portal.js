var moment = require('moment');
var express = require('express');
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();
var router = express.Router();

// middleware to use for all requests
router.use(function(req, res, next) {
	
  if (req.user) {
    req.user.trial = { on_trial: false };
    
    var registered = moment(req.user._json.created_at);
  
    if (!req.user._json.app_metadata.subscribed_at) {
      var now = moment(new Date());
      
      req.user.trial.on_trial = true;
      req.user.trial.days_remaining = 30 - now.diff(registered, 'days');
    }
  }

	next();
});

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
