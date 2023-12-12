var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const jwt = require('jsonwebtoken');

var indexRouter = require('./routes/index');
var accountRouter = require('./controllers/account');
var eventLogRouter = require('./controllers/eventLog');
var userRouter = require('./controllers/user');
var cardRouter = require('./controllers/card');
var automatRouter = require('./controllers/automat');
var loginRouter = require('./controllers/login');
var frontendEventsRouter = require('./controllers/eventRequests_frontend');
var cardPinAttempts = require('./controllers/card_pin_attempts');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/cardAttempts',cardPinAttempts);
app.use('/login', loginRouter);

app.use(authenticateToken);

app.use('/', indexRouter);
app.use('/card', cardRouter);
app.use('/account',accountRouter);
app.use('/eventLog', eventLogRouter);
app.use('/user', userRouter);
app.use('/automat', automatRouter);
app.use('/frontendEvents',frontendEventsRouter);

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
  
    console.log("token = "+token);
    if (token == null) return res.sendStatus(401)
  
    jwt.verify(token, process.env.MY_TOKEN, (err, user) => {
      console.log(err)
  
      if (err) return res.sendStatus(403)
  
      req.user = user
  
      next()
    })
}

module.exports = app;
