var Post = require('../models/post').Post,
  Conversation = require('../models/conversation').Conversation,
  FbUsers = require('../models/facebook').FbUsers,
  Message = require('../models/message').Message,
  utils = require('../config/utils'),
  _ = require('lodash');

var getUserRating = function (fbId, callback) {
  FbUsers.findOne({
    fbId: fbId
  }, function (err, fbuser) {
    var user_average_score = 0;
    if (fbuser) {
      if (fbuser.people_rate_count) {
        user_average_score = fbuser.barter_score / fbuser.people_rate_count;
      }
    }

    callback && callback(user_average_score);

  });
  console.log('here_user_average_score', user_average_score);
  return user_average_score;
}



// Send back all posts
var posts = function (req, res, next) {
  //    5a69fd5893e95d0c1d1d7810
  console.log(req.body.fb_friends);
  if (req.body.fb_friends && req.body.fb_friends == 'true') {

    function getFbData(accessToken, apiPath, callback) {
      var https = require('https');

      var options = {
        host: 'graph.facebook.com',
        port: 443,
        path: '/me/friends?access_token=' + accessToken, //apiPath example: '/me/friends'
        method: 'GET'
      };

      var buffer = ''; //this buffer will be populated with the chunks of the data received from facebook
      var request = https.get(options, function (result) {
        result.setEncoding('utf8');
        result.on('data', function (chunk) {
          buffer += chunk;
        });

        result.on('end', function () {
          callback(buffer);
        });
      });

      request.on('error', function (e) {
        console.log('error from facebook.getFbData: ' + e.message)
      });

      request.end();
    }
    var accessToken = req.session.user_access_token;
    getFbData(accessToken, '/me/friends', function (output) {
      friends_data = JSON.parse(output);
      friends_list = friends_data.data;
      friend_ids = [];
      for (var i = 0; i < friends_list.length; i++) {
        friend_ids.push(friends_list[i].id);
      }
      console.log('friend_ids', friend_ids);
      Post.find({
          fbId: {
            $in: friend_ids
          }
        }, {
          image_full: 0
        }).exec()
        //        Post.find({}).exec()
        .then(function (posts) {
          //                    console.log('posts',posts);
          var all_posts = [];
          var length = posts.length;
          console.log('length', length);
          if (length) {

            posts.forEach(function (post, index) {

              FbUsers.findOne({
                fbId: post.fbId
              }).exec().then(function (fbuser) {
                var user_average_score = 0;
                if (fbuser) {
                  if (fbuser.people_rate_count) {
                    user_average_score = fbuser.barter_score / fbuser.people_rate_count;
                  }
                }
                post.user_average_score = Math.round(user_average_score.toFixed(2));
                all_posts.push(post);
                if (all_posts.length === length) {
                  res.send(200, all_posts);
                }
              });
            });
          } else {
            res.send(200, all_posts);
          }
        });
    });
  } else {
    Post.find({}, {
        image_full: 0
      }).exec()
      .then(function (posts) {
        //                    console.log('posts',posts);
        var all_posts = [];
        var length = posts.length;
        posts.forEach(function (post, index) {

          FbUsers.findOne({
            fbId: post.fbId
          }).exec().then(function (fbuser) {
            var user_average_score = 0;
            if (fbuser) {
              if (fbuser.people_rate_count) {
                user_average_score = fbuser.barter_score / fbuser.people_rate_count;
              }
            }
            post.user_average_score = Math.round(user_average_score.toFixed(2));
            all_posts.push(post);
            if (all_posts.length === length) {
              res.send(200, all_posts);
            }
          });
        });
      });
  }


};
//var posts = function (req, res, next) {
//    Post.find({}, function (err, posts) {
//        utils.handleError(err, 500);
//        var all_posts = [];
//        posts.forEach(function (post) {
//            var user_average_score = 0;
//    let newBookmark = FbUsers.findOne({fbId: post.fbId}, function (err, fbuser) {
//        var user_average_score = 0;
//        if (fbuser) {
//            if (fbuser.people_rate_count) {
//               user_average_score = fbuser.barter_score / fbuser.people_rate_count;
//            }
//        }
//            
//  post.user_average_score = user_average_score;
//                            console.log('post.user_average_score', post.user_average_score);
//
//                all_posts.push(post);
//    });
//              
//
//
//  
//   
//                console.log('posting',post.user_average_score);
//
////            setTimeout(function () {
//                post.user_average_score = user_average_score;
//                            console.log('post.user_average_score', post.user_average_score);
//
//                all_posts.push(post);
////            }, 3000);
//        });
////        console.log('all_posts',all_posts);
//        res.send(200, all_posts);
//    });
//};
var getpost = function (req, res, next) {
  Post.findById({
    _id: req.params.id
  }, function (err, post) {
    utils.handleError(err, 500);
    res.send(200, post);
  });
};

// Create post and save it to the database
var postItem = function (req, res, next) {
  var image = req.body.image.resized.dataURL;
  var image_full = req.body.image.dataURL;
  var post = new Post({
    'fbId': req.body.fbId,
    'name': req.body.name,
    'itemName': req.body.itemName,
    'description': req.body.description,
    'condition': req.body.condition,
    'loc': {
      type: 'Point',
      coordinates: [req.body.location[1], req.body.location[0]]
    },
    'image': image,
    'image_full': image_full,
  });
  utils.saveChanges(res, post, 201, 500);
};

// Delete post from the database
var deletePost = function (req, res, next) {
  Post.findByIdAndRemove(req.params.id, function (err) {
    utils.handleError(err, 500);
    res.send(204);
  });
};


// Update post and save it to the database
var updatePost = function (req, res, next) {

  var post = {
    'fbId': req.body.fbId,
    'name': req.body.name,
    'itemName': req.body.itemName,
    'description': req.body.description,
    'condition': req.body.condition,
    'loc': {
      type: 'Point',
      coordinates: [req.body.location[1], req.body.location[0]]
    },
  }
  if (req.body.image.resized.dataURL) {
    post.image = req.body.image.resized.dataURL;
  }
  if (req.body.image.dataURL) {
    post.image_full = req.body.image.dataURL;
  }
  Post.findOneAndUpdate({
    _id: req.body.post_id
  }, post, {
    new: true
  }, function (err, doc) {
    utils.handleError(err, 500);
    return res.send("succesfully updated");
  });
};
var getpostimage = function (req, res, next) {
  Post.findById({
    _id: req.body.id
  }, function (err, post) {
    utils.handleError(err, 500);
    if (post.image_full) {
      image = post.image_full;
    } else {
      image = post.image;
    }
    res.send(200, image);
  });
};
module.exports = {
  posts: posts,
  post: postItem,
  getpost: getpost,
  deletePost: deletePost,
  updatePost: updatePost,
  getpostimage: getpostimage,
};
