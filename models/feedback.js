var mongoose = require('mongoose');

// Facebook User Schema to keep track of fbId and name
var feedbackUserSchema = new mongoose.Schema({
  'fbId': String,
  'name': String,
  'email': String,
  'message': String
});

var FeedbackUsers = mongoose.model('feedback_users', feedbackUserSchema);

module.exports = {
  FeedbackUsers: FeedbackUsers,
  feedbackUserSchema: feedbackUserSchema
};
