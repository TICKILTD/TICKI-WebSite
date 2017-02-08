var express = require('express');
var passport = require('passport');
var router = express.Router();

var env = {
  AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID  || 'nodjIKSkAtkc3sAPMa3Swm1RQm6cvTF0',
  AUTH0_DOMAIN: process.env.AUTH0_DOMAIN  || 'maraboustork.eu.auth0.com',
  AUTH0_CALLBACK_URL: process.env.AUTH0_CALLBACK_URL || 'http://localhost:3000/callback'
};

var replaceToken = (s, data) => {
    
    var retVal = s;

    var re = /\#\{\s*([^\}]+)\s*\}/
    var m;

    do {
        m = re.exec(retVal);
        if (m && data[m[1]]) {
          var rexp = new RegExp("\#\{" + m[1] + "\}")
          retVal = retVal.replace(rexp, data[m[1]]);
        }
    } while (m);

    return retVal.replace(/\#\{\s*([^\}]+)\s*\}/, "");
}

/* GET home page. */
router.get('/', 
  (req, res, next) => {
    res.render('index', { env: env, user: req.user});
  });

router.get('/forms', 
  (req, res, next) => {
    res.render('forms', { env: env, user: req.user});
  });

router.get('/login',
  (req, res) => {
    res.render('login', { env: env });
  });

router.get('/logout', 
  (req, res) => {
    req.logout();
    res.redirect('/');
  });

router.get('/callback',
  passport.authenticate('auth0', { failureRedirect: '/url-if-something-fails' }),
  (req, res) => {
    res.redirect(req.session.returnTo || '/portal');
  });

router.get('/submission', 
  (req, res) => {

    let pageData;

    var previewData = req.query.preview;
    if (previewData) {
      pageData = JSON.parse(Buffer.from(previewData, 'base64'));
    }

    if (!pageData) {
      var css = `
        .cus-banner {
          background-color: #5796b0;
        }

        .cus-headerimage {
          border: 1px solid white;
          border-radius: 50%;
          width: 360px;
          height: 360px;
        }
        
        .cus-headertext {
          color:aqua;
        }`;

      pageData = {
          style       : css, 
          companyName : 'https://images.pexels.com/photos/33537/cat-animal-cat-portrait-mackerel.jpg?h=350&auto=compress&cs=tinysrgb', 
          greating    : 'Hey there #{firstname}', 
          text        : 'On #{submissiondate} you answered the folowing questions on one of our online forms.', 
          imageUrl    : 'https://images.pexels.com/photos/33537/cat-animal-cat-portrait-mackerel.jpg?h=350&auto=compress&cs=tinysrgb', 
          returnUrl   : 'http://localhost:3000/'
      }
    }

    var data = {
      title           : 'Mr',
      firstname       : 'Simon', 
      lastname        : 'Parsons', 
      submissiondate  : '2nd December 2017'
    }

    res.render('submission', { page : JSON.parse(replaceToken(JSON.stringify(pageData), data)) }); 
  })

module.exports = router;
