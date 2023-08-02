let express = require('express');
const router = express.Router();
const Detail = require('./models/detail');
const Admin = require('./models/admin');
const Feedback = require('./models/summary');


router.get('/login', function (req, res, next) {
	return res.render('login.ejs');
});




router.post('/login', async function (req, res, next) {
	try {
	  const data = await Admin.findOne({ email: req.body.email });
  
	  if (data) {
		if (data.password == req.body.password) {
		  req.session.userId = data.unique_id;
		  console.log("Success");
		  res.send({ "Success": "Success!" });
		} else {
		  res.send({ "Success": "Wrong password!" });
		}
	  } else {
		res.send({ "Success": "This Email Is not registered!" });
	  }
	} catch (err) {
	  console.error('Error in handling login request:', err);
	  res.status(500).send({ "Error": "Internal Server Error" });
	}
  });


  router.get('/footer', function (req, res, next) {
	return res.render('footer.ejs');
});
  
  

router.get('/logout', function (req, res, next) {
	console.log("logout")
	if (req.session) {
    req.session.destroy(function (err) {
    	if (err) {
    		return next(err);
    	} else {
    		return res.redirect('/lg/login');
			
    	}
    });
}
});

router.get('/forgetpass', function (req, res, next) {
	res.render("forget.ejs");
});

router.post('/forgetpass', function (req, res, next) {
	Admin.findOne({email:req.body.email},function(err,data){
		console.log(data);
		if(!data){
			res.send({"Success":"This Email Is not regestered!"});
		}else{
			if (req.body.password==req.body.passwordConf) {
			data.password=req.body.password;
			data.passwordConf=req.body.passwordConf;

			data.save(function(err, Person){
				if(err)
					console.log(err);
				else
					console.log('Success');
					res.send({"Success":"Password changed!"});
			});
		}else{
			res.send({"Success":"Password does not matched! Both Password should be same."});
		}
		}
	});
	
});

module.exports = router;

