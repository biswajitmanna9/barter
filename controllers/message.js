var Post = require('../models/post').Post,
  Conversation = require('../models/conversation').Conversation,
  Message = require('../models/message').Message,
  FbUsers = require('../models/facebook').FbUsers,
  FeedbackUsers = require('../models/feedback').FeedbackUsers,
  utils = require('../config/utils'),
  _ = require('lodash');

// Function to add message to conversation
var addMessageToConversation = function (req, post, message) {
  _.each(post.conversations, function (conversation) {
    if (conversation._id.equals(req.body._id)) {
      conversation.messages.push(message);
      return;
    }
  });
};

// Add a new conversation to the posting
var sendNewConversation = function (req, res, next) {
  var message = new Message({
    'message': req.body.message,
    'from': req.body.from
  });
  console.log('req.body.requestingUser', req.body.requestingUser);
  console.log('req.body.requestingUser.return_post_id', req.body.requestingUser.return_post_id);
  var conversation = new Conversation({
    'requestingUser': {
      'fbId': req.body.requestingUser.fbId,
      'name': req.body.requestingUser.name,
      'return_post_id': req.body.requestingUser.return_post_id,
    },
    'messages': [message]
  });
  Post.update({
    '_id': req.body._id
  }, {
    $push: {
      'conversations': conversation
    }
  }, function (err) {
    utils.handleError(err, 500);
    res.send(201);
  });
};

// Add a new message to the conversation
var sendMessage = function (req, res, next) {
  var message = new Message({
    'message': req.body.message,
    'from': req.body.from
  });
  Post.findOne({
    'conversations._id': req.body._id
  }, function (err, post) {
    utils.handleError(err, 500);
    addMessageToConversation(req, post, message);
    utils.saveChanges(res, post, 201, 500);
  });
};

// Delete conversation in the posting
var deleteConversation = function (req, res, next) {
  Post.findOne({
    'conversations._id': req.params.id
  }, function (err, post) {
    utils.handleError(err, 500);
    post.conversations.id(req.params.id).remove();
    utils.saveChanges(res, post, 204, 500);
  });
};


var giveRating = function (req, res, next) {
  console.log(req.body);
  console.log('req.body._id', req.body._id);
  //    return  false;

  var rating_from_fbId = req.body.rating_from_fbId;
  var post_requesting_user_fbId = req.body.post_requesting_user_fbId;
  var poster_fbId = req.body.poster_fbId;
  var post_id = req.body.post_id;
  var user_id_to_update = '';

  var ratingValue = req.body.ratingValue;
  console.log('ratingValue', ratingValue);
  var post = {

  }
  if (rating_from_fbId == poster_fbId) {
    user_id_to_update = post_requesting_user_fbId;
    post.requester_barter_rating = ratingValue;
  } else if (rating_from_fbId == post_requesting_user_fbId) {
    user_id_to_update = poster_fbId;
    post.poster_barter_rating = ratingValue;
  } else {
    res.send(500);
  }
  console.log('user_id_to_update', user_id_to_update);
  console.log('here_post', post);

  //return false;
  Post.findOneAndUpdate({
    _id: req.body.post_id
  }, post, {
    new: true
  }, function (err, doc) {
    utils.handleError(err, 500);
    FbUsers.findOneAndUpdate({
      fbId: user_id_to_update
    }, {
      $inc: {
        "barter_score": ratingValue,
        "people_rate_count": 1
      }
    }, {
      new: true
    }, function (err, doc) {
      utils.handleError(err, 500);
      return res.send("succesfully Rated");
    });
  });
  //    FbUsers.findOne({fbId: user_id_to_update}, function (err, fbuser) {
  //        console.log(fbuser);
  //     var new_barter_score= parseInt(fbuser.barter_score)+parseInt(ratingValue);
  //     var people_rate_count= parseInt(fbuser.people_rate_count)+parseInt(1);
  //      
  //         FbUsers.findOneAndUpdate({fbId: user_id_to_update}, {barter_score:new_barter_score,people_rate_count:people_rate_count}, {new : true}, function (err, doc) {
  //        utils.handleError(err, 500);
  //        return res.send("succesfully Rated");
  //    });
  //    });

};


//Send feedback from User to admin

var send_feedback = function (req, res, next) {
  //    console.log(req.body);
  user_email = '';
  if (req.body.user_email) {
    user_email = req.body.user_email;

  }

  user_name = req.body.user_name;
  user_message = req.body.user_message;
  fbId = req.body.fbId;

  var env = process.env['NODE_ENV'] || 'development',
    keys;

  // Set environment
  keys = (env === 'production') ? require('../../config/productionKeys')[env] : require('../../config/keys')[env];
  var feedback = new FeedbackUsers({
    'fbId': fbId,
    'name': user_name,
    'email': user_email,
    'message': user_message
  });
  feedback.save(function (err) {
    utils.handleError(err, 500);
    var nodemailer = require('nodemailer');
    var transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: keys.email_auth_user,
        pass: keys.email_auth_password
      }
    });
    var mailOptions = {
      from: keys.email_auth_user,
      to: keys.admin_email,
      subject: 'Barter App - Feedback From ' + user_email + ' ' + user_name,
      html: 'Hello Admin,<br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ' + user_message
    };
    console.log(mailOptions);
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log('in_error', error);
        //  utils.handleError(error, 500);
        res.send(500);
      } else {
        console.log('Email sent: ' + info.response);
        res.send(200);
      }
    });


  });

};

//check whether user already gave feedback to app

var user_gave_feedback = function (req, res, next) {
  console.log('req.params.fbId', req.params.fbId);
  FeedbackUsers.findOne({
    'fbId': req.params.id
  }, function (err, feedback) {
    console.log(feedback);
    utils.handleError(err, 500);
    res.send(200, feedback);
  });
};

//var user=function(req, res, next){
//       FbUsers.findOneAndUpdate({fbId: user_id_to_update}, {$inc: {"barter_score": ratingValue, "people_rate_count": 1}}, {new : true}, function (err, doc) {
//            utils.handleError(err, 500);
//            return res.send("succesfully Rated");
//        });
//}
module.exports = {
  sendNewConversation: sendNewConversation,
  sendMessage: sendMessage,
  deleteConversation: deleteConversation,
  giveRating: giveRating,
  send_feedback: send_feedback,
  user_gave_feedback: user_gave_feedback,
  //        user: user
};
