var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var request = require('request')


// var passwordHash = require('password-hash');


var bodyParser = require('body-parser');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');


// DataBase 
var mysql = require("mysql");
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "muzmatch"
});
con.connect(function(err){
  if(err){
    console.log('Error connecting to Db');
    return;
  }
  console.log('Connection established');
});


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(session({secret: 'mySecret', resave: false, saveUninitialized: false}));




// Make our db accessible to our router
app.use(function(req,res,next){
    req.con = con;
    next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.use(function (req, res, next) {
  if (!req.session.authStatus || 'loggedOut' === req.session.authStatus) {
    req.session.authStatus = 'loggingIn';

    // cause Express to issue 401 status so browser asks for authentication
    req.user = false;
    req.remoteUser = false;
    if (req.headers && req.headers.authorization) { delete req.headers.authorization; }
  }
  next();
});

module.exports = app;
