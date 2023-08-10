let express = require('express');
const morgan = require('morgan');
const router = express.Router();
router.use(morgan('combined'));
const Detail = require('./models/detail');
const Admin = require('./models/admin');
const Feedback = require('./models/summary');

router.get('/navbar', (req, res) => {
    res.render('navbar.ejs'); 
});



router.get('/fb_dashboard', function (req, res, next) {
		Feedback.find({}, (err, feedbacks) => {
			if (err) {
				console.error('Failed to retrieve feedbacks', err);
				res.status(500).send('Internal Server Error');
			} else {
				res.render('fb_dashboard.ejs', { feedbacks });
			}
		});	  
	});



  router.delete('/delete-feedback/:id', (req, res) => {
    const feedbackId = req.params.id;

    Feedback.findByIdAndRemove(feedbackId, (err) => {
        if (err) {
            console.error('Failed to delete feedback', err);
            res.status(500).send('Internal Server Error');
        } else {
            res.sendStatus(200);
        }
    });
});


router.get('/summary', function (req, res, next) {
		res.render('summary.ejs');
  });

  router.get('/footer', (req, res) => {
    res.render('footer.ejs'); 
});


module.exports = router;


