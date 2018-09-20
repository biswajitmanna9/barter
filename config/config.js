module.exports = function(passport){
  var express = require('express'),
      path = require('path'),
      stylus = require('stylus'),
      env = process.env['NODE_ENV'] || 'development',
      keys;
  // Set environment
  keys = (env === 'production') ? require('./productionKeys')[env] : require('./keys')[env];

  // Middleware used to compile stylus
  var compile = function(str, path) {
    return stylus(str).set('filename', path);
  };
  // Config
  var app = express();
  var port = process.env.PORT || 9001;
  app.set('views', __dirname + '/../app/views');
  app.set('view engine', 'jade');
  app.use(stylus.middleware({ src: __dirname + '/../public', compile: compile }));
  app.use(express.static(path.join(__dirname, '/../public')));
  app.use('/ang-autocomplete', express.static(__dirname + './../node_modules/angucomplete-ie8/'));
  var flash = require('connect-flash');
  app.use(flash());
  app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));
const MongoStore = require('connect-mongo')(express);
app.configure(function() {
  app.use(express.bodyParser());
  app.use(express.cookieParser('your secret here'));
app.use(express.session({secret:'keyboard cat', cookie:{maxAge: 1000 * 86400}, store: new MongoStore({ url: keys.DB })}));
  app.use(passport.initialize());
  app.use(passport.session());
});



  app.listen(port, function() {
  
    console.log('Listening on ' + port);
  });

  return app;
};
