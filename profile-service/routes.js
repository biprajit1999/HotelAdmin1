const express = require('express');
const router = express.Router();
const Detail = require('./models/detail');
const Admin = require('./models/admin');
const Feedback = require('./models/summary');

router.get('/prof', function (req, res, next) {
	return res.render('profile.ejs', { "name": "admin", "email": "admin@gmail.com" });
  });


router.get('/navbar', function (req, res, next) {
  return res.render('navbar.ejs');
  });

router.get('/footer', function (req, res, next) {
  return res.render('footer.ejs');
  });


module.exports = router;
