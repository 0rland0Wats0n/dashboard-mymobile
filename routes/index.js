var express = require('express');
var passport = require('passport');
var axios = require('axios');
var router = express.Router();

var env = {
  AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
  AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
  AUTH0_CALLBACK_URL: process.env.AUTH0_CALLBACK_URL || 'http://localhost:3000/callback',
  API_URL: process.env.API_URL || 'http://localhost:4242',
  API_USER_NAME: process.env.API_USER_NAME || 'admin',
  API_USER_PASSWORD: process.env.API_USER_PASSWORD || 'password'
};

/* GET home page. */
router.get('/', function(req, res){
    res.render('index', { env: env });
  }
);

router.get('/login', function(req, res) {
  res.redirect('/');
});

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

router.get('/callback',
  passport.authenticate('auth0', { failureRedirect: '/url-if-something-fails' }),
  function(req, res) {
    //authenticate user over api to get token
    axios.post(env.API_URL + '/authenticate', {
      username: env.API_USER_NAME,
      password: env.API_USER_PASSWORD
    }).then(function(response) {
      if(response.data.error) {
        res.redirect('/logout');
      }

      res.cookie('auth', response.data.token);
      res.redirect(req.session.returnTo || '/dashboard');
    });
  });


module.exports = router;
