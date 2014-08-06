
/**
 * Module dependencies.
 */

var express = require('express'),
    http = require('http')
    path = require('path'),
    conf = require('./config/Config.js')
    winston = require('winston'),
    // expressWinston = require('express-winston'), //should make use of it
    log = winston;

//init logging
winston.add(winston.transports.File, { filename: conf.workdir + '/app.log' });

var app     = express(),
    server  = http.Server(app);

app.configure(function(){
    app.set('port', process.env.PORT || conf.port || 3003);
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser('to be changed'));
    app.use(express.session({ secret: "to be changed" , key: 'sid'}));
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

require('./routes')(app);

server.listen(app.get('port'), function(){
    log.info('Express listening on %s', app.get('port'));
});
