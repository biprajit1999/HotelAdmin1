let express = require('express');
let env = require('dotenv').config()
let ejs = require('ejs');
let path = require('path');
let app = express();
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
let session = require('express-session');
let MongoStore = require('connect-mongo')(session);
const nodemailer = require('nodemailer');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

mongoose.connect('mongodb+srv://biprajit:biprajit@cluster0.has27be.mongodb.net/hotelty?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, (err) => {
  if (!err) {
    console.log('MongoDB Connection Succeeded.');
  } else {
    console.log('Error in DB connection : ' + err);
  }
});

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
});

app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');	
app.engine('html', require('ejs').renderFile);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// app.use(express.static(__dirname + '/views'));
app.use('/dsb/css', express.static(__dirname + '/views/css'));



const routes = require('./routes');

app.use('/dsb', routes);


async function checkRoomAvailabilityAndRegister(data) {
  return new Promise((resolve, reject) => {
      db.collection('detail').findOne({
          room: data.room,
          $or: [
              { $and: [{ checkIn: { $lte: data.checkIn } }, { checkOut: { $gt: data.checkIn } }] },
              { $and: [{ checkIn: { $lt: data.checkOut } }, { checkOut: { $gte: data.checkOut } }] },
              { $and: [{ checkIn: { $gte: data.checkIn } }, { checkOut: { $lte: data.checkOut } }] }
          ]
      }, function (err, result) {
          if (err) {
              console.error('Error checking room availability:', err);
              reject(err);
          }

          if (result) {
              resolve(false); // Room is already booked for the specified dates
          } else {
              resolve(true); // Room is available
          }
      });
  });
}



app.post('/dsb/form', async (req, res) => {
  const name = req.body.name;
  const phone = req.body.phone;
  const aadhar = req.body.aadhar;
  const room = req.body.room;
  const checkIn = new Date(req.body.checkIn);
  const checkOut = new Date(req.body.checkOut);
  const email = req.body.email;
  const cardNumber = req.body.cardNumber;
  const expiration = req.body.expiration;
  const cvv = req.body.cvv;

  const data = {
      name: name,
      phone: phone,
      aadhar: aadhar,
      room: room,
      checkIn: checkIn,
      checkOut: checkOut,
      email: email
  };

  try {
      const isRoomAvailable = await checkRoomAvailabilityAndRegister(data);

      if (!isRoomAvailable) {
          return res.redirect('/dsb/roombooked');
      }

      const paymentResult = await processPayment(cardNumber, expiration, cvv);

      if (paymentResult.status === 'success') {
          // Mark the booking as successful
          data.bookingStatus = 'success';

          db.collection('detail').insertOne(data, function (err, collection) {
              if (err) throw err;
              console.log("Record inserted successfully");
              sendConfirmationEmail(email, name, room, checkIn, checkOut);
          });

          return res.redirect(`/dsb/paymentResult?status=success&transactionId=${paymentResult.transactionId}`);
      } else {
          return res.redirect('/dsb/paymentResult?status=failure');
      }
  } catch (error) {
      console.error('Error:', error);
      res.redirect('/dsb/paymentResult?status=failure');
  }
});



// app.post('/dsb/form', function(req, res) {
//     let name = req.body.name;
//     let phone = req.body.phone;
//     let aadhar = req.body.aadhar;
//     let room = req.body.room;
//     let checkIn = new Date(req.body.checkIn);
//     let checkOut = new Date(req.body.checkOut);
//     let email = req.body.email;
  
//     let data = {
//       "name": name,
//       "phone": phone,
//       "aadhar": aadhar,
//       "room": room,
//       "checkIn": checkIn,
//       "checkOut": checkOut,
//       "email": email
//     };
  
//     db.collection('detail').findOne({ aadhar: aadhar }, function(err, result) {
//       if (err) throw err;
  
//       if (result) {
//         return res.redirect('/dsb/duplicate');
//       } else {
//         db.collection('detail').findOne({
//           room: room,
//           $or: [
//             { $and: [{ checkIn: { $lte: checkIn } }, { checkOut: { $gt: checkIn } }] },
//             { $and: [{ checkIn: { $lt: checkOut } }, { checkOut: { $gte: checkOut } }] },
//             { $and: [{ checkIn: { $gte: checkIn } }, { checkOut: { $lte: checkOut } }] }
//           ]
//         }, function(err, result) {
//           if (err) throw err;
  
