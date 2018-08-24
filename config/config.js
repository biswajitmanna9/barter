var express = require('express'),
  path = require('path'),
  env = process.env['NODE_ENV'] || 'development',
  logger = require('morgan'),
  bodyParser = require('body-parser'),
  cookieParser = require('cookie-parser'),
  cookieSession = require('cookie-session');
var port = normalizePort(process.env.PORT || 9001);
var debug = require('debug')('mean-app:server');
var http = require('http');

// Set environment
keys = (env === 'production') ? require('./productionKeys')[env] : require('./keys')[env];

// Config

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  'extended': 'false'
}));


app.use(express.static(path.join(__dirname, 'dist')));

// app.set('views', express.static(path.join(__dirname, 'dist')));
// app.set('view engine', 'html');

var flash = require('connect-flash');
app.use(flash());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(cookieParser(keys.secret));
app.use(cookieSession({
  name: 'session',
  keys: [keys.clientSecret],
  maxAge: 1000 * 86400
}));

app.set('port', port);

// Server static files from
// app.get('*.*', express.static(path.join(__dirname, 'dist')));

// All regular routes use the Universal engine
// app.get('*', (req, res) => {
//   res.render('index.html', {
//     req
//   });
// });

var server = http.createServer(app);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);



module.exports = function (passport) {
  app.use(passport.initialize());
  app.use(passport.session());
  return app;
};

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string' ?
    'Pipe ' + port :
    'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string' ?
    'pipe ' + addr :
    'port ' + addr.port;
  debug('Listening on ' + bind);
}
