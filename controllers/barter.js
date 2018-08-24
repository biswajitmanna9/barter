var Post = require('../models/post').Post,
  Conversation = require('../models/conversation').Conversation,
  Message = require('../models/message').Message,
  utils = require('../config/utils'),
  _ = require('lodash');

//  Function to find and update conversation
var changeBarterStatus = function (req, post, status) {
  _.each(post.conversations, function (conversation) {
    if (conversation._id.equals(req.params.id)) {
      conversation.accepted = status;
      return;
    }
  });
};

// General update barter trade status (accepted or rejcted)
// Find the correct barter and update the status
var updateBarter = function (req, res, err, status) {
  utils.handleError(err, 500);
  Post.findOne({
    'conversations._id': req.params.id
  }, function (err, post) {
    utils.handleError(err, 500);
    changeBarterStatus(req, post, status);
    utils.saveChanges(res, post, 204, 500);
  });
};

// Set barter request to accepted
var acceptBarter = function (req, res, next) {
  console.log('accept');
  console.log('req.body.return_post_id', req.body.return_post_id);
  Post.update({
    'conversations._id': req.params.id
  }, {
    $set: {
      'completed': true
    }
  }, function (err) {
    if (req.body.return_post_id) {
      Post.update({
        '_id': req.body.return_post_id
      }, {
        $set: {
          'completed': true
        }
      }, function (err) {
        updateBarter(req, res, err, true);
      });
    }
  });
};

// Set barter request to rejected
var rejectBarter = function (req, res, next) {
  Post.findOne({
    'conversations._id': req.params.id
  }, function (err, post) {
    updateBarter(req, res, err, false);
  });

};

var fbnotify = function (req, res, next) {
  console.log('SESSIONin');
  console.log(req.session);

  const request = require('request-promise');

  const id = req.session.passport.user.fbId;
  //    const access_token = req.session.user_access_token;
  const access_token = '413420495745137|a8738cedeb39a7df36cbeeb833fc9c76';

  const postTextOptions = {
    method: 'POST',
    uri: `https://graph.facebook.com/${id}/notifications`,
    qs: {
      access_token: access_token,
      message: 'Hello world!',
      href: '/fbnotify',
      template: 'testing'
    }
  };
  request(postTextOptions);
  res.send(200);
}
module.exports = {
  acceptBarter: acceptBarter,
  rejectBarter: rejectBarter,
  fbnotify: fbnotify,
};
