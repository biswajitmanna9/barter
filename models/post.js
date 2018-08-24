var mongoose = require('mongoose');
var conversationSchema = require('./conversation').conversationSchema;

// Post schema has conversation schema as a subdocument
var postSchema = new mongoose.Schema({
  'fbId': String,
  'user_average_score': {
    'type': Number,
    'default': 0
  },
  'name': String,
  'itemName': String,
  'description': String,
  'condition': String,
  'poster_barter_rating': {
    'type': Number,
    'default': 0
  }, //rating given to poster by requester for current post
  'requester_barter_rating': {
    'type': Number,
    'default': 0
  }, //rating given to  requester by poster for current post
  'completed': {
    'type': Boolean,
    'default': false
  },
  'loc': {
    'type': {
      'type': String,
      index: true
    },
    'coordinates': []
  },
  'createdAt': {
    'type': Date,
    'default': Date.now
  },
  'image': String,
  'image_full': String,
  'conversations': [conversationSchema]
});

var Post = mongoose.model('Post', postSchema);

module.exports = {
  Post: Post,
  postSchema: postSchema
};
