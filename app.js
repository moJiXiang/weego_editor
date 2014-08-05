
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , engine = require('ejs-locals');
var app = express();
var server = require('http').Server(app);

app.configure(function(){
  app.set('port', process.env.PORT || 3003);
  app.engine('ejs', engine);
  app.locals({
    _layoutFile: true
  })
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('to be changed'));
  // app.use(express.cookieSession({key: 'sid', secret: 'to be changed'}));
  app.use(express.session({ secret: "to be changed" , key: 'sid'}));
  app.use(function(req, res, next){
      res.locals.session = req.session;
      next();
  });
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

//label
routes(app);


server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
