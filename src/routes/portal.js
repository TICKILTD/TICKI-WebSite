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
  var customerId = req.query.id;
  var tenantId = req.query.ref;

  // make sure the subscription id is valid
  axios
    .get(config.chargify.subscriptionUrl.replace(':subscription_id', customerId), 
    {
      auth: {
        username: config.chargify.v1.key,
        password: config.chargify.v1.password
      },
    })
    .then((response) => {

      if (response.data) {
        var status = {
          status: 'live', 
          statusDescription: 'Subscription id ' + customerId, 
          statusUpdatedO: new Date()
        };

        axios
          .put(config.api.tenantStatusUrl.replace(':tenant_id', tenantId), status)
          .then((response) => {
            res.render('welcome', {user: req.user });
          })
          .catch((error) => {
            res.render('subscription_error', { user: req.user });
          });
      }
      else {
        res.render('subscription_error', { user: req.user });
      }
    })
    .catch((error) => {
      res.render('subscription_error', { user: req.user });
    });
})

module.exports = router;
