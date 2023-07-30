const express = require('express');
const router = express.Router();
const Detail = require('./models/detail');
const Admin = require('./models/admin');
const Feedback = require('./models/summary');
const amqp = require('amqplib');

router.get('/prof', function (req, res, next) {
	return res.render('profile.ejs', { "name": "admin", "email": "admin@gmail.com" });
  });

module.exports = router;
