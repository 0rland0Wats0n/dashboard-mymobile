var express = require('express');
var passport = require('passport');
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();
var axios = require('axios');
var cloudinary = require('cloudinary');
var router = express.Router();

var Image = require('../models/Image');

var env = {
  API_URL: process.env.API_URL || 'http://localhost:4242',
  API_USER_NAME: process.env.API_USER_NAME || 'admin',
  API_USER_PASSWORD: process.env.API_USER_PASSWORD || 'password'
};

/* GET user profile. */
router.get('/', ensureLoggedIn, function(req, res, next) {
  Image.find()
    .sort('-uploaded_on')
    .exec(function(err, images) {
      if(err) { throw err; }

      res.render('dashboard', { title: 'Dashboard', user: req.user, images: images, token: req.cookies.auth, url: env.API_URL });
    });
});

router.post('/upload', ensureLoggedIn, function(req, res, next) {
  cloudinary.uploader.upload(req.files[0].path, function(result) {
      var image = new Image({
        name: result.original_filename,
        description: req.body.description,
        uploaded_on: result.created_at,
        image: result
      });

      image.save(function(err) {
        if(err) { throw err; }

        res.redirect('/dashboard');
      });
    });
});

router.post('/delete', ensureLoggedIn, function(req, res, next) {
  Image.findById(req.body.id)
    .exec(function(err, image) {
      if(err) { throw err; }

      if(image) {
        axios.delete(env.API_URL + '/api/v1/images/' + image.image.public_id + '/' + image._id + '?token=' + req.cookies.auth)
          .then(function(response) {
            console.log(response.data);
            res.redirect('/dashboard');
          });
      } else {
        console.log("No image found.");
        res.redirect('/dashboard');
      }
    });
});

module.exports = router;
