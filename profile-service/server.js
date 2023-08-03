let express = require('express');
let env = require('dotenv').config()
let ejs = require('ejs');
let path = require('path');
let app = express();
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
let session = require('express-session');
let MongoStore = require('connect-mongo')(session);

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
app.use('/pr/css', express.static(__dirname + '/views/css'));

const routes = require('./routes');
app.use('/pr', routes);

app.post('/pr/check_room_availability', function(req, res) {
    let room = req.body.room;
    let checkIn = new Date(req.body.checkIn);
    let checkOut = new Date(req.body.checkOut);
  
    db.collection('detail').findOne({
        room: room,
        $or: [
            { $and: [{ checkIn: { $lte: checkIn } }, { checkOut: { $gt: checkIn } }] },
            { $and: [{ checkIn: { $lt: checkOut } }, { checkOut: { $gte: checkOut } }] },
            { $and: [{ checkIn: { $gte: checkIn } }, { checkOut: { $lte: checkOut } }] }
        ]
    }, function(err, result) {
        if (err) throw err;
  
        if (result) {
            return res.redirect('/dsb/roombooked');
        } else {
            return res.redirect('/dsb/create');
        }
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



const PORT = process.env.PORT || 7002;
app.listen(PORT, function () {
  console.log(`Server is started on http://127.0.0.1:${PORT}`);
});

