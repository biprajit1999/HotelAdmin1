let express = require('express');
const morgan = require('morgan');
const router = express.Router();
router.use(morgan('combined'));
const Detail = require('./models/detail');
const Admin = require('./models/admin');
const Feedback = require('./models/summary');

router.get('/navbar', function (req, res, next) {
	return res.render('navbar.ejs');
	});
  
  router.get('/footer', function (req, res, next) {
	return res.render('footer.ejs');
	});
  
router.get('/dashboard' , function (req, res, next) {
		Detail.find({}, function (err, users) {
			if (err) {
				console.log(err);
				return res.redirect('/');
			}
			res.render('dashboard.ejs', { users: users });
		});
	});

  router.get('/create', function (req, res, next) {
		res.render('create.ejs'); 
  });

  router.get('/success', function (req, res, next) {
		res.render('success.ejs'); 
	});

  router.get('/duplicate', function (req, res, next) {
		res.render('duplicate_error.ejs'); 
	});
  
  router.get('/roombooked', function (req, res, next) {
		res.render('roombooked.ejs');	  
	});



  router.get('/update', function (req, res, next) {
		res.render('update.ejs');
	});


	router.get('/logout', function (req, res, next) {
		console.log("logout")
		if (req.session) {
		req.session.destroy(function (err) {
			if (err) {
				return next(err);
			} else {
				return res.redirect('http://localhost:5005/');
			}
		});
	}
	});
	

module.exports = router;