//           if (result) {
//             return res.redirect('/dsb/roombooked');
//           } else {
//             db.collection('detail').insertOne(data, function(err, collection) {
//               if (err) throw err;
//               console.log("Record inserted successfully");
//               sendConfirmationEmail(email, name, room, checkIn, checkOut);
//             });
  
//             return res.redirect('/dsb/success');
//           }
//         });
//       }
//     });
//   });
  
  
  function sendConfirmationEmail(email, name, room, checkIn, checkOut) {
    let transporter = nodemailer.createTransport({
      service: 'Gmail', 
      auth: {
        user: 'biprajitdebnath99@gmail.com',
        pass: 'eoylpqdcvwdcwbcg' 
      }
    });
  
    let mailOptions = {
      from: 'biprajitdebnath99@gmail.com',
      to: email,
      subject: 'Room Registration Confirmation',
      html: `
        <h2>Hello ${name},</h2>
        <p>Your room (${room}) has been successfully registered.</p>
        <p>Check-in: ${checkIn}</p>
        <p>Check-out: ${checkOut}</p>
        <p>Thank you for choosing our hotel. We look forward to serving you!</p>
        <p>For any further queries, please feel free to reach out to us:</p>
        <p>Email: <a href="mailto:debnathbiprajit@gmail.com">debnathbiprajit@gmail.com</a></p>
        <p>Contact: 8535062381</p>
      `
    };
  
    transporter.sendMail(mailOptions, function(err, info) {
      if (err) {
        console.log(err);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  }



  app.get('/dsb/payment', (req, res) => {
    const { status, transactionId } = req.query;
    res.render('payment.ejs');
  });


function processPayment(cardNumber, expiration, cvv) {
  if (cardNumber.length === 12 && cvv.length === 3) {
      const transactionId = uuidv4(); 
      return Promise.resolve({ status: 'success', transactionId });
  } else {
      return Promise.resolve({ status: 'failure', message: 'Invalid card details' });
  }
}

// Routes


app.post('/dsb/processPayment', async (req, res) => {
    const { cardNumber, expiration, cvv } = req.body;

    try {
        const paymentResult = await processPayment(cardNumber, expiration, cvv);

        if (paymentResult.status === 'success') {
            res.redirect(`/dsb/paymentResult?status=success&transactionId=${paymentResult.transactionId}`);
        } else {
            res.redirect('/dsb/paymentResult?status=failure');
        }
    } catch (error) {
        res.redirect('/dsb/paymentResult?status=failure');
    }
});

app.get('/dsb/paymentResult', (req, res) => {
  const { status, transactionId } = req.query;
  res.render('paymentresult.ejs', { paymentStatus: status, transactionId });
});



app.delete('/dsb/form/delete/:aadhar', function(req, res) {
    let aadhar = req.params.aadhar;
  
    db.collection('detail').deleteOne({ aadhar: aadhar }, function(err, result) {
      if (err) {
        console.log(err);
        return res.status(500).send("Error deleting the record!");
      }
  
      if (result.deletedCount > 0) {
        console.log("Record deleted successfully");
        return res.send("Record deleted successfully!");
      } else {
        console.log("Record not found");
        return res.status(404).send("Record not found!");
      }
    });
  });
  
  
  const Detail = require('./models/detail');
  
  
  app.put("/dsb/form/update", (req, res) => {
    let query = { aadhar: req.body.aadhar };
    Detail.findOneAndUpdate(query, req.body, { new: true })
      .then(() => {
        res.send("Record updated successfully!");
      })
      .catch(() => {
        res.status(400).send("Error updating the record!");
      });
  });
  
  
  app.get("/dsb/form/retrieve", (req, res) => {
    let query = { aadhar: req.query.aadhar };
    Detail.findOne(query)
      .then((data) => {
        res.send(data);
      })
      .catch(() => {
        res.send(null);
      });
  });
  



  app.use(function (req, res, next) {
    let err = new Error('File Not Found');
    err.status = 404;
    next(err);
  });
  
  
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.send(err.message);
  });



const PORT = process.env.PORT || 7003;
app.listen(PORT, function () {
  console.log(`Server is started on http://127.0.0.1:${PORT}`);
});