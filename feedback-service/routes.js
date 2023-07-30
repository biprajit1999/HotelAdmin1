let express = require('express');
const router = express.Router();
const Detail = require('./models/detail');
const Admin = require('./models/admin');
const Feedback = require('./models/summary');


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


module.exports = router;


