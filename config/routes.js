module.exports = function (app, passport, db) {
  var loginCtrl = require('../controllers/login'),
    barterCtrl = require('../controllers/barter'),
    postCtrl = require('../controllers/post'),
    messageCtrl = require('../controllers/message');

  // Middleware used to determine if the user is authenticated
  var auth = function (req, res, next) {
    //          if(req.session.user) {
    //                next();
    //          } else {
    !req.isAuthenticated() ? res.send(401) : next();
    //          }
  };
  //    console.log(loginCtrl.index);
  // Login Routes
  app.get('/', loginCtrl.index);
  app.get('/loggedIn', loginCtrl.loggedIn);
  app.get('/logout', loginCtrl.loggedOut);
  app.get('/auth/facebook', passport.authenticate('facebook', {
    scope: 'user_friends'
  }));

  app.get('/auth/callback/facebook', passport.authenticate('facebook', {
    failureRedirect: '/',
    failureFlash: true,
    successRedirect: '/',
    //    failureRedirect: '/',

  }), function (req, res) {
    // Explicitly save the session before redirecting!
    //        console.log('redirected',req);
    //        console.log('redirected_session',req.session);
    //    req.session.save(() => {
    //         
    //      res.redirect('/');
    //    })
  });

  app.get('/fbnotify', auth, barterCtrl.fbnotify);
  app.post('/fbnotify?fb_source=notification', loginCtrl.loggedIn);

  // Post Controls
  app.get('/posts', postCtrl.posts);
  app.post('/posts', postCtrl.posts);
  app.get('/post/:id', postCtrl.getpost);
  app.post('/getpostimage', postCtrl.getpostimage);
  app.post('/post', postCtrl.post);
  app.delete('/post/:id', postCtrl.deletePost);
  //Update Post
  app.post('/updatePost', postCtrl.updatePost);


  // Message Controls
  app.post('/conversation', messageCtrl.sendNewConversation);
  app.post('/message', messageCtrl.sendMessage);
  app.delete('/conversation/:id', messageCtrl.deleteConversation);

  // Barter Request Controls
  app.put('/barter/accept/:id', barterCtrl.acceptBarter);
  app.put('/barter/reject/:id', barterCtrl.rejectBarter);

  //Rating

  app.post('/rating', messageCtrl.giveRating);


  //App Feedback
  app.get('/user_gave_feedback/:id', messageCtrl.user_gave_feedback);
  app.post('/send_feedback', messageCtrl.send_feedback);


  //Users
  //    app.get('/user/:id', auth, postCtrl.user);


};
