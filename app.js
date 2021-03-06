#!/usr/bin/env node

var { Connect: ConnectToMongodb } = require('./db.js');
ConnectToMongodb();

var express = require('express');
var path = require('path');
var _ = require('lodash');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var Web3 = require('./lib/web3');
var Consensus = require('./lib/consensus');

var config = {};

try {
  config = require('./config.json');
} catch(e) {
  if (e.code == 'MODULE_NOT_FOUND') {
    console.log('No config file found. Using default configuration... (config.example.json)');
    config = require('./config.json');
  } else {
    throw e;
    process.exit(1);
  }
}

var app = express();
app.set('port', process.env.PORT || 3000);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// app libraries
global.__lib = __dirname + '/lib/';


app.use(async function(req, res, next) {
  var web3 = Web3();
  var consensus = Consensus();
  if (!_.isUndefined(web3) && !web3.isConnected()) {
    res.status(403);
    res.render('error', {
      message: 'Web3 is not connected',
      error: {}
    });
  } else if (!await consensus.isConnected()) {
    res.status(403);
    res.render('error', {
      message: 'Tendermint is not connected',
      error: {}
    });
  } else {
    next();
  }
});

app.get('/', function(req, res) {
  res.render('index', config);
});

app.get('/config', function(req, res) {
  res.json(config.settings);
});

require('./routes')(app);

// let angular catch them
app.use(function(req, res) {
  res.render('index', config);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}


// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

var http = require('http').Server(app);
//var io = require('socket.io')(http);

// web3socket(io);

http.listen(app.get('port'), '0.0.0.0', function() {
    console.log('Express server listening on port ' + app.get('port'));
});