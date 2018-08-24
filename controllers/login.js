// Sends index.jade
var index = function (req, res, next) {
  res.render('index');
};

// Check if user is logged in
var loggedIn = function (req, res) {
  console.log('session', req.session);
  //    if(req.isAuthenticated()) {
  //        req.session.user = req.user;
  //    }
  console.log('req.isAuthenticated', req.isAuthenticated());
  console.log('session--', req.session);
  res.send(req.isAuthenticated() ? req.user : '401');
};

// Logs the user out and redirects to landing page
var loggedOut = function (req, res) {
  req.logOut();
  res.redirect('/');
};

module.exports = {
  index: index,
  loggedIn: loggedIn,
  loggedOut: loggedOut
};
