var moment = require('moment');
var express = require('express');
var axios = require('axios');
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();
var router = express.Router();
var config = require('../config');

// middleware to use for all requests
router.use((req, res, next) => {
	
  if (req.user) {

    var tenant_id = req.user._json.app_metadata.tenant_id;


    console.log(config.api.tenantStatusUrl.replace(":tenant_id", tenant_id));

    axios
      .get(config.api.tenantStatusUrl.replace(":tenant_id", tenant_id))
      .then((response) => {
        
        req.user.status = {};

        var now = moment(new Date());

        if (response) {

          req.user.status.value = response.data.status;
          req.user.status.description = response.data.statusDescription;
          req.user.status.updatedOn = response.data.statusUpdatedOn;

          if (response.data.status == "trial") {
            var statusUpdatedOn = moment(response.data.statusUpdatedOn);
            req.user.status.trial_days_remaining = 30 - now.diff(statusUpdatedOn, 'days');    
          }
        }
        
        next()
      })
      .catch((error) => {
        console.log(error);
      });
  }
  else {
    next();
  }
});

/* GET user profile. */
router.get('/', ensureLoggedIn, (req, res, next) => {
  res.render('dashboard', { user: req.user });
});

router.get('/hostedpages', ensureLoggedIn, (req, res, next) => {
  res.render('hostedpages', { user: req.user, env : { domain: 'localhost:3000' } });
});

router.get('/gettingstarted', ensureLoggedIn, (req, res, next) => {
  res.render('gettingstarted', { user: req.user });
});

router.get('/reports', ensureLoggedIn, (req, res, next) => {
  res.render('reports', { user: req.user });
});

router.get('/signupcomplete', ensureLoggedIn, (req, res, next) => {
  var customerid = req.query.id;
  var tenantId = req.query.ref;

  // todo speak to the chargify api to understand if the subscription is real
  // todo if the subscription is real then we need to set a subscribed on attribute against this tenant.
  
})

module.exports = router;
