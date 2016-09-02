var express = require('express');
var passport = require('passport');
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();
var axios = require('axios');
var router = express.Router();

var env = {
  API_URL: process.env.API_URL || 'http://localhost:4242',
  API_USER_NAME: process.env.API_USER_NAME || 'admin',
  API_USER_PASSWORD: process.env.API_USER_PASSWORD || 'password'
};

/* GET user profile. */
router.get('/', ensureLoggedIn, function(req, res, next) {
  axios.get(env.API_URL + '/api/images')
    .then(function(response) {
      res.render('dashboard', { title: 'Dashboard', user: req.user, images: response.data });
    })
});

module.exports = router;
