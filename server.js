/* eslint no-console: 0 */

const path = require('path');
const express = require('express');
const session = require('express-session');
const webpack = require('webpack');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const favicon = require('serve-favicon');
const logger = require('morgan');
const config = require('./src/config');

const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const webpackkSettings = require('./webpack.config.js');

const passport = require('passport');
const Auth0Strategy = require('passport-auth0');

/* application routes */
const routes = require('./src/routes');
const portal = require('./src/routes/portal');

const isDeveloping = process.env.NODE_ENV !== 'production';
const port = isDeveloping ? 3000 : process.env.PORT;
const app = express();

/* Auth 0 strategy */
var strategy = new Auth0Strategy({
    domain:       process.env.AUTH0_DOMAIN || config.auth0.domain,
    clientID:     process.env.AUTH0_CLIENT_ID || config.auth0.clientID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET || config.auth0.clientSecret,
    callbackURL:  process.env.AUTH0_CALLBACK_URL || config.auth0.callbackURL
  }, 
  function(accessToken, refreshToken, extraParams, profile, done) {
    return done(null, profile);
  });

passport.use(strategy);

// This can be used to keep a smaller payload
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

// view engine setup
app.set('views', path.join(__dirname, 'src', 'jade'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: 'shhhhhhhhh',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

if (isDeveloping) {
  const compiler = webpack(webpackkSettings);
  const middleware = webpackMiddleware(compiler, {
    publicPath: webpackkSettings.output.publicPath,
    contentBase: 'src',
    stats: {
      colors: true,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false,
      modules: true
    }
  });

  app.use(middleware);
  app.use(webpackHotMiddleware(compiler));

  app.get('/favicon', (req, res) => {
    res.write(middleware.fileSystem.readFileSync(path.join(__dirname, 'dist/favicon.ico')));
    res.end();
  });
} 
else {
  app.use(express.static(__dirname + '/dist'));
  app.use(favicon(path.join(__dirname, 'dist', 'favicon.ico')));
}

/* register all routes */
app.use('/', routes);
app.use('/portal', portal);

app.listen(port, '0.0.0.0', function onStart(err) {
  if (err) {
    console.log(err);
  }
  console.info('==> Listening on port %s. Open up http://0.0.0.0:%s/ in your browser.', port, port);
});