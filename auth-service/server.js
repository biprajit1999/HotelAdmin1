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

app.use(express.static(__dirname + '/views'));

const routes = require('./routes');

app.use('/', routes);



const PORT = process.env.PORT || 5005;
app.listen(PORT, function () {
  console.log(`Server is started on http://127.0.0.1:${PORT}`);
});