var express = require('express');
var cors = require('cors');
var path = require('path');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
var winston = require('./winston');

// Routes
var dashboard = require('./routes/dashboard');
var vmc = require('./routes/vmc');
var receipts = require('./routes/receipts');
var system = require('./routes/system');


var app = express();

var corsOptions = {
    origin: "*",
    headers: "Origin, X-Requested-With, Content-Type, Accept"
}

app.use(cors(corsOptions));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(morgan('combined', { stream: winston.stream }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.options('*', cors()) // include before other routes

app.use('/', dashboard);
app.use('/dashboard', dashboard);
app.use('/vmc', vmc);
app.use('/receipts', receipts);
app.use('/system', system);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // add this line to include winston logging
    winston.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;